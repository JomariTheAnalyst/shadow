import { Router } from "express";
import { prisma } from "@repo/db";
import { FILE_SIZE_LIMITS } from "@repo/types";
import { createWorkspaceManager, createGitService } from "../execution";
import { getGitHubFileChanges } from "../utils/github-file-changes";
import { buildFileTree } from "./build-tree";

const router = Router();

// Get file tree for a task workspace
router.get("/:taskId/files/tree", async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        status: true,
        workspacePath: true,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    if (!task.workspacePath || task.status === "INITIALIZING") {
      return res.json({
        success: true,
        tree: [],
      });
    }

    const workspaceManager = createWorkspaceManager();
    const executor = await workspaceManager.getExecutor(taskId);

    const tree = await buildFileTree(executor);

    res.json({
      success: true,
      tree,
    });
  } catch (error) {
    console.error("[FILE_TREE_API_ERROR]", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get file content for a task workspace
router.get("/:taskId/files/content", async (req, res) => {
  try {
    const { taskId } = req.params;
    const filePath = req.query.path as string;

    if (!filePath) {
      return res.status(400).json({
        success: false,
        error: "File path is required",
      });
    }

    // Verify task exists
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        status: true,
        workspacePath: true,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    // Check if workspace is ready
    if (!task.workspacePath || task.status === "INITIALIZING") {
      return res.status(400).json({
        success: false,
        error: "Workspace is still initializing",
      });
    }

    // Convert path: remove leading slash and handle relative paths
    const targetPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;

    // 1. Get file stats and check size
    const workspaceManager = createWorkspaceManager();
    const executor = await workspaceManager.getExecutor(taskId);
    const statsResult = await executor.getFileStats(targetPath);

    if (!statsResult.success) {
      // Check if it's a file not found error (ENOENT)
      const isFileNotFound =
        statsResult.error?.includes("ENOENT") ||
        statsResult.error?.includes("no such file or directory");

      return res.status(isFileNotFound ? 404 : 400).json({
        success: false,
        error: statsResult.error || "Failed to get file stats",
        errorType: isFileNotFound ? "FILE_NOT_FOUND" : "UNKNOWN",
      });
    }

    if (!statsResult.stats?.isFile) {
      return res.status(400).json({
        success: false,
        error: "Path is not a file",
      });
    }

    // 2. Check size limit
    if (statsResult.stats.size > FILE_SIZE_LIMITS.MAX_FILE_SIZE_BYTES) {
      return res.status(400).json({
        success: false,
        error: `File too large: ${statsResult.stats.size} bytes (max: ${FILE_SIZE_LIMITS.MAX_FILE_SIZE_BYTES} bytes)`,
      });
    }

    // 3. Read the file (any file type allowed)
    const result = await executor.readFile(targetPath);

    if (!result.success || !result.content) {
      return res.status(400).json({
        success: false,
        error: result.error || "Failed to read file",
      });
    }

    res.json({
      success: true,
      content: result.content,
      path: filePath,
      size: statsResult.stats.size,
      truncated: false,
    });
  } catch (error) {
    console.error("[FILE_CONTENT_API_ERROR]", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET /api/tasks/:taskId/file-changes - Get git-based file changes
router.get("/:taskId/file-changes", async (req, res) => {
  const startTime = Date.now();
  try {
    const { taskId } = req.params;

    // Validate task exists and get full status
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        workspacePath: true,
        status: true,
        baseBranch: true,
        shadowBranch: true,
        repoFullName: true,
        initStatus: true,
        userId: true,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    // Don't return file changes if task is still initializing
    if (task.status === "INITIALIZING") {
      return res.json({
        success: true,
        fileChanges: [],
        diffStats: { additions: 0, deletions: 0, totalFiles: 0 },
      });
    }

    // If task workspace is INACTIVE (cleaned up), use GitHub API
    if (task.initStatus === "INACTIVE") {
      if (!task.repoFullName || !task.shadowBranch) {
        return res.json({
          success: true,
          fileChanges: [],
          diffStats: { additions: 0, deletions: 0, totalFiles: 0 },
        });
      }

      const { fileChanges, diffStats } = await getGitHubFileChanges(
        task.repoFullName,
        task.baseBranch,
        task.shadowBranch,
        task.userId
      );

      return res.json({
        success: true,
        fileChanges,
        diffStats,
      });
    }

    // For ACTIVE tasks, use GitService abstraction (handles both local and remote modes)
    try {
      const gitService = await createGitService(taskId);

      const { fileChanges, diffStats } = await gitService.getFileChanges(
        task.baseBranch
      );

      res.json({
        success: true,
        fileChanges,
        diffStats,
      });
      return;
    } catch (error) {
      console.error(
        `[FILE_CHANGES_DEBUG] GitService error - taskId: ${taskId}:`,
        error
      );

      // Fallback to empty response on error
      res.json({
        success: true,
        fileChanges: [],
        diffStats: { additions: 0, deletions: 0, totalFiles: 0 },
      });
      return;
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `[FILE_CHANGES_DEBUG] Error in file-changes route - taskId: ${req.params.taskId}, duration: ${duration}ms`,
      error
    );
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export { router as filesRouter };

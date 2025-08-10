"use client";

import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { FileNode } from "@repo/types";
import { FileIcon } from "@/components/ui/file-icon";
import { SHADOW_WIKI_PATH } from "@/lib/constants";

interface FileChangeOperation {
  filePath: string;
  operation: string;
}

type BaseProps = {
  files: FileNode[];
  onFileSelect: (file: FileNode) => void;
};

type AgentEnvironmentProps = BaseProps & {
  isAgentEnvironment: true;
  selectedFilePath: string | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
};

type OtherViewProps = BaseProps & {
  isAgentEnvironment: false;
  fileChangeOperations: FileChangeOperation[];
  defaultFolderExpansion: boolean;
};

export function FileExplorer(props: AgentEnvironmentProps | OtherViewProps) {
  const isAgentEnvironment = props.isAgentEnvironment;
  const files = props.files;
  const onFileSelect = props.onFileSelect;

  const selectedFilePath = isAgentEnvironment ? props.selectedFilePath : null;
  const defaultFolderExpansion = isAgentEnvironment
    ? false
    : props.defaultFolderExpansion;

  // We use a single Set to track folder state.
  // If defaultFolderExpansion is true, the Set tracks collapsed folders (all open by default).
  // If defaultFolderExpansion is false, the Set tracks expanded folders (all closed by default).
  // This avoids up-front tree traversal and is efficient for both modes.
  // Note that these are prefixed with a slash.
  const [folderState, setFolderState] = useState<Set<string>>(new Set());

  const toggleFolder = (path: string) => {
    setFolderState((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  // Auto-expand folders leading to the selected file path
  useEffect(() => {
    if (isAgentEnvironment && selectedFilePath) {
      // Get all parent folder paths for the selected file
      const pathParts = selectedFilePath.split("/");
      const parentPaths: string[] = [];

      // Build all parent paths (excluding the file itself)
      for (let i = 1; i < pathParts.length; i++) {
        parentPaths.push(pathParts.slice(0, i).join("/"));
      }

      // Expand each parent folder if it's not already expanded
      setFolderState((prev) => {
        const next = new Set(prev);
        let hasChanges = false;

        parentPaths.forEach((parentPath) => {
          const shouldBeExpanded = next.has(parentPath);

          if (!shouldBeExpanded) {
            hasChanges = true;
            next.add(parentPath);
          }
        });

        return hasChanges ? next : prev;
      });
    }
  }, [selectedFilePath]);

  // Determine expansion based on defaultFolderExpansion mode and folderState
  // If defaultFolderExpansion: open unless in set; else: closed unless in set
  const isNodeExpanded = (path: string) =>
    defaultFolderExpansion ? !folderState.has(path) : folderState.has(path);

  const getOperationColor = (op: string) => {
    switch (op) {
      case "CREATE":
        return "text-green-400";
      case "UPDATE":
        return "text-yellow-600";
      case "DELETE":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getOperationLetter = (op: string) => {
    switch (op) {
      case "CREATE":
        return "A";
      case "UPDATE":
        return "M";
      case "DELETE":
        return "D";
      case "RENAME":
        return "R";
      case "MOVE":
        return "M";
      default:
        return "?";
    }
  };

  const renderNode = (node: FileNode, depth = 0) => {
    const isExpanded = isNodeExpanded(node.path);
    const isSelected = selectedFilePath === node.path;
    const fileChange =
      !isAgentEnvironment && props.fileChangeOperations.length > 0
        ? props.fileChangeOperations.find(
            (change) => change.filePath === node.path
          ) || null
        : null;
    const operation = fileChange?.operation;

    return (
      <div key={node.path} className="relative flex flex-col gap-0.5">
        {isExpanded && (
          <div
            className="bg-border absolute bottom-0 hidden h-[calc(100%-30px)] w-px group-hover/files:block"
            style={{ left: `${depth * 12 + 12}px` }}
          />
        )}
        <button
          className={`group/item text-foreground/80 hover:text-foreground flex cursor-pointer items-center gap-1.5 overflow-hidden rounded-md px-2 py-1 hover:bg-white/10 ${
            isSelected ? "bg-white/5" : ""
          } ${operation ? "justify-between" : ""}`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            if (node.type === "folder") {
              toggleFolder(node.path);
            } else if (onFileSelect) {
              onFileSelect(node);
            }
          }}
        >
          <div
            className="flex items-center gap-1.5 overflow-hidden"
            title={node.name}
          >
            {node.type === "folder" ? (
              isExpanded ? (
                <>
                  <FolderOpen className="size-4 shrink-0 group-hover/item:hidden" />
                  <ChevronDown className="hidden size-4 shrink-0 group-hover/item:block" />
                </>
              ) : (
                <>
                  <Folder className="size-4 shrink-0 group-hover/item:hidden" />
                  <ChevronRight className="hidden size-4 shrink-0 group-hover/item:block" />
                </>
              )
            ) : (
              <FileIcon filename={node.name} className="size-4" useFallback />
            )}
            <span className="truncate text-sm">{node.name}</span>
          </div>
          {node.type === "file" && operation && (
            <span
              className={cn(
                "text-xs font-medium",
                getOperationColor(operation)
              )}
            >
              {getOperationLetter(operation)}
            </span>
          )}
        </button>
        {node.type === "folder" && isExpanded && node.children && (
          <div className="flex flex-col gap-0.5">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // If being used in Agent Environment
  if (isAgentEnvironment) {
    if (!props.isCollapsed) {
      return (
        <div className="bg-sidebar border-border flex w-48 shrink-0 select-none flex-col overflow-hidden border-r">
          <div className="group/files flex w-full grow flex-col gap-0.5 overflow-y-auto p-1">
            {files.map((file) => renderNode(file))}
          </div>
          <div className="relative z-0">
            <div className="bg-vesper-orange/15 absolute -top-4 left-3 -z-10 h-8 w-1/3 animate-pulse blur-lg delay-500 duration-1000"></div>
            <div className="bg-vesper-teal/15 absolute -top-1 left-1/3 -z-10 h-6 w-2/3 animate-pulse blur-lg delay-0 duration-1000"></div>
            <div className="border-sidebar-border bg-sidebar/50 border-t p-1 backdrop-blur-lg">
              <button
                className={cn(
                  "group/item text-foreground/80 hover:text-foreground flex w-full cursor-pointer items-center gap-1.5 overflow-hidden rounded-md px-2 py-1 hover:bg-white/10",
                  selectedFilePath === SHADOW_WIKI_PATH ? "bg-white/5" : ""
                )}
                onClick={() => {
                  props.onFileSelect({
                    path: SHADOW_WIKI_PATH,
                    type: "file",
                    name: "Shadow Wiki",
                  });
                }}
              >
                <BookOpen className="size-4" />
                <span className="text-sm">Shadow Wiki</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  // If used outside of Agent Environment (e.g. agent-view sidebar)
  return (
    <div className="group/files flex flex-col gap-0.5">
      {files.map((file) => renderNode(file))}
    </div>
  );
}

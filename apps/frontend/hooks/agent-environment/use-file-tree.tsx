import { useQuery } from "@tanstack/react-query";
import { FileNode } from "@repo/types";

export interface FileTreeResponse {
  success: boolean;
  tree: FileNode[];
  error?: string;
}

export function useFileTree(taskId: string) {
  return useQuery({
    queryKey: ["file-tree", taskId],
    queryFn: async (): Promise<FileTreeResponse> => {
      const res = await fetch(`/api/tasks/${taskId}/files/tree`);
      if (!res.ok) {
        throw new Error("Failed to fetch codebase tree");
      }
      return res.json();
    },
    enabled: !!taskId,
  });
}

import { readFileSync } from "fs";
import { join, dirname } from "path";
import type { ToolSet } from "ai";

// Helper function to read tool instruction files
function readToolInstructions(toolName: string): string {
  const instructionsPath = join(
    dirname(__filename),
    toolName,
    "instructions.md"
  );
  return readFileSync(instructionsPath, "utf-8").trim();
}

// Static TOOL_GUIDANCE (for backward compatibility)
export const TOOL_GUIDANCE = `<tool_guidance>
## Tool Usage Patterns & Examples

### todo_write
${readToolInstructions("todo_write")}

### read_file
${readToolInstructions("read_file")}

### run_terminal_cmd
${readToolInstructions("run_terminal_cmd")}

### list_dir
${readToolInstructions("list_dir")}

### grep_search
${readToolInstructions("grep_search")}

### edit_file
${readToolInstructions("edit_file")}

### search_replace
${readToolInstructions("search_replace")}

### file_search
${readToolInstructions("file_search")}

### delete_file
${readToolInstructions("delete_file")}

### semantic_search
${readToolInstructions("semantic_search")}
</tool_guidance>`;

/**
 * Generate dynamic tool guidance based on available tools
 */
export function generateToolGuidance(availableTools?: ToolSet): string {
  if (!availableTools) {
    return TOOL_GUIDANCE; // Fallback to static guidance
  }

  const toolSections: string[] = [];

  // Always include core tools
  const coreTools = [
    "todo_write",
    "read_file",
    "run_terminal_cmd",
    "list_dir",
    "grep_search",
    "edit_file",
    "search_replace",
    "file_search",
    "delete_file",
  ];

  for (const toolName of coreTools) {
    if (availableTools[toolName]) {
      toolSections.push(`### ${toolName}\n${readToolInstructions(toolName)}`);
    }
  }

  // Conditionally include semantic search
  if (availableTools.semantic_search) {
    toolSections.push(
      `### semantic_search\n${readToolInstructions("semantic_search")}`
    );
  } else {
    // Add helpful message about semantic search availability
    toolSections.push(
      `### semantic_search (Currently Unavailable)\nSemantic search is not available for this repository yet. Code indexing may still be in progress. Use grep_search for pattern-based code searching instead.`
    );
  }

  return `<tool_guidance>
## Tool Usage Patterns & Examples

${toolSections.join("\n\n")}

### add_memory
${readToolInstructions("add_memory")}

### list_memories
${readToolInstructions("list_memories")}

### remove_memory
${readToolInstructions("remove_memory")}
</tool_guidance>`;
}

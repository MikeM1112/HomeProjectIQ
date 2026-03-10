import { TOOLS } from '@/lib/constants';
import type { ToolDefinition, Tool } from '@/types/app';

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'of', 'for', 'and', 'or', 'with', 'in', 'to', 'set',
]);

function tokenize(str: string): string[] {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

/**
 * Fuzzy-match a diagnosis tool name to a canonical TOOLS definition.
 * Priority: exact → prefix → contains → token overlap (≥2).
 */
export function matchToolToDefinition(name: string): ToolDefinition | null {
  const lower = name.toLowerCase().trim();

  // 1. Exact match (case-insensitive)
  const exact = TOOLS.find((t) => t.name.toLowerCase() === lower);
  if (exact) return exact;

  // 2. Canonical name is prefix of diagnosis name
  const prefix = TOOLS.find((t) => lower.startsWith(t.name.toLowerCase()));
  if (prefix) return prefix;

  // 3. Contains match (bidirectional)
  const contains = TOOLS.find(
    (t) =>
      lower.includes(t.name.toLowerCase()) ||
      t.name.toLowerCase().includes(lower)
  );
  if (contains) return contains;

  // 4. Token overlap (≥2 shared significant tokens)
  const inputTokens = tokenize(name);
  if (inputTokens.length >= 2) {
    let bestMatch: ToolDefinition | null = null;
    let bestOverlap = 0;
    for (const tool of TOOLS) {
      const toolTokens = tokenize(tool.name);
      const overlap = inputTokens.filter((t) => toolTokens.includes(t)).length;
      if (overlap >= 2 && overlap > bestOverlap) {
        bestOverlap = overlap;
        bestMatch = tool;
      }
    }
    if (bestMatch) return bestMatch;
  }

  return null;
}

export interface ClassifiedTool extends Tool {
  owned: boolean;
  definition: ToolDefinition | null;
}

/**
 * Classify diagnosis tools as owned/unowned based on user's toolbox.
 */
export function classifyDiagnosisTools(
  tools: Tool[],
  ownedToolIds: string[]
): ClassifiedTool[] {
  return tools.map((tool) => {
    const definition = matchToolToDefinition(tool.n);
    const owned = definition ? ownedToolIds.includes(definition.id) : false;
    return { ...tool, owned, definition };
  });
}

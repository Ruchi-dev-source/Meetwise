// Placeholder prompt builders. Each will be filled in when its
// corresponding feature (meeting summaries, AI scheduling, action-item
// extraction, chat, dashboard insights) is actually built — this phase is
// infrastructure only, per the task's explicit instructions. The
// signatures take a loosely-typed context object now so call sites for
// those future features can be wired up without this module's shape
// changing later; the parameters aren't used yet.

export function buildSchedulingPrompt(_context: Record<string, unknown>): string {
  return "TODO(ai): scheduling prompt not yet implemented — see PromptService.buildSchedulingPrompt";
}

export function buildSummaryPrompt(_context: Record<string, unknown>): string {
  return "TODO(ai): meeting summary prompt not yet implemented — see PromptService.buildSummaryPrompt";
}

export function buildActionItemsPrompt(_context: Record<string, unknown>): string {
  return "TODO(ai): action items prompt not yet implemented — see PromptService.buildActionItemsPrompt";
}

export function buildChatPrompt(_context: Record<string, unknown>): string {
  return "TODO(ai): chat prompt not yet implemented — see PromptService.buildChatPrompt";
}

export function buildDashboardPrompt(_context: Record<string, unknown>): string {
  return "TODO(ai): dashboard insights prompt not yet implemented — see PromptService.buildDashboardPrompt";
}

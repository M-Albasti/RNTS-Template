/** Workflow step ids — copy lives in translation files under `home.workflow.*`. */
export const WORKFLOW_STEP_IDS = [
  'onboard',
  'home',
  'social',
  'walletGame',
  'media',
] as const;

export type WorkflowStepId = (typeof WORKFLOW_STEP_IDS)[number];

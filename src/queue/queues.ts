export const queueNames = {
  campaignGeneration: "campaign-generation",
  metaPublishing: "meta-publishing",
  metaSync: "meta-sync",
  aiGeneration: "ai-generation",
  creativeGeneration: "creative-generation",
  landingPageGeneration: "landingpage-generation",
  reportGeneration: "report-generation",
  performanceAnalysis: "performance-analysis",
  email: "email",
} as const;

export type QueueName = (typeof queueNames)[keyof typeof queueNames];

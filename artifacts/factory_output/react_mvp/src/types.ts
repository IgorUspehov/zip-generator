export type RecordRow = Record<string, string | number | boolean | null | undefined>;

export type BusinessContent = {
  module: string;
  status: string;
  llm_used: boolean;
  business_type: string;
  pages: Record<string, unknown>;
  dashboard: {
    widgets?: string[];
    metrics?: Record<string, number>;
    summary?: Record<string, number>;
  };
  datasets: Record<string, RecordRow[]>;
};

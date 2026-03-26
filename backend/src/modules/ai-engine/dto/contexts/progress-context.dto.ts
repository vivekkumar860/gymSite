/** Context provided to the AI engine for progress trend summaries. */
export interface ProgressContextDto {
  userId: string;
  metricType: string;
  dataPoints: { date: string; value: number }[];
  goalTarget?: number;
  timeframeWeeks: number;
}

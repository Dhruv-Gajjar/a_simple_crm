import axiosInstance from "@/api";
import { DashboardAnalytics, ResponsePayload } from "@/types";

export const DashboardService = {
  getDashboardMetrics: async (): Promise<
    ResponsePayload<DashboardAnalytics>
  > => {
    const result = await axiosInstance.get("dashboard/metrics");
    return result.data;
  },
};

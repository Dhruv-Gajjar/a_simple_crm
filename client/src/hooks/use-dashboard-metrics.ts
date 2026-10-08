import { DashboardService } from "@/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";

const useDashboardMetrics = () => {
  const {
    data: dashboardMetricsData,
    isLoading: isDashboardMetricsLoading,
    isError: isDashboardMetricsError,
    error: dashboardMetricsError,
  } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const result = await DashboardService.getDashboardMetrics();

      return result;
    },
  });

  return {
    dashboardMetricsData,
    isDashboardMetricsLoading,
    isDashboardMetricsError,
    dashboardMetricsError,
  };
};

export default useDashboardMetrics;

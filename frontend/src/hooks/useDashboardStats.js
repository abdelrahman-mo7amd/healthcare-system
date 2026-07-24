import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => (await api.get("/dashboard/stats")).data,
    refetchInterval: 15_000,
  });
}

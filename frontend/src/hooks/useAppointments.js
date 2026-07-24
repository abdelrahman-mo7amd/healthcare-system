import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appointmentApi } from "../api/client";

export function useAppointments(params = {}) {
  return useQuery({
    queryKey: ["appointments", params],
    queryFn: async () => (await appointmentApi.get("/appointments", { params })).data,
  });
}

// Optimistic booking: the new appointment appears in the list
// instantly; if the booking request fails, it's removed again.
export function useBookAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => (await appointmentApi.post("/appointments", payload)).data,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["appointments"] });
      const previous = queryClient.getQueriesData({ queryKey: ["appointments"] });
      const optimisticAppt = { ...payload, _id: `optimistic-${Date.now()}`, status: "booked" };

      queryClient.setQueriesData({ queryKey: ["appointments"] }, (old) =>
        Array.isArray(old) ? [...old, optimisticAppt] : old
      );

      return { previous };
    },
    onError: (err, payload, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => (await appointmentApi.post(`/appointments/${id}/cancel`)).data,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["appointments"] });
      const previous = queryClient.getQueriesData({ queryKey: ["appointments"] });

      queryClient.setQueriesData({ queryKey: ["appointments"] }, (old) =>
        Array.isArray(old) ? old.map((a) => (a._id === id ? { ...a, status: "cancelled" } : a)) : old
      );

      return { previous };
    },
    onError: (err, id, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

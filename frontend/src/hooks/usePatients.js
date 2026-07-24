import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

export function usePatients(params = {}) {
  return useQuery({
    queryKey: ["patients", params],
    queryFn: async () => (await api.get("/patients", { params })).data,
  });
}

export function usePatient(id) {
  return useQuery({
    queryKey: ["patients", id],
    queryFn: async () => (await api.get(`/patients/${id}`)).data,
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => (await api.post("/patients", payload)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

// Optimistic update: the nurse sees the status change immediately,
// while the request syncs in the background. If it fails, we roll
// back to the previous cached list.
export function useUpdatePatientStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...changes }) => (await api.put(`/patients/${id}`, changes)).data,
    onMutate: async ({ id, ...changes }) => {
      await queryClient.cancelQueries({ queryKey: ["patients"] });
      const previous = queryClient.getQueriesData({ queryKey: ["patients"] });

      queryClient.setQueriesData({ queryKey: ["patients"] }, (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((p) => (p._id === id ? { ...p, ...changes } : p));
      });

      return { previous };
    },
    onError: (err, variables, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export function useAddVitals() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...vitals }) => (await api.post(`/patients/${id}/vitals`, vitals)).data,
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patients", id] });
    },
  });
}

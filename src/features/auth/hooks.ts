import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMe, loginUser, logoutUser, registerUser } from "./api";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false, 
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: async () => {
      qc.setQueryData(["me"], null);
      await qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

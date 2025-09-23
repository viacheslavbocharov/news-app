import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../api";


export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}


import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerUser } from "../api";

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}


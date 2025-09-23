import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../api";

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

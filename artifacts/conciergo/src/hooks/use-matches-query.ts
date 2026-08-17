import { useListMatches, getListMatchesQueryKey } from "@workspace/api-client-react";
import { keepPreviousData } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

export function useMatchesQuery() {
  const { isSignedIn, isPending } = useAuth();

  return useListMatches({
    query: {
      queryKey: getListMatchesQueryKey(),
      enabled: isSignedIn && !isPending,
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchInterval: isSignedIn ? 20_000 : false,
      placeholderData: keepPreviousData,
    },
  });
}

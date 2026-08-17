import { QueryClient } from "@tanstack/react-query";
import { getListEventsQueryKey, getListMatchesQueryKey } from "@workspace/api-client-react";

function errorStatus(error: unknown): number | undefined {
  if (error && typeof error === "object" && "status" in error) {
    const status = (error as { status?: unknown }).status;
    return typeof status === "number" ? status : undefined;
  }
  return undefined;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        const status = errorStatus(error);
        if (status === 401) return failureCount < 3;
        if (status !== undefined && status >= 400 && status < 500) return false;
        return failureCount < 2;
      },
      retryDelay: (attempt) => Math.min(400 * 2 ** attempt, 2000),
      staleTime: 15_000,
    },
  },
});

export function invalidateAfterAttendance() {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() }),
    queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey[0];
        return typeof key === "string" && (key.startsWith("/api/events") || key.startsWith("/api/matches"));
      },
    }),
    queryClient.invalidateQueries({ queryKey: getListMatchesQueryKey() }),
  ]);
}

import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../services/api";

/**
 * Fetches rooms from the backend via React Query.
 *
 * @param {Object} params - Query params forwarded to GET /api/rooms (e.g. { category, available })
 * @param {Object} options - React Query overrides
 *
 * Data is considered fresh for 10 minutes (staleTime).
 * Cache is kept for 30 minutes (gcTime) before being garbage-collected.
 * This means navigating away and back will instantly show cached data
 * without hitting the server again until the stale window expires.
 */
export function useRooms(params = {}, options = {}) {
  // Build a stable, sorted query key so { available: true } and
  // { available: true } always map to the same cache entry regardless of insertion order.
  const sortedParams = Object.fromEntries(
    Object.entries(params).sort(([a], [b]) => a.localeCompare(b)),
  );

  return useQuery({
    queryKey: ["rooms", sortedParams],
    queryFn: async () => {
      const res = await getRooms(params);
      const data = res.data?.data ?? res.data;
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes — won't refetch while fresh
    gcTime: 1000 * 60 * 30, // 30 minutes — cache kept in memory
    refetchOnWindowFocus: false, // don't refetch just because user switches tabs
    ...options,
  });
}

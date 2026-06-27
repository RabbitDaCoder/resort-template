import { useQuery } from "@tanstack/react-query";
import { getSocialLinks } from "../services/api";

/**
 * Fetches booking-related settings from the admin Social & Contact panel.
 * Cached for 5 minutes — stays fresh across page navigations.
 */
export function useBookingSettings() {
  return useQuery({
    queryKey: ["bookingSettings"],
    queryFn: async () => {
      const res = await getSocialLinks();
      const d = res.data.data || {};
      return {
        maxGuestsPerBooking: Number(d.maxGuestsPerBooking) || 50,
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

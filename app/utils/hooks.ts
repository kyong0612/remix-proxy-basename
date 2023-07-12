import { useMatches } from "@remix-run/react";
import { type SerializeFrom } from "@remix-run/node";
import type { loader as rootLoader } from "~/root";

export function useRootLoaderData() {
  const matches = useMatches();
  return matches[0].data as SerializeFrom<typeof rootLoader>;
}

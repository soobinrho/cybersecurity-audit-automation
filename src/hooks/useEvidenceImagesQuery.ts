import { useQuery } from "@tanstack/react-query";

export default function useEvidenceImagesQuery() {
  return useQuery({
    queryKey: ["evidence-images"],
    queryFn: () =>
      fetch(`/api/v1/evidence-images`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 1000 * 60 * 60 * 24,
  });
}

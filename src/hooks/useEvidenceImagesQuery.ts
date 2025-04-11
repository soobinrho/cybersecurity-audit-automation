import { useQuery } from "@tanstack/react-query";

export default function useEvidenceImagesMetadataQuery() {
  return useQuery({
    queryKey: ["evidence-images-metadata"],
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
    refetchInterval: 1000,
  });
}

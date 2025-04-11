import { useQuery } from "@tanstack/react-query";

export default function useEvidenceImageBlobQuery(evidence_image_id: number) {
  return useQuery({
    queryKey: ["evidence-image-blob", evidence_image_id],
    queryFn: () =>
      fetch(`/api/v1/evidence-images?evidence_image_id=${evidence_image_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.blob()),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });
}

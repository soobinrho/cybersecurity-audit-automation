import { Skeleton } from "@/components/ui/skeleton";

export default function MainContentSkeleton() {
  return (
    <div className="px-9 py-7 md:px-16 md:py-9 xl:px-20 xl:py-12 2xl:px-36 2xl:py-18">
      <Skeleton className="rounded-4xl h-full w-full" />
    </div>
  );
}

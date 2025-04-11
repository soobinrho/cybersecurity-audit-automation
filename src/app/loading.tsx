import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="md:grid-cols-[100%] xl:grid-cols-[10%_80%_10%] grid-rows-[4.5rem_minmax(0,1fr)] md:grid-rows-[4.5rem_minmax(0,1fr)_2rem] h-svh w-svw grid whitespace-pre-wrap">
      <header className="xl:col-start-1 xl:col-end-4 row-start-1 row-end-2 grid-cols-subgrid grid-rows-subgrid grid border-b-[0.08rem] border-dashed">
        <div className="xl:col-start-2 xl:col-end-3 row-start-1 row-end-2 xl:border-x-[0.08rem] border-dashed grid overflow-clip text-nowrap p-2">
          <Skeleton className="rounded-4xl h-full w-full bg-gray-200" />
        </div>
      </header>
      <main className="xl:col-start-1 xl:col-end-4 row-start-2 row-end-3 grid-cols-subgrid grid-rows-subgrid grid border-b-[0.08rem] border-dashed">
        <div className="md:grid-cols-[18%_82%] xl:grid-cols-[15%_85%] xl:col-start-2 xl:col-end-3 row-start-2 row-end-3 grid-rows-subgrid grid xl:border-x-[0.08rem] border-dashed text-pretty">
          <div className="md:block md:col-start-1 md:col-end-2 grid-rows-subgrid grid overflow-y-auto p-2">
            <Skeleton className="rounded-4xl h-full w-full bg-gray-100" />
          </div>
          <div className="md:col-start-2 md:col-end-3 xl:col-end-4 grid-rows-subgrid grid md:border-l-[0.08rem] border-dashed overflow-auto">
            <article className="px-9 py-7 md:px-16 md:py-9 xl:px-20 xl:py-12 2xl:px-36 2xl:py-18 text-wrap">
              <Skeleton className="rounded-4xl h-full w-full bg-gray-300" />
            </article>
          </div>
        </div>
      </main>
      <footer className="invisible hidden md:visible xl:col-start-1 xl:col-end-4 row-start-3 row-end-4 grid-cols-subgrid grid-rows-subgrid md:grid">
        <div className="grid-rows-1 xl:col-start-2 xl:col-end-3 row-start-3 row-end-4 xl:border-x-[0.08rem] border-dashed grid-cols-subgrid grid overflow-clip text-nowrap px-2 py-1">
          <Skeleton className="rounded-4xl h-full w-full bg-gray-100" />
        </div>
      </footer>
    </div>
  );
}

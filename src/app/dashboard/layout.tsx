import NavigationBar from "@/components/dashboard/NavigationBar";
import Footer from "@/components/dashboard/Footer";
import Sidebar from "@/components/dashboard/Sidebar";
import React, { Suspense } from "react";
import ReactQueryProvider from "@/components/dashboard/reactQueryProviders";
import MainContentSkeleton from "@/components/dashboard/MainContentSkeleton";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Main layout grids:
  // 1. xl: big margins at the left and right so that the center text is easier to read.
  // 2. md: the redability margins at the left and right are hidden.
  // 3. default: mobile first design: the header gets simplified and the footer is hidden.
  return (
    <div className="md:grid-cols-[100%] xl:grid-cols-[10%_80%_10%] grid-rows-[4.5rem_minmax(0,1fr)] md:grid-rows-[4.5rem_minmax(0,1fr)_2rem] h-svh w-svw grid whitespace-pre-wrap">
      <header className="xl:col-start-1 xl:col-end-4 row-start-1 row-end-2 grid-cols-subgrid grid-rows-subgrid grid border-b-[0.08rem] border-dashed">
        <div className="xl:col-start-2 xl:col-end-3 row-start-1 row-end-2 xl:border-x-[0.08rem] border-dashed grid overflow-clip text-nowrap">
          <NavigationBar />
        </div>
      </header>
      <main className="xl:col-start-1 xl:col-end-4 row-start-2 row-end-3 grid-cols-subgrid grid-rows-subgrid grid border-b-[0.08rem] border-dashed">
        <div className="md:grid-cols-[18%_82%] xl:grid-cols-[15%_85%] xl:col-start-2 xl:col-end-3 row-start-2 row-end-3 grid-rows-subgrid grid xl:border-x-[0.08rem] border-dashed text-pretty">
          <div className="md:block md:col-start-1 md:col-end-2 grid-rows-subgrid grid overflow-y-auto">
            <Sidebar />
          </div>
          <div className="md:col-start-2 md:col-end-3 xl:col-end-4 grid-rows-subgrid grid md:border-l-[0.08rem] border-dashed overflow-auto">
            <Suspense fallback={<MainContentSkeleton />}>
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </Suspense>
          </div>
        </div>
      </main>
      <footer className="invisible hidden md:visible xl:col-start-1 xl:col-end-4 row-start-3 row-end-4 grid-cols-subgrid grid-rows-subgrid md:grid">
        <div className="md:grid-cols-[18%_82%] xl:grid-cols-[15%_85%] grid-rows-1 xl:col-start-2 xl:col-end-3 row-start-3 row-end-4 xl:border-x-[0.08rem] border-dashed grid-cols-subgrid grid overflow-clip text-nowrap">
          <Footer />
        </div>
      </footer>
    </div>
  );
}

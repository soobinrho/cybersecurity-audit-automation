import NavigationBar from "@/components/dashboard/NavigationBar";
import Footer from "@/components/dashboard/Footer";
import Sidebar from "@/components/dashboard/Sidebar";
import React from "react";
import Providers from "@/app/providers";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="h-svh grid md:grid-rows-[4.5rem_1fr_2rem] grid-rows-[4.5rem_1fr]">
        <div className="xl:grid xl:grid-cols-[10%_80%_10%] border-b-[0.08rem] border-dashed md:sticky md:top-0 md:backdrop-blur-[1rem]">
          <div></div>
          <header>
            <NavigationBar />
          </header>
          <div></div>
        </div>
        <div className="xl:grid xl:grid-cols-[10%_80%_10%] border-b-[0.08rem] border-dashed">
          <div></div>
          <div className="grid grid-cols-1 md:grid-cols-[18%_82%] xl:grid-cols-[15%_70%_15%] xl:border-x-[0.08rem] border-dashed">
            <Sidebar />

            <ScrollArea className="h-[calc(100svh-4.5rem-0.1rem)] md:h-[calc(100svh-4.5rem-2rem-0.1rem)] p-0 m-0">
              <main>
                <Providers>
                  <article className="h-full px-9 pb-1 pt-7 md:px-16 md:py-9 xl:px-20 xl:py-12 2xl:px-36 2xl:py-18 md:border-l-[0.08rem] border-dashed text-wrap">
                    {children}
                  </article>
                </Providers>
              </main>
            </ScrollArea>
            <div></div>
          </div>
          <div></div>
        </div>
        <div className="xl:grid xl:grid-cols-[10%_80%_10%]">
          <div></div>
          <div className="grid grid-cols-1 md:grid-cols-[18%_82%] xl:grid-cols-[15%_70%_15%] xl:border-x-[0.08rem] border-dashed">
            <div></div>
            <footer>
              <Footer />
            </footer>
            <div></div>
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
}

import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="w-full h-full">
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
            <main className="min-h-svh px-9 py-7 md:px-16 md:py-9 xl:px-20 xl:py-12 2xl:px-36 2xl:py-18 md:border-l-[0.08rem] border-dashed">
              {children}
            </main>
            <div></div>
          </div>
          <div></div>
        </div>
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
    </>
  );
}

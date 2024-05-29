import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const sidebarWidth = 280;

export const Layout = () => {
  return (
    <main className="flex flex-nowrap w-svw h-svh">
      <section
        className={`border-r border-r-gray-200`}
        style={{ width: sidebarWidth }}
      >
        <Sidebar />
      </section>

      <section
        className="flex-1 w-full h-svh p-8 overflow-auto"
        style={{ width: `calc(100svw - ${sidebarWidth}px)` }}
      >
        {/* <Header /> */}

        <main
        // className=""
        // style={{ height: "calc(100svh - 80px)" }}
        >
          <Outlet />
        </main>
      </section>
    </main>
  );
};

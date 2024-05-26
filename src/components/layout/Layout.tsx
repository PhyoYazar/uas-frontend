import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export const Layout = () => {
  return (
    <main className="flex flex-nowrap w-full h-svh">
      <section className="w-72 border-r border-r-gray-200">
        <Sidebar />
      </section>

      <section className="flex-1">
        <Header />

        <main className="p-2" style={{ height: "calc(100svh - 80px)" }}>
          <Outlet />
        </main>
      </section>
    </main>
  );
};

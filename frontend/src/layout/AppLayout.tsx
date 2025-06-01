import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { useEffect, useState } from "react";


/**
 * 
 * Layout che wrappa tutta l'applicazione
 */

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const [pageTitle, setPageTitle] = useState<string>("");

  const getSection = () => {
    const url = window.location.href.split("/");
    return url[url.length - 1];
  };

  useEffect(() => {
    let res = getSection();
    setPageTitle(res);
  }, [window.location.href]);

  return (
    <div className="min-h-screen xl:flex dark:bg-black">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <PageBreadcrumb pageTitle={pageTitle.length ? pageTitle : "Home"} />
          <Outlet />
        </div>
        <p className="text-center bottom-3 h-10 w-full justify-center items-center text-gray-500 dark:text-white">
          Made by <b className="text-blue-400">Leonardo Malvolti</b>
        </p>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;

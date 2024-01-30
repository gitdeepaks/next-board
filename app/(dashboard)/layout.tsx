import React from "react";
import { SideBar } from "./_components/sidebar";
import { OrgSideBar } from "./_components/OrgSideBar";
import { NavBar } from "./_components/NavBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashBoardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="h-full">
      <SideBar />
      <div className="pl-[60px] h-full">
        <div className="flex gap-x-3 h-full">
          <OrgSideBar />
          <div className="h-full flex-1">
            <NavBar />
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashBoardLayout;

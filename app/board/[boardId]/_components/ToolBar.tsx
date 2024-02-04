import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export const ToolBar = () => {
  return (
    <div className="absolute top-[25rem] -translate-y-[50%] left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        <div>Pencil</div>
        <div>Square</div>
        <div>Circle</div>
        <div>Ellipsis</div>
      </div>
      <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
        <div className="">Undo</div>
        <div className="">Redo</div>
      </div>
    </div>
  );
};
export function ToolBarSkeleton() {
  return (
    <div className="absolute top-[25rem] -translate-y-[50%] left-2 flex flex-col gap-y-4 bg-white h-[360px] w-[52px] shadow-md rounded-md">
      <Skeleton className="h-full w-full bg-muted" />
    </div>
  );
}

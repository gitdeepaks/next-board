"use client";

import { info } from "console";
import { Info } from "./Info";
import { Participants } from "./Participants";
import { ToolBar } from "./ToolBar";
import { useSelf } from "@/liveblocks.config";

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
  return (
    <main className="h-ful w-full relative bg-neutral-100 touch-none">
      <Info boardId={boardId} />
      <Participants />
      <ToolBar />
    </main>
  );
};

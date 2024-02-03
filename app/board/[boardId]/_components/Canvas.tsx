"use client";

import { Info } from "./Info";
import { Participants } from "./Participants";
import { ToolBar } from "./ToolBar";

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
  return (
    <main className="h-ful w-full relative bg-neutral-100 touch-none">
      <Info />
      <Participants />
      <ToolBar />
    </main>
  );
};

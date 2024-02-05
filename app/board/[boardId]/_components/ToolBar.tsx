import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { ToolButton } from "./ToolButton";
import {
  Circle,
  MousePointer2,
  Pen,
  Redo2,
  Square,
  Sticker,
  StickyNote,
  Type,
  Undo2,
} from "lucide-react";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";
import { set } from "date-fns";

interface ToolBarProps {
  convasState: CanvasState;
  setConvasState: (newState: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const ToolBar = ({
  convasState,
  setConvasState,
  undo,
  redo,
  canUndo,
  canRedo,
}: ToolBarProps) => {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        <ToolButton
          label="Select"
          icon={MousePointer2}
          onClick={() => setConvasState({ mode: CanvasMode.None })}
          isActive={
            convasState.mode === CanvasMode.None ||
            convasState.mode === CanvasMode.Translating ||
            convasState.mode === CanvasMode.Resizing ||
            convasState.mode === CanvasMode.Pressing ||
            convasState.mode === CanvasMode.SelectionNet
          }
        />
        <ToolButton
          label="Text"
          icon={Type}
          onClick={() =>
            setConvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Text,
            })
          }
          isActive={
            convasState.mode === CanvasMode.Inserting &&
            convasState.layerType === LayerType.Text
          }
        />
        <ToolButton
          label="Stickies"
          icon={StickyNote}
          onClick={() =>
            setConvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Note,
            })
          }
          isActive={
            convasState.mode === CanvasMode.Inserting &&
            convasState.layerType === LayerType.Note
          }
        />
        <ToolButton
          label="Rectangles"
          icon={Square}
          onClick={() =>
            setConvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Rectangle,
            })
          }
          isActive={
            convasState.mode === CanvasMode.Inserting &&
            convasState.layerType === LayerType.Rectangle
          }
        />
        <ToolButton
          label="Ellipses"
          icon={Circle}
          onClick={() =>
            setConvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Ellipse,
            })
          }
          isActive={
            convasState.mode === CanvasMode.Inserting &&
            convasState.layerType === LayerType.Ellipse
          }
        />
        <ToolButton
          label="Pen"
          icon={Pen}
          onClick={() =>
            setConvasState({
              mode: CanvasMode.Pencil,
            })
          }
          isActive={convasState.mode === CanvasMode.Pencil}
        />
      </div>
      <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
        <ToolButton
          label="Undo"
          icon={Undo2}
          onClick={undo}
          isDisabled={!canUndo}
        />

        <ToolButton
          label="Redo"
          icon={Redo2}
          onClick={redo}
          isDisabled={!canRedo}
        />
      </div>
    </div>
  );
};
export const ToolbarSkeleton = () => {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 bg-white h-[360px] w-[52px] shadow-md rounded-md" />
  );
};

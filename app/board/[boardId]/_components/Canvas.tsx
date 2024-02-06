"use client";
import React, { useMemo } from "react";
import { useCallback, useState } from "react";
import { Info } from "./Info";
import { Participants } from "./Participants";
import { ToolBar } from "./ToolBar";
import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useOthersMapped,
  useStorage,
} from "@/liveblocks.config";
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
} from "@/types/canvas";
import { CursorsPresence } from "./CursorsPresence";
import { connectionIdToColor, pointerEventToCanvasPoint } from "@/lib/utils";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import { set } from "date-fns";
import { LayerPreview } from "./LayerPreview";
import { SelectionBox } from "./SelectionBox";

const MAX_LAYERS = 100;

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
  const layerIds = useStorage((root) => root.layerIds);

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Text
        | LayerType.Note,
      position: Point
    ) => {
      const liveLayers = storage.get("layers");
      if (liveLayers.size >= MAX_LAYERS) {
        return;
      }

      const liveLayersIds = storage.get("layerIds");
      const layersId = nanoid();
      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        fill: lastUsedColor,
      });
      liveLayersIds.push(layersId);
      liveLayers.set(layersId, layer);

      setMyPresence({ selection: [layersId] }, { addToHistory: true });
      setCanvasState({ mode: CanvasMode.None });
    },
    [lastUsedColor]
  );

  const onWheel = useCallback((e: React.WheelEvent) => {
    setCamera((cam) => ({
      x: cam.x - e.deltaX,
      y: cam.y - e.deltaY,
    }));
  }, []);

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();

      const current = pointerEventToCanvasPoint(e, camera);

      setMyPresence({ cursor: current });
    },
    []
  );

  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  const onPointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e, camera);
      console.log({
        point,
        mode: canvasState.mode,
      });
      if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setCanvasState({
          mode: CanvasMode.None,
        });
      }
      history.resume();
    },
    [camera, canvasState, history, insertLayer]
  );

  const selections = useOthersMapped((present) => present.presence.selection);

  const onLayerPointDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      ) {
        return;
      }

      history.pause();
      e.stopPropagation();

      const point = pointerEventToCanvasPoint(e, camera);

      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }
      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [setCanvasState, camera, history, canvasState.mode]
  );

  const layerIdsToColoeSelection = useMemo(() => {
    const layerIdstoColorSelection: Record<string, string> = {};

    for (const user of selections) {
      const [coonectionId, selection] = user;

      for (const layerId of selection) {
        layerIdstoColorSelection[layerId] = connectionIdToColor(coonectionId);
      }
    }

    return layerIdstoColorSelection;
  }, [selections]);

  return (
    <main className="h-ful w-full relative bg-neutral-100 touch-none">
      <Info boardId={boardId} />
      <Participants />
      <ToolBar
        convasState={canvasState}
        setConvasState={setCanvasState}
        canRedo={canRedo}
        canUndo={canUndo}
        redo={history.redo}
        undo={history.undo}
      />

      <svg
        className="h-[100dvh] w-[100dvw]"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
      >
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px)`,
          }}
        >
          {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointDown={onLayerPointDown}
              selectionColor={layerIdsToColoeSelection[layerId]}
            />
          ))}
          <SelectionBox onResizeHandlePointerDown={() => {}} />
          <CursorsPresence />
        </g>
      </svg>
    </main>
  );
};

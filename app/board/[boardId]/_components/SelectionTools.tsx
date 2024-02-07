"use client";

import { useSelectionBounds } from "@/hooks/use-selection-bound";
import { useMutation, useSelf } from "@/liveblocks.config";
import { Camera, Color } from "@/types/canvas";
import { memo } from "react";
import { ColorPicker } from "./ColorPicker";
import { useDeleteLayers } from "@/hooks/use-delete-layers";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/Hint";
import { Trash2 } from "lucide-react";

interface SelectionToolsProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
}

export const SelectionTools = memo(
  ({ camera, setLastUsedColor }: SelectionToolsProps) => {
    const selection = useSelf((self) => self.presence.selection);

    const setFill = useMutation(
      ({ storage }, fill: Color) => {
        const liveLayerStorage = storage.get("layers");
        setLastUsedColor(fill);

        selection.forEach((id) => {
          liveLayerStorage.get(id)?.set("fill", fill);
        });
      },
      [selection, setLastUsedColor]
    );

    const deleteLayers = useDeleteLayers();

    const slectionBounds = useSelectionBounds();

    if (!slectionBounds) {
      return null;
    }

    const x = slectionBounds.width / 2 + slectionBounds.x + camera.x;
    const y = slectionBounds.y + camera.y;

    return (
      <div
        className="absolute p-3 rounded-xl bg-white shadow-sm border-sm border flex select-none"
        style={{
          transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%))`,
        }}
      >
        <ColorPicker onChange={setFill} />

        <div className="flex items-center pl-2 ml-2 border-l border-neutral-200">
          <Hint label="Delete">
            <Button variant="board" size="icon">
              <Trash2 size={16} onClick={deleteLayers} />
            </Button>
          </Hint>
        </div>
      </div>
    );
  }
);

SelectionTools.displayName = "SelectionTools";
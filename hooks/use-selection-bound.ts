import { shallow } from "@liveblocks/react";

import { Layer, XYWH } from "@/types/canvas";
import { useStorage, useSelf } from "@/liveblocks.config";

const boundingBox = (layers: Layer[]): XYWH | null => {
  const firstLayer = layers[0];
  if (!firstLayer) return null;

  let left = firstLayer.x;
  let top = firstLayer.y;
  let right = firstLayer.x + firstLayer.width;
  let bottom = firstLayer.y + firstLayer.height;

  for (let i = 1; i < layers.length; i++) {
    const { x, y, width, height } = layers[i];

    if (left > x) left = x;
    if (top > y) top = y;
    if (right < x + width) right = x + width;
    if (bottom < y + height) bottom = y + height;
  }
  return { x: left, y: top, width: right - left, height: bottom - top };
};

export const useSelectionBounds = () => {
  const selection = useSelf((self) => self.presence.selection);

  return useStorage((storage) => {
    const selectedLayers = selection
      .map((id) => storage.layers.get(id)!)
      .filter(Boolean);
    return boundingBox(selectedLayers);
  }, shallow);
};

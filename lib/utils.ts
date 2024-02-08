import { Camera, Color, Layer, Point, Side, XYWH } from "@/types/canvas";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const COLORS = [
  "#87CEEB",
  "#DC143C",
  "#50C878",
  "#FF7F50",
  "#9966CC",
  "#FFF44F",
  "#008080",
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function connectionIdToColor(connectionId: number) {
  return COLORS[connectionId % COLORS.length];
}

export function pointerEventToCanvasPoint(
  e: React.PointerEvent,
  camera: Camera
) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };
}

export function colorToCss(color: Color) {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g
    .toString(16)
    .padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
}

export function resizeBound(bounds: XYWH, corner: Side, point: Point): XYWH {
  const res = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  };

  if ((corner & Side.Left) === Side.Left) {
    res.x = Math.min(point.x, bounds.x + bounds.width);
    res.width = Math.abs(bounds.x + bounds.width - point.x);
  }

  if ((corner & Side.Right) === Side.Right) {
    res.x = Math.min(point.x, bounds.x);
    res.width = Math.abs(point.x - bounds.x);
  }

  if ((corner & Side.Top) === Side.Top) {
    res.y = Math.min(point.y, bounds.y + bounds.height);
    res.height = Math.abs(bounds.y + bounds.height - point.y);
  }

  if ((corner & Side.Bottom) === Side.Bottom) {
    res.y = Math.min(point.y, bounds.y);
    res.height = Math.abs(point.y - bounds.y);
  }

  return res;
}

export function findIntersectingLayersWithRect(
  latersIds: readonly string[],
  layers: ReadonlyMap<string, Layer>,
  a: Point,
  b: Point
) {
  const rectangle = {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  };

  const ids = [];

  for (const laterId of latersIds) {
    const layer = layers.get(laterId);

    if (layer == null) {
      continue;
    }

    const { x, y, height, width } = layer;

    if (
      rectangle.x + rectangle.width > x &&
      rectangle.x < x + width &&
      rectangle.y + rectangle.height > y &&
      rectangle.y < y + height
    ) {
      ids.push(laterId);
    }
  }

  return ids;
}

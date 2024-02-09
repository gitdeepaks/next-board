import { Kalam } from "next/font/google";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { cn, colorToCss, getContranstingTextColor } from "@/lib/utils";

import { LayerType, TextLayer } from "@/types/canvas"; // Assuming TextLayer is already defined

import { useMutation } from "@/liveblocks.config";

const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
});

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = 0.15;
  const fontSizeBasedOnHeight = height * scaleFactor;
  const fontSizeBasedOnWidth = width * scaleFactor;

  return Math.min(maxFontSize, fontSizeBasedOnHeight, fontSizeBasedOnWidth);
};

// Extending the example to include a NoteLayer type

// Assuming NoteLayer has similar properties to TextLayer
interface NoteLayer {
  type: LayerType.Note;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: {
    r: number;
    g: number;
    b: number;
  };
  value?: string;
}

interface NoteProps {
  id: string;
  layer: TextLayer | NoteLayer; // Updated to accept both TextLayer and NoteLayer
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Note = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: NoteProps) => {
  const { x, y, width, height, value } = layer;

  const updateValue = useMutation(({ storage }, newValue: string) => {
    const liveLayer = storage.get("layers");
    liveLayer.get(id)?.set("value", newValue);
  }, []);

  const handleContentChange = (e: ContentEditableEvent) => {
    updateValue(e.target.value);
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
        backgroundColor: layer.fill ? colorToCss(layer.fill) : "#000",
      }}
      className="shadow-md drop-shadow-xl"
    >
      <ContentEditable
        className={cn(
          "h-full w-full flex items-center justify-center text-center outline-none",
          font.className
        )}
        style={{
          fontSize: calculateFontSize(width, height),
          color: layer.fill ? getContranstingTextColor(layer.fill) : "#000",
        }}
        html={value || "Text"}
        onChange={handleContentChange}
      />
    </foreignObject>
  );
};

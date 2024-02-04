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

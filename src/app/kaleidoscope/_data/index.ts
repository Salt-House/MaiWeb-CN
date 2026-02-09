import blueDoor from "./blue"
import whiteDoor from "./white"
import type { KaleidoscopeDoorData } from "./types"

// All doors ordered by phase (newest first for display)
export const allDoors: KaleidoscopeDoorData[] = [whiteDoor, blueDoor]

// Map for quick lookup by slug
export const doorMap: Record<string, KaleidoscopeDoorData> = {
  blue: blueDoor,
  white: whiteDoor,
}

export type { KaleidoscopeDoorData } from "./types"

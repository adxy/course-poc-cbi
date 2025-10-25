import { MoveEvent, HighlightEvent, ArrowEvent, PositionEvent, ChessEvent } from "@/types/events";

/**
 * Binary search to find the latest move event at or before the given time
 * Returns the index of the move, or -1 if no move has occurred yet
 */
export function findLatestMoveIndex(
  moves: MoveEvent[],
  currentTime: number
): number {
  if (moves.length === 0 || currentTime < moves[0].timestamp) {
    return -1;
  }

  let left = 0;
  let right = moves.length - 1;
  let result = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (moves[mid].timestamp <= currentTime) {
      result = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}

/**
 * Find the latest position event at or before the given time
 * Returns the position event, or null if no position event has occurred yet
 */
export function findLatestPosition(
  positions: PositionEvent[],
  currentTime: number
): PositionEvent | null {
  if (positions.length === 0 || currentTime < positions[0].timestamp) {
    return null;
  }

  let left = 0;
  let right = positions.length - 1;
  let result: PositionEvent | null = null;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (positions[mid].timestamp <= currentTime) {
      result = positions[mid];
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}

/**
 * Filter active annotations (highlights and arrows) for the current time
 */
export function getActiveAnnotations<T extends HighlightEvent | ArrowEvent>(
  annotations: T[],
  currentTime: number
): T[] {
  return annotations.filter(
    (annotation) => annotation.start <= currentTime && currentTime < annotation.end
  );
}

/**
 * Separate events into moves, positions, and annotations
 */
export function categorizeEvents(events: ChessEvent[]) {
  const moves: MoveEvent[] = [];
  const positions: PositionEvent[] = [];
  const highlights: HighlightEvent[] = [];
  const arrows: ArrowEvent[] = [];

  for (const event of events) {
    switch (event.type) {
      case "move":
        moves.push(event);
        break;
      case "position":
        positions.push(event);
        break;
      case "highlight":
        highlights.push(event);
        break;
      case "arrow":
        arrows.push(event);
        break;
    }
  }

  // Sort moves by timestamp
  moves.sort((a, b) => a.timestamp - b.timestamp);
  
  // Sort positions by timestamp
  positions.sort((a, b) => a.timestamp - b.timestamp);
  
  // Sort annotations by start time
  highlights.sort((a, b) => a.start - b.start);
  arrows.sort((a, b) => a.start - b.start);

  return { moves, positions, highlights, arrows };
}

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

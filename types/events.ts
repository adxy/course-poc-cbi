export interface MoveEvent {
  id: string;
  type: "move";
  timestamp: number;
  from: string;
  to: string;
  san: string;
  fen: string;
}

export interface HighlightEvent {
  id: string;
  type: "highlight";
  start: number;
  end: number;
  square: string;
  color?: string;
}

export interface ArrowEvent {
  id: string;
  type: "arrow";
  start: number;
  end: number;
  from: string;
  to: string;
  color?: string;
}

export interface PositionEvent {
  id: string;
  type: "position";
  timestamp: number;
  fen: string;
}

export type ChessEvent = MoveEvent | HighlightEvent | ArrowEvent | PositionEvent;

export interface VideoBoardSyncProps {
  videoUrl: string;
  events: ChessEvent[];
  initialFen?: string;
}

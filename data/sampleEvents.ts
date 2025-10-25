import { ChessEvent } from "@/types/events";

/**
 * Sample chess events for demonstration
 * This represents a simple chess opening sequence with annotations
 */
export const sampleEvents: ChessEvent[] = [
  // Opening moves - Italian Game
  {
    id: "m0001",
    type: "move",
    timestamp: 1.68,
    from: "e2",
    to: "e4",
    san: "e4",
    fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
  },
  {
    id: "m0002",
    type: "move",
    timestamp: 3.45,
    from: "e7",
    to: "e5",
    san: "e5",
    fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
  },
  {
    id: "m0003",
    type: "move",
    timestamp: 5.22,
    from: "g1",
    to: "f3",
    san: "Nf3",
    fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
  },
  {
    id: "h0001",
    type: "highlight",
    start: 7.02,
    end: 9.5,
    square: "d4",
    color: "yellow",
  },
  {
    id: "m0004",
    type: "move",
    timestamp: 7.8,
    from: "b8",
    to: "c6",
    san: "Nc6",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
  },
  {
    id: "a0001",
    type: "arrow",
    start: 9.87,
    end: 14.23,
    from: "f3",
    to: "e5",
    color: "rgb(255, 0, 0)",
  },
  {
    id: "m0005",
    type: "move",
    timestamp: 10.5,
    from: "f1",
    to: "c4",
    san: "Bc4",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
  },
  {
    id: "h0002",
    type: "highlight",
    start: 12.3,
    end: 15.7,
    square: "f7",
    color: "red",
  },
  {
    id: "m0006",
    type: "move",
    timestamp: 13.2,
    from: "g8",
    to: "f6",
    san: "Nf6",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
  },
  {
    id: "a0002",
    type: "arrow",
    start: 15.1,
    end: 18.5,
    from: "c4",
    to: "f7",
    color: "rgb(255, 170, 0)",
  },
  {
    id: "m0007",
    type: "move",
    timestamp: 16.8,
    from: "d2",
    to: "d3",
    san: "d3",
    fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 4",
  },
  {
    id: "h0003",
    type: "highlight",
    start: 18.9,
    end: 21.5,
    square: "d4",
    color: "yellow",
  },
  {
    id: "m0008",
    type: "move",
    timestamp: 19.6,
    from: "f8",
    to: "c5",
    san: "Bc5",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 1 5",
  },
  {
    id: "a0003",
    type: "arrow",
    start: 20.8,
    end: 24.2,
    from: "e1",
    to: "g1",
    color: "rgb(0, 255, 0)",
  },
  {
    id: "m0009",
    type: "move",
    timestamp: 22.3,
    from: "e1",
    to: "g1",
    san: "O-O",
    fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 2 5",
  },
  {
    id: "h0004",
    type: "highlight",
    start: 23.5,
    end: 26.8,
    square: "e5",
    color: "yellow",
  },
  {
    id: "h0005",
    type: "highlight",
    start: 23.5,
    end: 26.8,
    square: "e4",
    color: "yellow",
  },
  {
    id: "m0010",
    type: "move",
    timestamp: 25.1,
    from: "d7",
    to: "d6",
    san: "d6",
    fen: "r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w kq - 0 6",
  },
  {
    id: "a0004",
    type: "arrow",
    start: 26.5,
    end: 29.9,
    from: "c1",
    to: "g5",
    color: "rgb(255, 0, 0)",
  },
  {
    id: "m0011",
    type: "move",
    timestamp: 28.0,
    from: "c1",
    to: "g5",
    san: "Bg5",
    fen: "r1bqk2r/ppp2ppp/2np1n2/2b1p1B1/2B1P3/3P1N2/PPP2PPP/RN1Q1RK1 b kq - 1 6",
  },
  {
    id: "h0006",
    type: "highlight",
    start: 29.2,
    end: 32.5,
    square: "f6",
    color: "red",
  },
  {
    id: "m0012",
    type: "move",
    timestamp: 30.8,
    from: "h7",
    to: "h6",
    san: "h6",
    fen: "r1bqk2r/ppp2pp1/2np1n1p/2b1p1B1/2B1P3/3P1N2/PPP2PPP/RN1Q1RK1 w kq - 0 7",
  },
];

/**
 * Alternative sample with a different YouTube video
 * You can use this format to create your own event sequences
 */
export const createCustomEvents = (
  moves: Array<{ timestamp: number; from: string; to: string; san: string; fen: string }>,
  annotations: Array<
    | { type: "highlight"; start: number; end: number; square: string; color?: string }
    | { type: "arrow"; start: number; end: number; from: string; to: string; color?: string }
  >
): ChessEvent[] => {
  const events: ChessEvent[] = [];
  
  moves.forEach((move, index) => {
    events.push({
      id: `m${String(index + 1).padStart(4, "0")}`,
      type: "move",
      ...move,
    });
  });
  
  annotations.forEach((annotation, index) => {
    if (annotation.type === "highlight") {
      events.push({
        id: `h${String(index + 1).padStart(4, "0")}`,
        ...annotation,
      });
    } else {
      events.push({
        id: `a${String(index + 1).padStart(4, "0")}`,
        ...annotation,
      });
    }
  });
  
  return events;
};

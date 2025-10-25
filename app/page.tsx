"use client";

import { useState } from "react";
import VideoBoardSync from "@/components/VideoBoardSync";
import { ChessEvent } from "@/types/events";

export default function Home() {
  const [videoUrl] = useState("https://www.youtube.com/watch?v=Zfh4ZbSNniE");
  
  const defaultEvents: ChessEvent[] = [
    {
      "id": "p0000",
      "type": "position", 
      "timestamp": 0,
      "fen": "8/8/8/8/8/k7/6R1/K6R w - - 0 1"
    },
    {
      "id": "h0001",
      "type": "highlight",
      "start": 21.24,
      "square": "g2",
      "end": 26.72
    },
    {
      "id": "h0002",
      "type": "highlight",
      "start": 21.58,
      "square": "h1",
      "end": 26.72
    },
    {
      "id": "h0003",
      "type": "highlight",
      "start": 24.14,
      "square": "a3",
      "end": 26.72
    },
    {
      "id": "a0001",
      "type": "arrow",
      "start": 34.26,
      "from": "a3",
      "to": "b3",
      "end": 39.94
    },
    {
      "id": "a0002",
      "type": "arrow",
      "start": 35.46,
      "from": "a3",
      "to": "b4",
      "end": 39.94
    },
    {
      "id": "a0003",
      "type": "arrow",
      "start": 36.12,
      "from": "a3",
      "to": "a4",
      "end": 39.94
    },
    {
      "id": "m0001",
      "type": "move",
      "timestamp": 42.29,
      "from": "h1",
      "to": "h3",
      "san": "Rh3+",
      "fen": "8/8/8/8/8/k6R/6R1/K7 b - - 1 1"
    },
    {
      "id": "a0004",
      "type": "arrow",
      "start": 44.03,
      "from": "a3",
      "to": "b3",
      "end": 52.93
    },
    {
      "id": "a0005",
      "type": "arrow",
      "start": 47.07,
      "from": "a3",
      "to": "a2",
      "end": 52.93
    },
    {
      "id": "a0006",
      "type": "arrow",
      "start": 47.61,
      "from": "a3",
      "to": "b2",
      "end": 52.93
    },
    {
      "id": "a0007",
      "type": "arrow",
      "start": 49.84,
      "from": "a3",
      "to": "a4",
      "end": 52.93
    },
    {
      "id": "h0004",
      "type": "highlight",
      "start": 50.38,
      "square": "a4",
      "end": 52.93
    },
    {
      "id": "m0002",
      "type": "move",
      "timestamp": 53.55,
      "from": "a3",
      "to": "a4",
      "san": "Ka4",
      "fen": "8/8/8/8/k7/7R/6R1/K7 w - - 2 2"
    },
    {
      "id": "a0008",
      "type": "arrow",
      "start": 57.01,
      "from": "a4",
      "to": "b3",
      "end": 58.32
    },
    {
      "id": "a0009",
      "type": "arrow",
      "start": 57.46,
      "from": "a4",
      "to": "a3",
      "end": 58.32
    },
    {
      "id": "a0010",
      "type": "arrow",
      "start": 60.38,
      "from": "a4",
      "to": "b4",
      "end": 64.7
    },
    {
      "id": "a0011",
      "type": "arrow",
      "start": 61.01,
      "from": "a4",
      "to": "a5",
      "end": 64.7
    },
    {
      "id": "a0012",
      "type": "arrow",
      "start": 62.08,
      "from": "a4",
      "to": "b5",
      "end": 64.7
    },
    {
      "id": "m0003",
      "type": "move",
      "timestamp": 66.11,
      "from": "g2",
      "to": "g4",
      "san": "Rg4+",
      "fen": "8/8/8/8/k5R1/7R/8/K7 b - - 3 2"
    },
    {
      "id": "m0004",
      "type": "move",
      "timestamp": 68.42,
      "from": "a4",
      "to": "b5",
      "san": "Kb5",
      "fen": "8/8/8/1k6/6R1/7R/8/K7 w - - 4 3"
    },
    {
      "id": "m0005",
      "type": "move",
      "timestamp": 71.67,
      "from": "h3",
      "to": "h5",
      "san": "Rh5+",
      "fen": "8/8/8/1k5R/6R1/8/8/K7 b - - 5 3"
    },
    {
      "id": "m0006",
      "type": "move",
      "timestamp": 72.96,
      "from": "b5",
      "to": "c6",
      "san": "Kc6",
      "fen": "8/8/2k5/7R/6R1/8/8/K7 w - - 6 4"
    },
    {
      "id": "m0007",
      "type": "move",
      "timestamp": 74.72,
      "from": "g4",
      "to": "g6",
      "san": "Rg6+",
      "fen": "8/8/2k3R1/7R/8/8/8/K7 b - - 7 4"
    },
    {
      "id": "m0008",
      "type": "move",
      "timestamp": 75.99,
      "from": "c6",
      "to": "d7",
      "san": "Kd7",
      "fen": "8/3k4/6R1/7R/8/8/8/K7 w - - 8 5"
    },
    {
      "id": "m0009",
      "type": "move",
      "timestamp": 77.44,
      "from": "h5",
      "to": "h7",
      "san": "Rh7+",
      "fen": "8/3k3R/6R1/8/8/8/8/K7 b - - 9 5"
    },
    {
      "id": "m0010",
      "type": "move",
      "timestamp": 80.41,
      "from": "d7",
      "to": "e8",
      "san": "Ke8",
      "fen": "4k3/7R/6R1/8/8/8/8/K7 w - - 10 6"
    },
    {
      "id": "m0011",
      "type": "move",
      "timestamp": 81.34,
      "from": "g6",
      "to": "g8",
      "san": "Rg8#",
      "fen": "4k1R1/7R/8/8/8/8/8/K7 b - - 11 6"
    }
  ];

  return (
    <main>
      <VideoBoardSync videoUrl={videoUrl} events={defaultEvents} />
    </main>
  );
}

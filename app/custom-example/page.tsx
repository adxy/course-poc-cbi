"use client";

import { useState } from "react";
import { Paper, Title, Text } from '@mantine/core';
import VideoBoardSync from "@/components/VideoBoardSync";
import { ChessEvent } from "@/types/events";

/**
 * Custom example page showing how to create and use custom events
 */
export default function CustomExamplePage() {
  // Example: Scholar's Mate tutorial
  const [videoUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  
  const customEvents: ChessEvent[] = [
    // Move 1: e4
    {
      id: "move1",
      type: "move",
      timestamp: 2.0,
      from: "e2",
      to: "e4",
      san: "e4",
      fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    },
    // Highlight the center control
    {
      id: "highlight1",
      type: "highlight",
      start: 2.5,
      end: 5.0,
      square: "e4",
    },
    {
      id: "highlight2",
      type: "highlight",
      start: 2.5,
      end: 5.0,
      square: "d4",
    },
    // Move 2: e5
    {
      id: "move2",
      type: "move",
      timestamp: 5.5,
      from: "e7",
      to: "e5",
      san: "e5",
      fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
    },
    // Move 3: Bc4
    {
      id: "move3",
      type: "move",
      timestamp: 8.0,
      from: "f1",
      to: "c4",
      san: "Bc4",
      fen: "rnbqkbnr/pppp1ppp/8/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR b KQkq - 1 2",
    },
    // Show arrow pointing to f7 (weak square)
    {
      id: "arrow1",
      type: "arrow",
      start: 8.5,
      end: 11.0,
      from: "c4",
      to: "f7",
      color: "rgb(255, 0, 0)",
    },
    // Highlight f7
    {
      id: "highlight3",
      type: "highlight",
      start: 8.5,
      end: 11.0,
      square: "f7",
    },
    // Move 4: Nc6
    {
      id: "move4",
      type: "move",
      timestamp: 11.5,
      from: "b8",
      to: "c6",
      san: "Nc6",
      fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 2 3",
    },
    // Move 5: Qh5
    {
      id: "move5",
      type: "move",
      timestamp: 14.0,
      from: "d1",
      to: "h5",
      san: "Qh5",
      fen: "r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3",
    },
    // Show arrows for the attack on f7
    {
      id: "arrow2",
      type: "arrow",
      start: 14.5,
      end: 18.0,
      from: "h5",
      to: "f7",
      color: "rgb(255, 0, 0)",
    },
    {
      id: "arrow3",
      type: "arrow",
      start: 14.5,
      end: 18.0,
      from: "c4",
      to: "f7",
      color: "rgb(255, 170, 0)",
    },
    // Highlight f7 again
    {
      id: "highlight4",
      type: "highlight",
      start: 14.5,
      end: 18.0,
      square: "f7",
    },
    // Move 6: Nf6? (mistake)
    {
      id: "move6",
      type: "move",
      timestamp: 18.5,
      from: "g8",
      to: "f6",
      san: "Nf6",
      fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
    },
    // Move 7: Qxf7# (checkmate!)
    {
      id: "move7",
      type: "move",
      timestamp: 21.0,
      from: "h5",
      to: "f7",
      san: "Qxf7#",
      fen: "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4",
    },
    // Highlight checkmate square
    {
      id: "highlight5",
      type: "highlight",
      start: 21.5,
      end: 25.0,
      square: "f7",
    },
    {
      id: "highlight6",
      type: "highlight",
      start: 21.5,
      end: 25.0,
      square: "e8",
    },
  ];

  return (
    <div>
      <Paper bg="blue" c="white" p="md" ta="center">
        <Title order={2} size="h2">Custom Example: Scholar&apos;s Mate</Title>
        <Text size="sm" mt="xs">
          This demonstrates how to create your own chess events with annotations
        </Text>
      </Paper>
      <VideoBoardSync videoUrl={videoUrl} events={customEvents} />
    </div>
  );
}

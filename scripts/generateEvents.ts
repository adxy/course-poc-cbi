#!/usr/bin/env ts-node

/**
 * Event Generator Script
 * 
 * This script helps you generate chess events from a simple move list.
 * Usage: npx ts-node scripts/generateEvents.ts
 */

import { Chess } from 'chess.js';
import * as fs from 'fs';
import * as path from 'path';
import { ChessEvent } from '@/types/events';

interface MoveInput {
  timestamp: number;
  move: string; // SAN notation (e.g., "e4", "Nf3", "O-O")
}

interface AnnotationInput {
  type: 'highlight' | 'arrow';
  start: number;
  end: number;
  square?: string;
  from?: string;
  to?: string;
  color?: string;
}

function generateEvents(
  moves: MoveInput[],
  annotations: AnnotationInput[] = []
) {
  const chess = new Chess();
  const events: ChessEvent[] = [];

  // Generate move events
  for (let i = 0; i < moves.length; i++) {
    const moveInput = moves[i];
    
    try {
      const moveResult = chess.move(moveInput.move);
      
      if (moveResult) {
        events.push({
          id: `m${String(i + 1).padStart(4, '0')}`,
          type: 'move',
          timestamp: moveInput.timestamp,
          from: moveResult.from,
          to: moveResult.to,
          san: moveResult.san,
          fen: chess.fen(),
        });
      } else {
        console.error(`❌ Invalid move at index ${i}: ${moveInput.move}`);
        console.error(`   Current position: ${chess.fen()}`);
        process.exit(1);
      }
    } catch (error) {
      console.error(`❌ Error processing move at index ${i}: ${moveInput.move}`);
      console.error(`   Error: ${error}`);
      process.exit(1);
    }
  }

  // Add annotations
  annotations.forEach((annotation, index) => {
    if (annotation.type === 'highlight') {
      events.push({
        id: `h${String(index + 1).padStart(4, '0')}`,
        type: 'highlight',
        start: annotation.start,
        end: annotation.end,
        square: annotation.square,
        color: annotation.color,
      });
    } else if (annotation.type === 'arrow') {
      events.push({
        id: `a${String(index + 1).padStart(4, '0')}`,
        type: 'arrow',
        start: annotation.start,
        end: annotation.end,
        from: annotation.from,
        to: annotation.to,
        color: annotation.color,
      });
    }
  });

  return events;
}

// ========================================
// EDIT THIS SECTION TO CREATE YOUR EVENTS
// ========================================

const movesData: MoveInput[] = [
  // Italian Game example
  { timestamp: 2.0, move: 'e4' },
  { timestamp: 5.0, move: 'e5' },
  { timestamp: 8.0, move: 'Nf3' },
  { timestamp: 11.0, move: 'Nc6' },
  { timestamp: 14.0, move: 'Bc4' },
  { timestamp: 17.0, move: 'Bc5' },
  { timestamp: 20.0, move: 'd3' },
  { timestamp: 23.0, move: 'Nf6' },
  { timestamp: 26.0, move: 'O-O' },
  { timestamp: 29.0, move: 'd6' },
];

const annotationsData: AnnotationInput[] = [
  // Highlight weak f7 pawn
  {
    type: 'highlight',
    start: 15.0,
    end: 18.0,
    square: 'f7',
  },
  // Show bishop attacking f7
  {
    type: 'arrow',
    start: 15.0,
    end: 18.0,
    from: 'c4',
    to: 'f7',
    color: 'rgb(255, 0, 0)',
  },
  // Highlight center pawns
  {
    type: 'highlight',
    start: 21.0,
    end: 25.0,
    square: 'e4',
  },
  {
    type: 'highlight',
    start: 21.0,
    end: 25.0,
    square: 'e5',
  },
  // Show castling move
  {
    type: 'arrow',
    start: 27.0,
    end: 30.0,
    from: 'e1',
    to: 'g1',
    color: 'rgb(0, 255, 0)',
  },
];

// ========================================
// MAIN EXECUTION
// ========================================

function main() {
  console.log('🎯 Generating chess events...\n');

  try {
    const events = generateEvents(movesData, annotationsData);

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write to file
    const outputPath = path.join(dataDir, 'generatedEvents.ts');
    const fileContent = `import { ChessEvent } from "@/types/events";

/**
 * Auto-generated chess events
 * Generated at: ${new Date().toISOString()}
 * Total events: ${events.length}
 */
export const generatedEvents: ChessEvent[] = ${JSON.stringify(events, null, 2)};
`;

    fs.writeFileSync(outputPath, fileContent);

    console.log('✅ Events generated successfully!');
    console.log(`📁 Output: ${outputPath}`);
    console.log(`📊 Statistics:`);
    console.log(`   - Total events: ${events.length}`);
    console.log(`   - Moves: ${events.filter(e => e.type === 'move').length}`);
    console.log(`   - Highlights: ${events.filter(e => e.type === 'highlight').length}`);
    console.log(`   - Arrows: ${events.filter(e => e.type === 'arrow').length}`);
    console.log('\n✨ You can now import these events in your components:');
    console.log('   import { generatedEvents } from "@/data/generatedEvents";');

  } catch (error) {
    console.error('❌ Error generating events:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { generateEvents };

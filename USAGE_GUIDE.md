# VideoBoardSync - Complete Usage Guide

## 📚 Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Basic Usage](#basic-usage)
3. [Creating Events](#creating-events)
4. [Advanced Features](#advanced-features)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Installation & Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Install Dependencies

```bash
npm install react-youtube react-chessboard chess.js
```

### TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## Basic Usage

### Minimal Example

```tsx
import VideoBoardSync from "@/components/VideoBoardSync";

export default function ChessLesson() {
  const events = [
    {
      id: "m1",
      type: "move",
      timestamp: 5.0,
      from: "e2",
      to: "e4",
      san: "e4",
      fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
    }
  ];

  return (
    <VideoBoardSync 
      videoUrl="https://youtube.com/watch?v=YOUR_VIDEO_ID"
      events={events}
    />
  );
}
```

### With Initial Position

```tsx
<VideoBoardSync 
  videoUrl="https://youtube.com/watch?v=YOUR_VIDEO_ID"
  events={events}
  initialFen="rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 4 3"
/>
```

---

## Creating Events

### Generating FEN Strings

Use chess.js to generate accurate FEN strings:

```typescript
import { Chess } from 'chess.js';

const chess = new Chess();

// Make moves
chess.move('e4');
const fen1 = chess.fen();

chess.move('e5');
const fen2 = chess.fen();

chess.move('Nf3');
const fen3 = chess.fen();

// Create events
const events = [
  {
    id: "m1",
    type: "move",
    timestamp: 2.0,
    from: "e2",
    to: "e4",
    san: "e4",
    fen: fen1
  },
  {
    id: "m2",
    type: "move",
    timestamp: 5.0,
    from: "e7",
    to: "e5",
    san: "e5",
    fen: fen2
  },
  {
    id: "m3",
    type: "move",
    timestamp: 8.0,
    from: "g1",
    to: "f3",
    san: "Nf3",
    fen: fen3
  }
];
```

### Using a Helper Script

Create `scripts/generateEvents.ts`:

```typescript
import { Chess } from 'chess.js';
import fs from 'fs';

interface MoveData {
  timestamp: number;
  move: string; // SAN notation
}

function generateEvents(moves: MoveData[]) {
  const chess = new Chess();
  const events = [];

  for (let i = 0; i < moves.length; i++) {
    const moveData = moves[i];
    const moveResult = chess.move(moveData.move);
    
    if (moveResult) {
      events.push({
        id: `m${String(i + 1).padStart(4, '0')}`,
        type: "move",
        timestamp: moveData.timestamp,
        from: moveResult.from,
        to: moveResult.to,
        san: moveResult.san,
        fen: chess.fen()
      });
    }
  }

  return events;
}

// Example usage
const movesData = [
  { timestamp: 2.0, move: 'e4' },
  { timestamp: 5.0, move: 'e5' },
  { timestamp: 8.0, move: 'Nf3' },
  { timestamp: 11.0, move: 'Nc6' },
  { timestamp: 14.0, move: 'Bc4' },
];

const events = generateEvents(movesData);

// Save to file
fs.writeFileSync(
  'data/myEvents.json',
  JSON.stringify(events, null, 2)
);

console.log('Events generated successfully!');
```

Run with:
```bash
npx ts-node scripts/generateEvents.ts
```

### Adding Annotations

```typescript
const eventsWithAnnotations = [
  // Moves
  ...moveEvents,
  
  // Highlight a key square
  {
    id: "h1",
    type: "highlight",
    start: 10.0,    // Appears at 10 seconds
    end: 15.0,      // Disappears at 15 seconds
    square: "d5",
    color: "yellow" // Optional
  },
  
  // Show an attacking arrow
  {
    id: "a1",
    type: "arrow",
    start: 20.0,
    end: 25.0,
    from: "e4",
    to: "d5",
    color: "rgb(255, 0, 0)" // Red arrow
  },
  
  // Multiple highlights at once
  {
    id: "h2",
    type: "highlight",
    start: 30.0,
    end: 35.0,
    square: "e5",
  },
  {
    id: "h3",
    type: "highlight",
    start: 30.0,
    end: 35.0,
    square: "d4",
  },
];
```

---

## Advanced Features

### Custom Annotation Colors

```typescript
// Highlight colors
const highlightEvent = {
  id: "h1",
  type: "highlight",
  start: 5.0,
  end: 10.0,
  square: "e4",
  color: "rgba(0, 255, 0, 0.5)" // Green with 50% opacity
};

// Arrow colors
const arrowEvent = {
  id: "a1",
  type: "arrow",
  start: 5.0,
  end: 10.0,
  from: "e4",
  to: "e5",
  color: "rgb(0, 150, 255)" // Blue
};
```

### Timing Multiple Annotations

Show tactical themes with overlapping annotations:

```typescript
const events = [
  // ... moves ...
  
  // Show a fork at timestamp 15-20
  {
    id: "h_fork1",
    type: "highlight",
    start: 15.0,
    end: 20.0,
    square: "d5", // Knight position
  },
  {
    id: "h_fork2",
    type: "highlight",
    start: 15.0,
    end: 20.0,
    square: "c7", // Attacked piece 1
  },
  {
    id: "h_fork3",
    type: "highlight",
    start: 15.0,
    end: 20.0,
    square: "e3", // Attacked piece 2
  },
  {
    id: "a_fork1",
    type: "arrow",
    start: 15.0,
    end: 20.0,
    from: "d5",
    to: "c7",
    color: "rgb(255, 0, 0)"
  },
  {
    id: "a_fork2",
    type: "arrow",
    start: 15.0,
    end: 20.0,
    from: "d5",
    to: "e3",
    color: "rgb(255, 0, 0)"
  },
];
```

### Loading Events from JSON

```typescript
// data/myGame.json
{
  "videoUrl": "https://youtube.com/watch?v=...",
  "events": [
    {
      "id": "m1",
      "type": "move",
      "timestamp": 2.0,
      "from": "e2",
      "to": "e4",
      "san": "e4",
      "fen": "..."
    }
  ]
}
```

```tsx
import gameData from '@/data/myGame.json';

export default function GamePage() {
  return (
    <VideoBoardSync 
      videoUrl={gameData.videoUrl}
      events={gameData.events}
    />
  );
}
```

### Dynamic Events

```tsx
"use client";

import { useState, useEffect } from 'react';
import VideoBoardSync from '@/components/VideoBoardSync';

export default function DynamicGame() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/chess-events?gameId=123')
      .then(res => res.json())
      .then(data => {
        setEvents(data.events);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <VideoBoardSync 
      videoUrl="https://youtube.com/watch?v=..."
      events={events}
    />
  );
}
```

---

## Best Practices

### 1. Event ID Naming

Use consistent, descriptive IDs:

```typescript
// Good
"m0001" // move 1
"m0002" // move 2
"h0001" // highlight 1
"a0001" // arrow 1

// Also good
"move_e4"
"highlight_center"
"arrow_attack_f7"
```

### 2. Timing Guidelines

- **Moves**: Set timestamp to when the move is mentioned/shown
- **Highlights**: 
  - Start: When concept is introduced
  - End: When discussion moves to next topic
  - Duration: Usually 2-5 seconds
- **Arrows**: 
  - Start: When showing attack/plan
  - End: When concept is complete
  - Duration: Usually 3-8 seconds

### 3. Annotation Best Practices

```typescript
// ❌ Bad: Too many overlapping highlights
{
  type: "highlight",
  start: 5.0,
  end: 10.0,
  square: "a1"
},
{
  type: "highlight",
  start: 5.0,
  end: 10.0,
  square: "b1"
},
// ... 20 more squares

// ✅ Good: Focus on key squares
{
  type: "highlight",
  start: 5.0,
  end: 10.0,
  square: "e4" // Main point
},
{
  type: "highlight",
  start: 5.0,
  end: 10.0,
  square: "d5" // Key square
}
```

### 4. Performance Optimization

For large event sets (100+ moves):

```typescript
// Pre-sort events in your data file
const events = [...].sort((a, b) => {
  const timeA = a.type === 'move' ? a.timestamp : a.start;
  const timeB = b.type === 'move' ? b.timestamp : b.start;
  return timeA - timeB;
});
```

### 5. Testing Events

```typescript
// Create a test utility
function validateEvents(events: ChessEvent[]) {
  const chess = new Chess();
  
  const moves = events.filter(e => e.type === 'move');
  
  for (const move of moves) {
    const result = chess.move({ from: move.from, to: move.to });
    
    if (!result) {
      console.error(`Invalid move: ${move.san} at ${move.timestamp}s`);
      return false;
    }
    
    if (chess.fen() !== move.fen) {
      console.error(`FEN mismatch at move ${move.san}`);
      return false;
    }
  }
  
  return true;
}
```

---

## Troubleshooting

### Video Not Loading

**Problem**: YouTube video doesn't appear

**Solutions**:
1. Check URL format:
   ```typescript
   // ✅ Valid formats
   "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
   "https://youtu.be/dQw4w9WgXcQ"
   "dQw4w9WgXcQ" // Just the ID
   
   // ❌ Invalid
   "youtube.com/dQw4w9WgXcQ"
   ```

2. Check embed permissions (some videos can't be embedded)
3. Ensure video is public

### Board Not Syncing

**Problem**: Board doesn't update with video

**Solutions**:
1. Check timestamps are in seconds (not milliseconds)
2. Verify FEN strings are valid
3. Check browser console for errors
4. Ensure events are sorted by timestamp

### Annotations Not Appearing

**Problem**: Highlights/arrows don't show

**Solutions**:
1. Check time ranges: `start < end`
2. Verify square notation (lowercase, e.g., "e4" not "E4")
3. Check timing: `currentTime >= start && currentTime < end`

### Performance Issues

**Problem**: Laggy playback or board updates

**Solutions**:
1. Reduce `SYNC_INTERVAL_MS` (default: 200ms)
   ```tsx
   const SYNC_INTERVAL_MS = 300; // Less frequent updates
   ```

2. Minimize concurrent annotations (< 10 at once)
3. Check for memory leaks in useEffect cleanup

### TypeScript Errors

**Problem**: Type errors with events

**Solutions**:
```typescript
import { ChessEvent } from "@/types/events";

// Explicit typing
const events: ChessEvent[] = [
  {
    id: "m1",
    type: "move", // Must be literal "move"
    // ... other fields
  } as const // Type assertion if needed
];
```

---

## 🎓 Complete Example

Here's a full working example:

```tsx
"use client";

import { Chess } from 'chess.js';
import VideoBoardSync from '@/components/VideoBoardSync';
import { ChessEvent } from '@/types/events';

export default function CompleteExample() {
  // Generate moves programmatically
  const chess = new Chess();
  const moves: ChessEvent[] = [];
  
  const movesData = [
    { time: 2.0, move: 'e4' },
    { time: 5.0, move: 'e5' },
    { time: 8.0, move: 'Nf3' },
    { time: 11.0, move: 'Nc6' },
    { time: 14.0, move: 'Bc4' },
    { time: 17.0, move: 'Bc5' },
  ];
  
  movesData.forEach((data, index) => {
    const result = chess.move(data.move);
    if (result) {
      moves.push({
        id: `m${index + 1}`,
        type: 'move',
        timestamp: data.time,
        from: result.from,
        to: result.to,
        san: result.san,
        fen: chess.fen(),
      });
    }
  });
  
  // Add annotations
  const annotations: ChessEvent[] = [
    {
      id: 'h1',
      type: 'highlight',
      start: 15.0,
      end: 20.0,
      square: 'f7',
    },
    {
      id: 'a1',
      type: 'arrow',
      start: 15.0,
      end: 20.0,
      from: 'c4',
      to: 'f7',
      color: 'rgb(255, 0, 0)',
    },
  ];
  
  const allEvents = [...moves, ...annotations];
  
  return (
    <VideoBoardSync
      videoUrl="https://youtube.com/watch?v=YOUR_VIDEO"
      events={allEvents}
    />
  );
}
```

---

## 🔗 Additional Resources

- [Chess.js Documentation](https://github.com/jhlywa/chess.js/blob/master/README.md)
- [FEN Notation Guide](https://www.chess.com/terms/fen-chess)
- [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference)
- [React Chessboard API](https://github.com/Clariity/react-chessboard)

---

**Need help?** Open an issue on GitHub or check the examples in `/app/custom-example`

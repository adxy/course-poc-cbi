# Video Board Sync 🎬♟️

A powerful React/Next.js component that synchronizes a chessboard with a YouTube video using event timestamps. Perfect for chess tutorials, game analysis, and educational content.

## 🎯 Features

- **Real-time Synchronization**: Board updates automatically as the video plays
- **Event-driven Annotations**: Support for highlights and arrows with time ranges
- **Binary Search Optimization**: Efficient O(log n) move lookup
- **Seek Support**: Instantly updates board position when scrubbing through video
- **Smooth Updates**: 200ms polling interval for seamless playback
- **Responsive Design**: Beautiful side-by-side layout that works on all devices
- **TypeScript Support**: Full type safety out of the box

## 🚀 Quick Start

### Installation

```bash
npm install
# or
yarn install
```

### Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

## 📖 Usage

### Basic Example

```tsx
import VideoBoardSync from "@/components/VideoBoardSync";

export default function MyPage() {
  const events = [
    {
      id: "m0001",
      type: "move",
      timestamp: 1.68,
      from: "e2",
      to: "e4",
      san: "e4",
      fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
    },
    {
      id: "h0001",
      type: "highlight",
      start: 7.02,
      end: 9.5,
      square: "d4"
    },
    {
      id: "a0001",
      type: "arrow",
      start: 9.87,
      end: 14.23,
      from: "f3",
      to: "e5"
    }
  ];

  return (
    <VideoBoardSync 
      videoUrl="https://www.youtube.com/watch?v=YOUR_VIDEO_ID" 
      events={events} 
    />
  );
}
```

### Event Types

#### Move Event
```typescript
{
  id: string;          // Unique identifier
  type: "move";
  timestamp: number;   // Time in seconds when move occurs
  from: string;        // Starting square (e.g., "e2")
  to: string;          // Ending square (e.g., "e4")
  san: string;         // Standard Algebraic Notation (e.g., "e4", "Nf3")
  fen: string;         // Board position after the move
}
```

#### Highlight Event
```typescript
{
  id: string;
  type: "highlight";
  start: number;       // Time when highlight appears
  end: number;         // Time when highlight disappears
  square: string;      // Square to highlight (e.g., "d4")
  color?: string;      // Optional color (default: yellow)
}
```

#### Arrow Event
```typescript
{
  id: string;
  type: "arrow";
  start: number;       // Time when arrow appears
  end: number;         // Time when arrow disappears
  from: string;        // Starting square
  to: string;          // Ending square
  color?: string;      // Optional color (default: red)
}
```

## 🧩 Component Architecture

### Core Components

1. **VideoBoardSync** (`components/VideoBoardSync.tsx`)
   - Main component that orchestrates video and board sync
   - Handles YouTube player lifecycle
   - Manages polling and state updates

2. **Chess Sync Utilities** (`utils/chessSync.ts`)
   - `findLatestMoveIndex()`: Binary search for efficient move lookup
   - `getActiveAnnotations()`: Filter annotations by time range
   - `categorizeEvents()`: Organize and sort events by type
   - `extractYouTubeVideoId()`: Parse YouTube URLs

3. **Type Definitions** (`types/events.ts`)
   - TypeScript interfaces for all event types
   - Component props definitions

### Sync Algorithm

```
1. Video plays → onStateChange triggered
2. Start polling every 200ms
3. For each poll:
   a. Get current video time
   b. Binary search for latest move ≤ time
   c. Update board FEN
   d. Filter active annotations (start ≤ time < end)
   e. Update highlights and arrows
4. User seeks → immediately sync to new time
5. Video pauses → stop polling, sync once
```

## 🎨 Customization

### Custom Board Styles

Modify the `customSquareStyles` in `VideoBoardSync.tsx`:

```tsx
const customSquareStyles = Object.fromEntries(
  Array.from(activeHighlights).map((square) => [
    square,
    { 
      backgroundColor: "rgba(255, 255, 0, 0.4)", // Change highlight color
      borderRadius: "50%" // Add custom styles
    },
  ])
);
```

### Custom Arrow Colors

In your events:

```typescript
{
  id: "a0001",
  type: "arrow",
  start: 9.87,
  end: 14.23,
  from: "f3",
  to: "e5",
  color: "rgb(0, 255, 0)" // Green arrow
}
```

### Adjust Sync Interval

Change the polling frequency in `VideoBoardSync.tsx`:

```tsx
const SYNC_INTERVAL_MS = 100; // Faster updates (more CPU)
// or
const SYNC_INTERVAL_MS = 500; // Slower updates (less CPU)
```

## 📦 Creating Your Own Events

### Method 1: Manual Creation

```typescript
import { ChessEvent } from "@/types/events";

const myEvents: ChessEvent[] = [
  {
    id: "m0001",
    type: "move",
    timestamp: 2.5,
    from: "e2",
    to: "e4",
    san: "e4",
    fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
  },
  // ... more events
];
```

### Method 2: Using Helper Function

```typescript
import { createCustomEvents } from "@/data/sampleEvents";

const myEvents = createCustomEvents(
  [
    // Moves
    { timestamp: 1.5, from: "e2", to: "e4", san: "e4", fen: "..." },
    { timestamp: 3.0, from: "e7", to: "e5", san: "e5", fen: "..." },
  ],
  [
    // Annotations
    { type: "highlight", start: 5.0, end: 8.0, square: "d4" },
    { type: "arrow", start: 10.0, end: 15.0, from: "f3", to: "e5" },
  ]
);
```

## 🔧 Performance Tips

1. **Binary Search**: Move lookup is O(log n), efficient even with 1000+ moves
2. **Memoization**: Use `useCallback` and `useRef` to prevent unnecessary re-renders
3. **Event Sorting**: Events are sorted once at initialization
4. **Set for Highlights**: O(1) lookup for active highlight squares
5. **Debouncing**: 200ms polling prevents excessive updates

## 🎓 Educational Use Cases

- **Chess Tutorials**: Sync board with explanation videos
- **Game Analysis**: Show key positions and tactics
- **Opening Repertoire**: Highlight critical moments in opening theory
- **Endgame Studies**: Demonstrate winning techniques step-by-step
- **Tournament Coverage**: Follow along with live game commentary

## 📝 Generating FEN Strings

You can use chess.js to generate FEN strings:

```typescript
import { Chess } from 'chess.js';

const chess = new Chess();
chess.move('e4');
const fen = chess.fen();
console.log(fen); // Position after 1.e4
```

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **react-youtube** - YouTube IFrame API wrapper
- **react-chessboard** - Chessboard rendering
- **chess.js** - Chess logic and validation

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 🔗 Resources

- [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference)
- [react-chessboard Documentation](https://github.com/Clariity/react-chessboard)
- [chess.js Documentation](https://github.com/jhlywa/chess.js)
- [FEN Notation](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation)

---

**Happy Chess Coding! ♟️**

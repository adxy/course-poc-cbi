"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import styled from 'styled-components';
import { Container, Title, Flex, Text, Center } from '@mantine/core';
// @ts-expect-error - cm-chessboard doesn't have types
import { Chessboard } from "cm-chessboard/src/Chessboard.js";
// @ts-expect-error - cm-chessboard extensions don't have types
import { Markers, MARKER_TYPE } from "cm-chessboard/src/extensions/markers/Markers.js";
// @ts-expect-error - cm-chessboard extensions don't have types
import { Arrows, ARROW_TYPE } from "cm-chessboard/src/extensions/arrows/Arrows.js";
import "cm-chessboard/assets/chessboard.css";
import "cm-chessboard/assets/extensions/markers/markers.css";
import "cm-chessboard/assets/extensions/arrows/arrows.css";

import {
  VideoBoardSyncProps,
  MoveEvent,
  ArrowEvent,
} from "@/types/events";
import {
  findLatestMoveIndex,
  findLatestPosition,
  getActiveAnnotations,
  categorizeEvents,
  extractYouTubeVideoId,
} from "@/utils/chessSync";

const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const SYNC_INTERVAL_MS = 200; // Poll every 200ms for smooth updates

// Styled Components
const VideoContainer = styled.div`
  aspect-ratio: 16/9;
  position: relative;
  width: 100%;
  height: 100%;
`;

const BoardContainer = styled.div`
  width: 100%;
  max-width: 800px;
`;

const ResponsivePaper = styled.div<{ $order: { base: number; lg: number } }>`
  overflow: hidden;
  flex: 1 1 400px;
  min-width: 300px;
  border-radius: 0.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  @media (max-width: 1023px) {
    order: ${props => props.$order.base};
  }
  
  @media (min-width: 1024px) {
    order: ${props => props.$order.lg};
  }
`;

const TopBar = styled.div`
  background-color: var(--mantine-color-dark-7);
  height: 3rem;
  width: 100%;
`;

const BottomBar = styled.div`
  background-color: var(--mantine-color-dark-7);
  height: 3rem;
  width: 100%;    
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100svh;
  max-width: 1200px;
  margin: 0 auto; 
  padding: 0 1rem;
  max-height: 100svh;
`;

// Define YouTubePlayer type
type YouTubePlayer = {
  getCurrentTime: () => number;
  // Add other methods as needed
};

export default function VideoBoardSync({
  videoUrl,
  events,
  initialFen = STARTING_FEN,
}: VideoBoardSyncProps) {
  // YouTube player reference
  const playerRef = useRef<YouTubePlayer | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [, setPlayerReady] = useState<boolean>(false);

  // Chessboard reference
  const boardContainerRef = useRef<HTMLDivElement | null>(null);
  const chessboardRef = useRef<Chessboard | null>(null);

  // State
  const [currentFen, setCurrentFen] = useState<string>(initialFen);
  const [, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeHighlights, setActiveHighlights] = useState<Set<string>>(new Set());
  const [activeArrows, setActiveArrows] = useState<ArrowEvent[]>([]);
  const [, setLastMove] = useState<MoveEvent | null>(null);
  
  // Categorized events (memoized to avoid re-sorting on every render)
  const { moves, positions, highlights, arrows } = useMemo(() => categorizeEvents(events), [events]);

  // Initialize chessboard with extensions
  useEffect(() => {
    if (boardContainerRef.current && !chessboardRef.current) {
      console.log('♟️  Initializing cm-chessboard with extensions');
      chessboardRef.current = new Chessboard(boardContainerRef.current, {
        position: initialFen,
        sprite: {
          url: "/assets/pieces/staunty.svg"
        },
        style: {
          cssClass: "default"
        },
        extensions: [
          {
            class: Markers,
            props: {
              markerSprite: "/assets/markers.svg"
            }
          },
          {
            class: Arrows,
            props: {
              arrowSprite: "/assets/arrows.svg"
            }
          }
        ]
      });
      console.log('✅ cm-chessboard initialized with Markers and Arrows extensions');
    }

    return () => {
      if (chessboardRef.current) {
        console.log('🧹 Destroying cm-chessboard');
        chessboardRef.current.destroy();
        chessboardRef.current = null;
      }
    };
  }, [initialFen]);

  // Update board position when FEN changes
  useEffect(() => {
    if (chessboardRef.current && currentFen) {
      console.log('🎨 UPDATING BOARD TO FEN:', currentFen);
      chessboardRef.current.setPosition(currentFen, true); // true = animated
    }
  }, [currentFen]);

  // Update markers (highlights) when activeHighlights changes
  useEffect(() => {
    if (chessboardRef.current) {
      console.log('🟡 UPDATING HIGHLIGHTS:', Array.from(activeHighlights));
      // Remove all existing markers
      chessboardRef.current.removeMarkers();
      
      // Add new markers for active highlights - use the basic types from README
      activeHighlights.forEach((square) => {
        console.log('Adding highlight marker to square:', square);
        try {
          // Use the basic circle type as mentioned in README
          chessboardRef.current.addMarker(MARKER_TYPE.square, square);
          console.log('✅ Marker added to', square);
        } catch (error) {
          console.error('❌ Error adding marker:', error);
        }
      });
    }
  }, [activeHighlights]);

  // Update arrows when activeArrows changes
  useEffect(() => {
    if (chessboardRef.current) {
      console.log('🏹 UPDATING ARROWS:', activeArrows.length);
      // Remove all existing arrows
      chessboardRef.current.removeArrows();
      
      // Add new arrows (v5.1.x signature: type, from, to)
      activeArrows.forEach((arrow) => {
        if (arrow.from && arrow.to) {
          chessboardRef.current.addArrow(ARROW_TYPE.default, arrow.from, arrow.to);
        } else {
          console.warn('Invalid arrow:', arrow);
        }
      });
    }
  }, [activeArrows]);

  /**
   * Sync the board and annotations with the current video time
   */
  const syncBoardToTime = useCallback(
    (time: number) => {
      console.log('=== SYNC START ===');
      console.log('Current time:', time);
      console.log('Total moves available:', moves.length);
      console.log('Total positions available:', positions.length);
      
      if (moves.length > 0) {
        console.log('All move timestamps:', moves.map(m => `${m.san}@${m.timestamp}s`).join(', '));
      }
      
      // Find the latest move at or before current time
      const moveIndex = findLatestMoveIndex(moves, time);
      console.log('Found move index:', moveIndex);

      if (moveIndex === -1) {
        // No moves yet, check for position events or use initial position
        const latestPosition = findLatestPosition(positions, time);
        if (latestPosition) {
          console.log('📍 No moves yet, using position event:', latestPosition.fen);
          setCurrentFen(latestPosition.fen);
        } else {
          console.log('❌ No moves or positions found');
          console.log('Using initial FEN:', initialFen);
          setCurrentFen(initialFen);
        }
        setLastMove(null);
      } else {
        // Set the FEN from the latest move (moves override position events)
        const latestMove = moves[moveIndex];
        console.log('✅ Found move:', latestMove.san);
        console.log('   From:', latestMove.from, '→', latestMove.to);
        console.log('   Timestamp:', latestMove.timestamp);
        console.log('   FEN:', latestMove.fen);
        setCurrentFen(latestMove.fen);
        setLastMove(latestMove);
      }

      // Get active highlights
      const activeHighlightEvents = getActiveAnnotations(highlights, time);
      const highlightSquares = new Set(
        activeHighlightEvents.map((h) => h.square)
      );
      console.log('Active highlights:', Array.from(highlightSquares));
      setActiveHighlights(highlightSquares);

      // Get active arrows
      const activeArrowEvents = getActiveAnnotations(arrows, time);
      console.log('Active arrows:', activeArrowEvents.length);
      setActiveArrows(activeArrowEvents);

      setCurrentTime(time);
      console.log('=== SYNC END ===\n');
    },
    [moves, positions, highlights, arrows, initialFen]
  );

  /**
   * Poll the current time from the YouTube player
   */
  const pollCurrentTime = useCallback(() => {
    console.log('🔄 Polling... isPlaying:', isPlaying, 'playerRef:', !!playerRef.current);
    if (playerRef.current && isPlaying) {
      const player = playerRef.current;
      const time = player.getCurrentTime();
      console.log('📍 Got time from player:', time);
      syncBoardToTime(time);
    } else {
      console.log('⏸️  Not polling - player not ready or not playing');
    }
  }, [isPlaying, syncBoardToTime]);

  /**
   * Start polling when video plays
   */
  useEffect(() => {
    console.log('⚙️  Polling effect triggered. isPlaying:', isPlaying);
    if (isPlaying) {
      console.log('▶️  Starting polling interval (every', SYNC_INTERVAL_MS, 'ms)');
      syncIntervalRef.current = setInterval(pollCurrentTime, SYNC_INTERVAL_MS);
      // Immediately poll once
      pollCurrentTime();
    } else {
      console.log('⏹️  Stopping polling interval');
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    }

    return () => {
      console.log('🧹 Cleaning up polling interval');
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [isPlaying, pollCurrentTime]);

  /**
   * YouTube player event handlers
   */
  const onReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target as YouTubePlayer;
    setPlayerReady(true);
    console.log('YouTube player ready');
    console.log('Events loaded:', {
      moves: moves.length,
      positions: positions.length,
      highlights: highlights.length,
      arrows: arrows.length
    });
    if (moves.length > 0) {
      console.log('First move:', moves[0]);
      console.log('Last move:', moves[moves.length - 1]);
    }
    if (positions.length > 0) {
      console.log('First position:', positions[0]);
    }
  };

  const onStateChange: YouTubeProps["onStateChange"] = (event) => {
    // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    console.log('Player state changed:', event.data);
    
    if (event.data === 1) { // PLAYING
      setIsPlaying(true);
      // Immediately sync when starting to play
      const time = event.target.getCurrentTime();
      console.log('Playing at time:', time);
      syncBoardToTime(time);
    } else if (event.data === 2 || event.data === 0) { // PAUSED or ENDED
      setIsPlaying(false);
      // Sync once when paused
      const time = event.target.getCurrentTime();
      console.log('Paused at time:', time);
      syncBoardToTime(time);
    }
  };

  const onPlaybackRateChange: YouTubeProps["onPlaybackRateChange"] = (event) => {
    // When playback rate changes, sync immediately
    const time = event.target.getCurrentTime();
    syncBoardToTime(time);
  };

  // Extract video ID
  const videoId = extractYouTubeVideoId(videoUrl);

  if (!videoId) {
    return (
      <Center h="100vh">
        <Text c="red" size="xl">Invalid YouTube URL</Text>
      </Center>
    );
  }

  return (
    <Container fluid p='xs' bg="dark.8" style={{ minHeight: '100svh', maxHeight: '100svh' }}>
      <ContentContainer>
      
        <TopBar>
          <Title order={1} size="h4" ta="center" mb="xl" c="white">
            Mating the King - Two Rooks
          </Title>
        </TopBar>
        
        <Flex gap="md" wrap="wrap" align="flex-start" direction='row'>
          {/* YouTube Video - first on mobile, right on desktop */}
          <ResponsivePaper 
            $order={{ base: 1, lg: 2 }}
            style={{ backgroundColor: 'black' }}
          >
            <VideoContainer>
              <YouTube
                videoId={videoId}
                opts={{
                  width: "100%",
                  height: "100%",
                  playerVars: {
                    autoplay: 0,
                    controls: 1,
                    modestbranding: 1,
                  },
                }}
                onReady={onReady}
                onStateChange={onStateChange}
                onPlaybackRateChange={onPlaybackRateChange}
                style={{ width: '100%', height: '100%' }}
              />
            </VideoContainer>
          </ResponsivePaper>
          
          {/* Chessboard - second on mobile, left on desktop */}
          <ResponsivePaper 
            $order={{ base: 2, lg: 1 }}
            style={{ backgroundColor: 'var(--mantine-color-dark-8)' }}
          >
            <BoardContainer ref={boardContainerRef} />
          </ResponsivePaper>
        </Flex>
        <BottomBar>
          <Text c="white" size="sm" ta="center">
            Mating the King - Two Rooks
          </Text>
        </BottomBar>
        </ContentContainer>
    </Container>
  );
}

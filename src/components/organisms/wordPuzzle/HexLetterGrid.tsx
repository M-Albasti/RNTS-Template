import React, {useCallback, useMemo} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Line, Polygon} from 'react-native-svg';

import TextView from '@atoms/TextView';

import {
  areHexAdjacent,
  findHexAtPoint,
  hexKey,
  hexToPixel,
  lettersFromPath,
} from '@helpers/hexGridHelpers';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {HexCoord, HexLetterCell} from '@Types/wordPuzzleTypes';

type Props = {
  grid: HexLetterCell[];
  lockedKeys?: Set<string>;
  lockedColors?: Record<string, string>;
  onSelectionEnd: (letters: string, path: HexCoord[], accentColor: string) => void;
  onSelectionChange?: (letters: string, accentColor: string | null) => void;
  resetToken?: number;
  highlightPath?: HexCoord[];
};

/** Logical hex radius used for layout math; SVG viewBox scales this to the screen. */
const LOGICAL_HEX_SIZE = 20;
/** Extra viewBox padding so strokes / vertices are never clipped. */
const VIEW_PAD = 2;

const hexPolygonPoints = (cx: number, cy: number, radius: number) =>
  Array.from({length: 6}, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
  }).join(' ');

const measureBounds = (grid: HexLetterCell[], size: number) => {
  const xs = grid.map(cell => hexToPixel(cell.q, cell.r, size).x);
  const ys = grid.map(cell => hexToPixel(cell.q, cell.r, size).y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const pad = size + VIEW_PAD;
  return {
    width: maxX - minX + pad * 2,
    height: maxY - minY + pad * 2,
    minX,
    minY,
    pad,
  };
};

const HexLetterGrid = ({
  grid,
  lockedKeys,
  lockedColors,
  onSelectionEnd,
  onSelectionChange,
  resetToken = 0,
  highlightPath,
}: Props): React.JSX.Element => {
  const {width: windowWidth, height: windowHeight} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const {colors, scheme, spacing} = useThemeTokens();
  const selectionAccents = colors.selectionAccents;
  const defaultAccent = selectionAccents[0] ?? colors.primary;

  const maxBoardWidth = Math.max(
    120,
    windowWidth - spacing.lg * 2 - insets.left - insets.right,
  );
  const reservedChrome = 380 + insets.top + insets.bottom;
  const maxBoardHeight = Math.max(
    150,
    Math.min(windowHeight - reservedChrome, windowHeight * 0.42),
  );

  const [path, setPath] = React.useState<HexCoord[]>([]);
  const pathRef = React.useRef<HexCoord[]>([]);
  const endingRef = React.useRef(false);
  const selectionColorRef = React.useRef<string>(defaultAccent);
  const [selectionColor, setSelectionColor] = React.useState(defaultAccent);
  const dragPulse = useSharedValue(1);

  const pickSelectionColor = useCallback(() => {
    const palette = selectionAccents;
    if (palette.length === 0) {
      return colors.primary;
    }
    const used = new Set(Object.values(lockedColors ?? {}));
    const available = palette.filter(color => !used.has(color));
    // Prefer unused accents; only recycle if every theme accent is already locked.
    const pool = available.length > 0 ? available : palette;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [colors.primary, lockedColors, selectionAccents]);

  const locked = useMemo(() => lockedKeys ?? new Set<string>(), [lockedKeys]);
  const lockedFill = lockedColors ?? {};
  const prevLockedCount = React.useRef(0);

  React.useEffect(() => {
    if (locked.size > prevLockedCount.current) {
      dragPulse.value = withSequence(
        withSpring(1.012, {damping: 11, stiffness: 240}),
        withSpring(1, {damping: 14, stiffness: 180}),
      );
    }
    prevLockedCount.current = locked.size;
  }, [dragPulse, locked.size]);

  const bounds = useMemo(() => {
    if (grid.length === 0) {
      return {width: 1, height: 1, minX: 0, minY: 0, pad: LOGICAL_HEX_SIZE};
    }
    return measureBounds(grid, LOGICAL_HEX_SIZE);
  }, [grid]);

  const scale = useMemo(
    () => Math.min(maxBoardWidth / bounds.width, maxBoardHeight / bounds.height),
    [bounds.height, bounds.width, maxBoardHeight, maxBoardWidth],
  );

  const boardWidth = bounds.width * scale;
  const boardHeight = bounds.height * scale;
  const hexSize = LOGICAL_HEX_SIZE * scale;
  const visualRadius = Math.max(3, LOGICAL_HEX_SIZE - 1);
  const originX = bounds.pad - bounds.minX;
  const originY = bounds.pad - bounds.minY;

  React.useEffect(() => {
    pathRef.current = [];
    endingRef.current = false;
    setPath([]);
    onSelectionChange?.('', null);
  }, [resetToken, grid, onSelectionChange]);

  const activePath = highlightPath ?? path;
  const idleFill = scheme === 'dark' ? colors.textPrimary : colors.border;
  const idleStroke = scheme === 'dark' ? colors.border : colors.surface;
  const idleLetterColor = scheme === 'dark' ? colors.textInverse : colors.textPrimary;
  const activeLetterColor =
    scheme === 'dark' ? colors.textInverse : colors.textPrimary;

  const styles = useThemedStyles(() => ({
    container: {
      width: maxBoardWidth,
      maxWidth: '100%' as const,
      alignSelf: 'center' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginVertical: spacing.sm,
    },
    board: {
      width: boardWidth,
      height: boardHeight,
    },
    hex: {
      position: 'absolute' as const,
      width: hexSize * 2,
      height: hexSize * 2,
      marginLeft: -hexSize,
      marginTop: -hexSize,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    letter: {
      // Slightly smaller + matching lineHeight keeps Arabic glyphs optically centered.
      fontSize: Math.max(8, hexSize * 0.55),
      lineHeight: Math.max(10, hexSize * 0.55),
      fontWeight: '700' as const,
      textAlign: 'center' as const,
      includeFontPadding: false,
      textAlignVertical: 'center' as const,
      color: idleLetterColor,
    },
    letterActive: {
      color: activeLetterColor,
    },
  }));

  const publishPath = useCallback(
    (next: HexCoord[]) => {
      pathRef.current = next;
      setPath(next);
      onSelectionChange?.(
        lettersFromPath(next, grid),
        next.length > 0 ? selectionColorRef.current : null,
      );
    },
    [grid, onSelectionChange],
  );

  const appendCell = useCallback(
    (cell: HexLetterCell) => {
      const key = hexKey(cell);
      if (locked.has(key)) {
        return;
      }
      const current = pathRef.current;
      const existingIndex = current.findIndex(item => hexKey(item) === key);
      if (existingIndex >= 0) {
        publishPath(current.slice(0, existingIndex + 1));
        return;
      }
      if (current.length > 0) {
        const last = current[current.length - 1];
        if (!areHexAdjacent(last, cell)) {
          return;
        }
      }
      publishPath([...current, {q: cell.q, r: cell.r}]);
      dragPulse.value = withSpring(1.006, {damping: 14, stiffness: 220});
    },
    [dragPulse, locked, publishPath],
  );

  const handlePoint = useCallback(
    (x: number, y: number) => {
      const logicalX = scale > 0 ? x / scale : x;
      const logicalY = scale > 0 ? y / scale : y;
      const cell = findHexAtPoint(
        logicalX,
        logicalY,
        grid,
        originX,
        originY,
        LOGICAL_HEX_SIZE,
      );
      if (cell && !locked.has(hexKey(cell))) {
        appendCell(cell);
      }
    },
    [appendCell, grid, locked, originX, originY, scale],
  );

  const finishSelection = useCallback(() => {
    if (endingRef.current) {
      return;
    }
    endingRef.current = true;
    const finalPath = pathRef.current;
    if (finalPath.length > 0) {
      onSelectionEnd(
        lettersFromPath(finalPath, grid),
        finalPath,
        selectionColorRef.current,
      );
    }
    dragPulse.value = withSpring(1);
  }, [dragPulse, grid, onSelectionEnd]);

  const beginSelection = useCallback(() => {
    endingRef.current = false;
    const color = pickSelectionColor();
    selectionColorRef.current = color;
    setSelectionColor(color);
    pathRef.current = [];
    setPath([]);
    onSelectionChange?.('', color);
  }, [onSelectionChange, pickSelectionColor]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .onBegin(event => {
          beginSelection();
          handlePoint(event.x, event.y);
        })
        .onUpdate(event => {
          handlePoint(event.x, event.y);
        })
        .onEnd(() => {
          finishSelection();
        }),
    [beginSelection, finishSelection, handlePoint],
  );

  const boardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: dragPulse.value}],
  }));

  const isHintHighlight = Boolean(highlightPath?.length) && path.length === 0;
  const pathSet = new Set(activePath.map(hexKey));
  const linePoints = activePath
    .filter(coord => !locked.has(hexKey(coord)))
    .map(coord => {
      const pos = hexToPixel(coord.q, coord.r, LOGICAL_HEX_SIZE);
      return {
        x: pos.x - bounds.minX + bounds.pad,
        y: pos.y - bounds.minY + bounds.pad,
      };
    });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.board, boardAnimatedStyle]}>
          <Svg
            width={boardWidth}
            height={boardHeight}
            viewBox={`0 0 ${bounds.width} ${bounds.height}`}>
            {!isHintHighlight &&
              linePoints.slice(1).map((point, index) => (
                <Line
                  key={`line-${index}`}
                  x1={linePoints[index].x}
                  y1={linePoints[index].y}
                  x2={point.x}
                  y2={point.y}
                  stroke={scheme === 'dark' ? colors.textPrimary : colors.primaryContrast}
                  strokeWidth={Math.max(3, LOGICAL_HEX_SIZE * 0.16)}
                  strokeLinecap="round"
                  opacity={0.55}
                />
              ))}
            {grid.map(cell => {
              const pos = hexToPixel(cell.q, cell.r, LOGICAL_HEX_SIZE);
              const cx = pos.x - bounds.minX + bounds.pad;
              const cy = pos.y - bounds.minY + bounds.pad;
              const key = hexKey(cell);
              const isLocked = locked.has(key);
              const inPath = pathSet.has(key) && !isLocked;
              const isHinted = isHintHighlight && inPath;
              const isActive = !isHintHighlight && inPath;
              const fill = isActive
                ? selectionColor
                : isHinted
                  ? idleFill
                  : isLocked && lockedFill[key]
                    ? lockedFill[key]
                    : idleFill;
              // Theme border — never the same as fill, or edges vanish between neighbors.
              const selectionBorder =
                scheme === 'dark' ? colors.textPrimary : colors.primaryContrast;
              const stroke = isHinted
                ? colors.primary
                : isLocked || isActive
                  ? selectionBorder
                  : idleStroke;
              const strokeWidth = isHinted || isLocked || isActive ? 2.25 : 1;
              // Inset slightly so the stroke stays visible between adjacent hexes.
              const radius =
                isHinted || isLocked || isActive
                  ? Math.max(3, visualRadius - 1.25)
                  : visualRadius;
              return (
                <Polygon
                  key={`hex-${cell.id}`}
                  points={hexPolygonPoints(cx, cy, radius)}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                />
              );
            })}
          </Svg>
          {grid.map(cell => {
            const pos = hexToPixel(cell.q, cell.r, LOGICAL_HEX_SIZE);
            const cx = (pos.x - bounds.minX + bounds.pad) * scale;
            const cy = (pos.y - bounds.minY + bounds.pad) * scale;
            const key = hexKey(cell);
            const isLocked = locked.has(key);
            const inPath = pathSet.has(key) && !isLocked;
            const isActive = !isHintHighlight && inPath;
            return (
              <View
                key={`letter-${cell.id}`}
                pointerEvents="none"
                style={[styles.hex, {left: cx, top: cy}]}>
                <TextView
                  text={cell.letter}
                  style={[
                    styles.letter,
                    (isActive || isLocked) && styles.letterActive,
                  ]}
                  align="center"
                />
              </View>
            );
          })}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default HexLetterGrid;

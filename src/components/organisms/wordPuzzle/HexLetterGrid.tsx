import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Svg, {Line} from 'react-native-svg';

import TextView from '@atoms/TextView';

import {
  HEX_SIZE,
  areHexAdjacent,
  findHexAtPoint,
  hexKey,
  hexToPixel,
  lettersFromPath,
} from '@helpers/hexGridHelpers';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {HexCoord, HexLetterCell} from '@Types/wordPuzzleTypes';

type Props = {
  grid: HexLetterCell[];
  onSelectionEnd: (letters: string, path: HexCoord[]) => void;
  resetToken?: number;
  highlightPath?: HexCoord[];
};

const HexLetterGrid = ({
  grid,
  onSelectionEnd,
  resetToken = 0,
  highlightPath,
}: Props): React.JSX.Element => {
  const [path, setPath] = React.useState<HexCoord[]>([]);
  const pathRef = React.useRef<HexCoord[]>([]);
  const dragPulse = useSharedValue(1);

  const bounds = useMemo(() => {
    const xs = grid.map(cell => hexToPixel(cell.q, cell.r).x);
    const ys = grid.map(cell => hexToPixel(cell.q, cell.r).y);
    const minX = Math.min(...xs) - HEX_SIZE;
    const maxX = Math.max(...xs) + HEX_SIZE;
    const minY = Math.min(...ys) - HEX_SIZE;
    const maxY = Math.max(...ys) + HEX_SIZE;
    return {width: maxX - minX + HEX_SIZE, height: maxY - minY + HEX_SIZE, minX, minY};
  }, [grid]);

  const originX = HEX_SIZE - bounds.minX;
  const originY = HEX_SIZE - bounds.minY;

  React.useEffect(() => {
    pathRef.current = [];
    setPath([]);
  }, [resetToken, grid]);

  const activePath = highlightPath ?? path;

  const styles = useThemedStyles(tokens => ({
    wrap: {
      alignSelf: 'center' as const,
      width: bounds.width,
      height: bounds.height,
      marginVertical: tokens.spacing.md,
    },
    hex: {
      position: 'absolute' as const,
      width: HEX_SIZE * 2,
      height: HEX_SIZE * 2,
      marginLeft: -HEX_SIZE,
      marginTop: -HEX_SIZE,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    hexInner: {
      width: HEX_SIZE * 1.7,
      height: HEX_SIZE * 1.7,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.md,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
    },
    hexActive: {
      backgroundColor: tokens.colors.primaryMuted,
      borderColor: tokens.colors.primary,
      transform: [{scale: 1.06}],
    },
    letter: {
      fontSize: tokens.typography.h3.fontSize,
      fontWeight: '700' as const,
      textAlign: 'center' as const,
    },
  }));

  const appendCell = useCallback(
    (cell: HexLetterCell) => {
      const current = pathRef.current;
      const key = hexKey(cell);
      const existingIndex = current.findIndex(item => hexKey(item) === key);
      if (existingIndex >= 0) {
        const trimmed = current.slice(0, existingIndex + 1);
        pathRef.current = trimmed;
        setPath(trimmed);
        return;
      }
      if (current.length > 0) {
        const last = current[current.length - 1];
        if (!areHexAdjacent(last, cell)) {
          return;
        }
      }
      const next = [...current, {q: cell.q, r: cell.r}];
      pathRef.current = next;
      setPath(next);
      dragPulse.value = withSpring(1.02, {damping: 14, stiffness: 220});
    },
    [dragPulse],
  );

  const handlePoint = useCallback(
    (x: number, y: number) => {
      const cell = findHexAtPoint(x, y, grid, originX, originY);
      if (cell) {
        appendCell(cell);
      }
    },
    [appendCell, grid, originX, originY],
  );

  const finishSelection = useCallback(() => {
    const finalPath = pathRef.current;
    if (finalPath.length > 0) {
      onSelectionEnd(lettersFromPath(finalPath, grid), finalPath);
    }
    dragPulse.value = withSpring(1);
  }, [dragPulse, grid, onSelectionEnd]);

  const resetSelection = useCallback(() => {
    pathRef.current = [];
    setPath([]);
  }, []);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .onBegin(event => {
          resetSelection();
          handlePoint(event.x, event.y);
        })
        .onUpdate(event => {
          handlePoint(event.x, event.y);
        })
        .onEnd(() => {
          finishSelection();
        })
        .onFinalize(() => {
          finishSelection();
        }),
    [finishSelection, handlePoint, resetSelection],
  );

  const wrapAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: dragPulse.value}],
  }));

  const pathSet = new Set(activePath.map(hexKey));
  const linePoints = activePath.map(coord => {
    const pos = hexToPixel(coord.q, coord.r);
    return {
      x: pos.x - bounds.minX + HEX_SIZE,
      y: pos.y - bounds.minY + HEX_SIZE,
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.wrap, wrapAnimatedStyle]}>
        <Svg width={bounds.width} height={bounds.height} style={{position: 'absolute'}}>
          {linePoints.slice(1).map((point, index) => (
            <Line
              key={`line-${index}`}
              x1={linePoints[index].x}
              y1={linePoints[index].y}
              x2={point.x}
              y2={point.y}
              stroke="#7c4dff"
              strokeWidth={6}
              strokeLinecap="round"
            />
          ))}
        </Svg>
        {grid.map(cell => {
          const pos = hexToPixel(cell.q, cell.r);
          const active = pathSet.has(hexKey(cell));
          return (
            <View
              key={cell.id}
              style={[
                styles.hex,
                {
                  left: pos.x - bounds.minX + HEX_SIZE,
                  top: pos.y - bounds.minY + HEX_SIZE,
                },
              ]}>
              <View style={[styles.hexInner, active && styles.hexActive]}>
                <TextView text={cell.letter} style={styles.letter} />
              </View>
            </View>
          );
        })}
      </Animated.View>
    </GestureDetector>
  );
};

export default HexLetterGrid;

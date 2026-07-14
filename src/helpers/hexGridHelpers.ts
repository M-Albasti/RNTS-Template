import type {HexCoord, HexLetterCell, WordPuzzleLanguage} from '@Types/wordPuzzleTypes';

/** Baseline hex radius; prefer `getHexSizeForGrid` for layout. */
export const HEX_SIZE = 34;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Pick a hex radius so the given grid fits inside available width and height.
 * Must stay in sync with HexLetterGrid bounds: size * (span + 2).
 * Never forces a size larger than what fits (that overflows the screen).
 */
export const getHexSizeForGrid = (
  grid: HexLetterCell[],
  availableWidth: number,
  availableHeight?: number,
): number => {
  if (grid.length === 0 || availableWidth <= 0) {
    return HEX_SIZE;
  }

  const unitXs = grid.map(cell => hexToPixel(cell.q, cell.r, 1).x);
  const unitYs = grid.map(cell => hexToPixel(cell.q, cell.r, 1).y);
  const spanX = Math.max(...unitXs) - Math.min(...unitXs);
  const spanY = Math.max(...unitYs) - Math.min(...unitYs);
  // One hex radius of padding on each side of the center span.
  const widthFactor = Math.max(spanX + 2, 1);
  const heightFactor = Math.max(spanY + 2, 1);

  const fitWidth = Math.max(availableWidth - 8, 1);
  const fitHeight = Math.max((availableHeight ?? availableWidth) - 8, 1);
  const fitted = Math.min(fitWidth / widthFactor, fitHeight / heightFactor);
  // Cap the maximum only — never raise above `fitted` or tiles spill off-screen.
  return Math.min(fitted, 36);
};

/** @deprecated Prefer getHexSizeForGrid — screen-only sizing still overflows long words. */
export const getResponsiveHexSize = (screenWidth: number): number =>
  clamp(screenWidth * 0.09, 28, 40);

export const hexToPixel = (q: number, r: number, size = HEX_SIZE) => {
  // Pointy-top (matches honeycomb reference art).
  const x = size * Math.sqrt(3) * (q + r / 2);
  const y = size * (3 / 2) * r;
  return {x, y};
};

export const pixelToHex = (x: number, y: number, size = HEX_SIZE): HexCoord => {
  const q = ((Math.sqrt(3) / 3) * x - (1 / 3) * y) / size;
  const r = ((2 / 3) * y) / size;
  return axialRound(q, r);
};

const axialRound = (q: number, r: number): HexCoord => {
  const s = -q - r;
  let rq = Math.round(q);
  let rr = Math.round(r);
  const rs = Math.round(s);
  const qDiff = Math.abs(rq - q);
  const rDiff = Math.abs(rr - r);
  const sDiff = Math.abs(rs - s);

  if (qDiff > rDiff && qDiff > sDiff) {
    rq = -rr - rs;
  } else if (rDiff > sDiff) {
    rr = -rq - rs;
  }

  return {q: rq, r: rr};
};

export const hexKey = (coord: HexCoord) => `${coord.q}:${coord.r}`;

export const hexDistance = (a: HexCoord, b: HexCoord) =>
  (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;

export const areHexAdjacent = (a: HexCoord, b: HexCoord) => hexDistance(a, b) === 1;

export const normalizeWord = (word: string, language: WordPuzzleLanguage) => {
  const stripped = word
    .trim()
    .replace(/\s+/g, '')
    .replace(/[\u064B-\u065F]/g, '');
  if (language === 'ar') {
    return stripped.replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
  }
  return stripped.toLowerCase();
};

/** Normalize for display while keeping single spaces between answer words. */
export const normalizeAnswerForDisplay = (word: string, language: WordPuzzleLanguage) =>
  word
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(part => normalizeWord(part, language))
    .join(' ');

/**
 * Insert word-gap spaces into a compact selection using an answer template that may contain spaces.
 * A gap appears only after a full word's letters have been selected.
 */
export const formatSelectionWithWordGaps = (
  selection: string,
  answerTemplate?: string,
): string => {
  const compact = selection.replace(/\s+/g, '');
  if (!compact) {
    return '';
  }
  if (!answerTemplate || !/\s/.test(answerTemplate)) {
    return compact;
  }

  const wordLengths = answerTemplate
    .trim()
    .split(/\s+/)
    .map(word => word.replace(/[\s\u064B-\u065F]/g, '').length)
    .filter(length => length > 0);

  if (wordLengths.length <= 1) {
    return compact;
  }

  let result = '';
  let index = 0;
  for (let wordIndex = 0; wordIndex < wordLengths.length; wordIndex += 1) {
    const length = wordLengths[wordIndex];
    const remaining = compact.length - index;
    if (remaining <= 0) {
      break;
    }
    const take = Math.min(length, remaining);
    if (wordIndex > 0) {
      result += ' ';
    }
    result += compact.slice(index, index + take);
    index += take;
    if (take < length) {
      break;
    }
  }
  if (index < compact.length) {
    result += compact.slice(index);
  }
  return result;
};

/** True when the string contains Arabic script (independent of app UI language). */
export const hasArabicScript = (value: string) => /[\u0600-\u06FF]/.test(value);

export const buildGridForWord = (
  word: string,
  language: WordPuzzleLanguage,
  seed: number,
): {grid: HexLetterCell[]; solutionPath: HexCoord[]} => {
  const {grid, solutionPaths} = buildGridForWords([word], language, seed);
  return {grid, solutionPath: solutionPaths[0] ?? []};
};

const HEX_DIRS: HexCoord[] = [
  {q: 1, r: 0},
  {q: 1, r: -1},
  {q: 0, r: -1},
  {q: -1, r: 0},
  {q: -1, r: 1},
  {q: 0, r: 1},
];

const createRng = (seed: number) => {
  let state = seed >>> 0 || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

/** All cells of a filled hexagon large enough for `count` tiles (solid aligned group). */
const compactHexBlob = (count: number): HexCoord[] => {
  if (count <= 0) {
    return [];
  }
  const coords: HexCoord[] = [{q: 0, r: 0}];
  let ring = 1;
  while (coords.length < count) {
    for (let q = -ring; q <= ring; q += 1) {
      for (let r = -ring; r <= ring; r += 1) {
        if (Math.max(Math.abs(q), Math.abs(r), Math.abs(-q - r)) === ring) {
          coords.push({q, r});
          if (coords.length >= count) {
            return coords;
          }
        }
      }
    }
    ring += 1;
  }
  return coords;
};

const neighborsInSet = (coord: HexCoord, keySet: Set<string>): HexCoord[] =>
  HEX_DIRS.map(dir => ({q: coord.q + dir.q, r: coord.r + dir.r})).filter(next =>
    keySet.has(hexKey(next)),
  );

/**
 * Hamiltonian path through the blob so the whole board is one solid group
 * and can be split into contiguous per-answer paths.
 */
const findHamiltonianPath = (cells: HexCoord[], seed: number): HexCoord[] | null => {
  if (cells.length === 0) {
    return [];
  }
  if (cells.length === 1) {
    return [cells[0]];
  }

  const keySet = new Set(cells.map(hexKey));
  const rng = createRng(seed);
  const starts = [...cells];
  for (let i = starts.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = starts[i];
    starts[i] = starts[j];
    starts[j] = tmp;
  }

  const dfs = (path: HexCoord[], used: Set<string>): boolean => {
    if (path.length === cells.length) {
      return true;
    }
    const options = neighborsInSet(path[path.length - 1], keySet).filter(
      next => !used.has(hexKey(next)),
    );
    // Prefer cells with fewer exits (keeps the path from getting stuck).
    options.sort((a, b) => {
      const aFree = neighborsInSet(a, keySet).filter(n => !used.has(hexKey(n))).length;
      const bFree = neighborsInSet(b, keySet).filter(n => !used.has(hexKey(n))).length;
      return aFree - bFree;
    });
    for (const next of options) {
      const key = hexKey(next);
      used.add(key);
      path.push(next);
      if (dfs(path, used)) {
        return true;
      }
      path.pop();
      used.delete(key);
    }
    return false;
  };

  for (const start of starts.slice(0, Math.min(starts.length, 12))) {
    const path = [start];
    const used = new Set([hexKey(start)]);
    if (dfs(path, used)) {
      return path;
    }
  }
  return null;
};

const isContiguousPath = (path: HexCoord[]) => {
  for (let index = 1; index < path.length; index += 1) {
    if (!areHexAdjacent(path[index - 1], path[index])) {
      return false;
    }
  }
  return true;
};

/**
 * One aligned honeycomb group for all letters.
 * Each answer occupies a contiguous adjacent run inside that group (always solvable).
 */
export const buildGridForWords = (
  words: string[],
  _language: WordPuzzleLanguage,
  seed: number,
): {grid: HexLetterCell[]; solutionPaths: HexCoord[][]} => {
  const parsed = words.map(raw => raw.replace(/\s+/g, '').split('').filter(Boolean));
  const totalLetters = parsed.reduce((sum, letters) => sum + letters.length, 0);
  if (totalLetters === 0) {
    return {grid: [], solutionPaths: parsed.map(() => [])};
  }

  const blob = compactHexBlob(totalLetters);
  let spine = findHamiltonianPath(blob, seed);

  // Row serpentine fallback — keep the filled blob aligned.
  if (!spine || !isContiguousPath(spine) || spine.length !== totalLetters) {
    const byRow = new Map<number, HexCoord[]>();
    blob.forEach(cell => {
      const row = byRow.get(cell.r) ?? [];
      row.push(cell);
      byRow.set(cell.r, row);
    });
    const rows = Array.from(byRow.keys()).sort((a, b) => a - b);
    const candidate: HexCoord[] = [];
    rows.forEach((r, rowIndex) => {
      const row = (byRow.get(r) ?? []).sort((a, b) => a.q - b.q);
      if (rowIndex % 2 === 1) {
        row.reverse();
      }
      if (
        candidate.length > 0 &&
        row.length > 0 &&
        !areHexAdjacent(candidate[candidate.length - 1], row[0])
      ) {
        row.reverse();
      }
      candidate.push(...row);
    });
    spine = isContiguousPath(candidate) ? candidate : null;
  }

  // Last resort: grow contiguous word paths that stay glued to one cluster.
  if (!spine || spine.length !== totalLetters || !isContiguousPath(spine)) {
    return buildGridByClusterPaths(parsed, seed);
  }

  const ordered =
    seed % 2 === 0 ? spine.slice(0, totalLetters) : [...spine.slice(0, totalLetters)].reverse();

  const solutionPaths: HexCoord[][] = [];
  const occupied = new Map<string, HexLetterCell>();
  let cursor = 0;

  parsed.forEach((letters, wordIndex) => {
    if (letters.length === 0) {
      solutionPaths.push([]);
      return;
    }
    const path = ordered.slice(cursor, cursor + letters.length);
    cursor += letters.length;
    path.forEach((coord, index) => {
      occupied.set(hexKey(coord), {
        ...coord,
        id: hexKey(coord),
        letter: letters[index] ?? '',
        groupIndex: wordIndex,
      });
    });
    solutionPaths.push(path);
  });

  return {grid: Array.from(occupied.values()), solutionPaths};
};

/** Clustered contiguous paths — aligned group + each answer stays together. */
const buildGridByClusterPaths = (
  parsed: string[][],
  seed: number,
): {grid: HexLetterCell[]; solutionPaths: HexCoord[][]} => {
  const occupied = new Map<string, HexLetterCell>();
  const solutionPaths: HexCoord[][] = [];

  parsed.forEach((letters, wordIndex) => {
    if (letters.length === 0) {
      solutionPaths.push([]);
      return;
    }
    const blocked = new Set(occupied.keys());
    const rng = createRng(seed + wordIndex * 4999);
    let placed: HexCoord[] | null = null;

    const starts: HexCoord[] =
      occupied.size === 0
        ? [{q: 0, r: 0}]
        : Array.from(occupied.values()).flatMap(cell =>
            HEX_DIRS.map(dir => ({q: cell.q + dir.q, r: cell.r + dir.r})),
          ).filter(coord => !blocked.has(hexKey(coord)));

    for (const start of starts) {
      for (const dir of HEX_DIRS) {
        const path: HexCoord[] = [];
        let q = start.q;
        let r = start.r;
        let ok = true;
        for (let i = 0; i < letters.length; i += 1) {
          const key = hexKey({q, r});
          if (blocked.has(key) || path.some(c => hexKey(c) === key)) {
            ok = false;
            break;
          }
          path.push({q, r});
          q += dir.q;
          r += dir.r;
        }
        if (ok) {
          placed = path;
          break;
        }
      }
      if (placed) {
        break;
      }
    }

    if (!placed) {
      // Winding search from cluster edge
      for (const start of starts.slice(0, 24)) {
        const path = [start];
        const used = new Set([hexKey(start), ...blocked]);
        const walk = (left: number): boolean => {
          if (left === 0) {
            return true;
          }
          const last = path[path.length - 1];
          const dirs = [...HEX_DIRS].sort(() => rng() - 0.5);
          for (const dir of dirs) {
            const next = {q: last.q + dir.q, r: last.r + dir.r};
            const key = hexKey(next);
            if (used.has(key)) {
              continue;
            }
            used.add(key);
            path.push(next);
            if (walk(left - 1)) {
              return true;
            }
            path.pop();
            used.delete(key);
          }
          return false;
        };
        if (walk(letters.length - 1)) {
          placed = path;
          break;
        }
      }
    }

    if (!placed) {
      placed = letters.map((_, index) => ({q: index, r: wordIndex * 2}));
    }

    placed.forEach((coord, index) => {
      occupied.set(hexKey(coord), {
        ...coord,
        id: hexKey(coord),
        letter: letters[index] ?? '',
        groupIndex: wordIndex,
      });
    });
    solutionPaths.push(placed);
  });

  return {grid: Array.from(occupied.values()), solutionPaths};
};

/** Find an unsolved puzzle whose answers match the selected letters. */
export const findMatchingUnsolvedPuzzle = <
  T extends {id: string; answers: string[]},
>(
  selectedLetters: string,
  puzzles: T[],
  solvedIds: Set<string>,
  language: WordPuzzleLanguage,
): T | undefined =>
  puzzles.find(
    puzzle =>
      !solvedIds.has(puzzle.id) && isAnswerMatch(selectedLetters, puzzle.answers, language),
  );

export const coordsFromPath = (path: HexCoord[], grid: HexLetterCell[]) => {
  const map = new Map(grid.map(cell => [hexKey(cell), cell]));
  return path.map(coord => map.get(hexKey(coord))?.letter ?? '').join('');
};

export const findHexAtPoint = (
  x: number,
  y: number,
  grid: HexLetterCell[],
  originX: number,
  originY: number,
  size = HEX_SIZE,
) => {
  const localX = x - originX;
  const localY = y - originY;
  const approx = pixelToHex(localX, localY, size);
  let closest: HexLetterCell | null = null;
  let minDist = Number.POSITIVE_INFINITY;

  grid.forEach(cell => {
    const pos = hexToPixel(cell.q, cell.r, size);
    const dx = pos.x - localX;
    const dy = pos.y - localY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < minDist && dist < size * 0.9) {
      minDist = dist;
      closest = cell;
    }
  });

  if (closest && hexDistance(closest, approx) <= 1) {
    return closest;
  }

  return closest;
};

export const validateSelection = (
  path: HexCoord[],
  answers: string[],
  language: WordPuzzleLanguage,
  grid: HexLetterCell[],
) => isAnswerMatch(lettersFromPath(path, grid), answers, language);

export const isAnswerMatch = (
  selectedLetters: string,
  answers: string[],
  language: WordPuzzleLanguage,
) => {
  const normalizedSelection = normalizeWord(selectedLetters, language);
  return answers.some(answer => normalizeWord(answer, language) === normalizedSelection);
};

export const lettersFromPath = (path: HexCoord[], grid: HexLetterCell[]) => {
  const map = new Map(grid.map(cell => [hexKey(cell), cell.letter]));
  return path.map(coord => map.get(hexKey(coord)) ?? '').join('');
};

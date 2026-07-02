import type {HexCoord, HexLetterCell, WordPuzzleLanguage} from '@Types/wordPuzzleTypes';

export const HEX_SIZE = 34;

const ARABIC_FILL = 'سنمروحكيت';
const ENGLISH_FILL = 'etaoinshrdlu';

export const hexToPixel = (q: number, r: number, size = HEX_SIZE) => {
  const x = size * (3 / 2) * q;
  const y = size * Math.sqrt(3) * (r + q / 2);
  return {x, y};
};

export const pixelToHex = (x: number, y: number, size = HEX_SIZE): HexCoord => {
  const q = ((2 / 3) * x) / size;
  const r = ((-1 / 3) * x + (Math.sqrt(3) / 3) * y) / size;
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

export const buildGridForWord = (
  word: string,
  language: WordPuzzleLanguage,
  seed: number,
): {grid: HexLetterCell[]; solutionPath: HexCoord[]} => {
  const letters = word.replace(/\s+/g, '').split('');
  const solutionPath: HexCoord[] = letters.map((_, index) => ({q: index, r: 0}));
  const gridMap = new Map<string, HexLetterCell>();

  letters.forEach((letter, index) => {
    const coord = solutionPath[index];
    gridMap.set(hexKey(coord), {
      ...coord,
      id: `${coord.q}-${coord.r}`,
      letter,
    });
  });

  const filler = language === 'ar' ? ARABIC_FILL : ENGLISH_FILL;
  const offsets: HexCoord[] = [
    {q: 0, r: -1},
    {q: 1, r: -1},
    {q: -1, r: 0},
    {q: 1, r: 0},
    {q: -1, r: 1},
    {q: 0, r: 1},
  ];

  let fillerIndex = 0;
  for (let ring = 1; ring <= 2; ring += 1) {
    for (let q = -ring; q <= ring; q += 1) {
      for (let r = -ring; r <= ring; r += 1) {
        if (Math.max(Math.abs(q), Math.abs(r), Math.abs(-q - r)) !== ring) {
          continue;
        }
        const coord = {q, r};
        const key = hexKey(coord);
        if (gridMap.has(key)) {
          continue;
        }
        const letter = filler[(fillerIndex + seed) % filler.length];
        fillerIndex += 1;
        gridMap.set(key, {...coord, id: key, letter});
      }
    }
  }

  // Ensure center gem slot neighbor cells exist
  offsets.forEach((offset, index) => {
    const coord = {q: Math.floor(letters.length / 2) + offset.q, r: offset.r};
    const key = hexKey(coord);
    if (!gridMap.has(key)) {
      gridMap.set(key, {
        ...coord,
        id: key,
        letter: filler[(index + seed) % filler.length],
      });
    }
  });

  return {grid: Array.from(gridMap.values()), solutionPath};
};

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
) => {
  const localX = x - originX;
  const localY = y - originY;
  const approx = pixelToHex(localX, localY);
  let closest: HexLetterCell | null = null;
  let minDist = Number.POSITIVE_INFINITY;

  grid.forEach(cell => {
    const pos = hexToPixel(cell.q, cell.r);
    const dx = pos.x - localX;
    const dy = pos.y - localY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < minDist && dist < HEX_SIZE * 0.9) {
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

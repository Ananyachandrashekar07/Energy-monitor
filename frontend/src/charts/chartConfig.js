import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, RadialLinearScale,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, RadialLinearScale,
  Title, Tooltip, Legend, Filler,
);

// ── Shared colour palette ─────────────────────────────────────────────────────
export const COLORS = {
  cyan:    '#06b6d4',
  cyanDim: 'rgba(6,182,212,0.12)',
  emerald: '#10b981',
  emeraldDim: 'rgba(16,185,129,0.12)',
  amber:   '#f59e0b',
  amberDim:'rgba(245,158,11,0.12)',
  rose:    '#f43f5e',
  roseDim: 'rgba(244,63,94,0.12)',
  violet:  '#8b5cf6',
  violetDim:'rgba(139,92,246,0.12)',
  slate:   '#475569',
  grid:    'rgba(51,65,85,0.5)',
  text:    '#94a3b8',
};

export const DEVICE_PALETTE = [
  COLORS.cyan, COLORS.emerald, COLORS.amber, COLORS.rose, COLORS.violet,
];

// ── Base tooltip style shared by all charts ───────────────────────────────────
export const tooltipPlugin = {
  backgroundColor: '#0f172a',
  borderColor:     'rgba(51,65,85,0.8)',
  borderWidth:     1,
  titleColor:      '#e2e8f0',
  bodyColor:       '#94a3b8',
  padding:         10,
  cornerRadius:    10,
  titleFont:       { family: '"Syne", sans-serif', size: 12, weight: '600' },
  bodyFont:        { family: '"DM Sans", sans-serif', size: 12 },
  displayColors:   true,
  boxWidth:        8,
  boxHeight:       8,
  boxPadding:      4,
  usePointStyle:   true,
};

// ── Base scales (X + Y) shared across line/bar charts ────────────────────────
export const baseScales = {
  x: {
    grid:  { color: COLORS.grid, drawBorder: false },
    ticks: { color: COLORS.text, font: { family: '"DM Sans"', size: 11 }, maxRotation: 0 },
    border:{ dash: [4, 4], color: 'transparent' },
  },
  y: {
    grid:  { color: COLORS.grid, drawBorder: false },
    ticks: { color: COLORS.text, font: { family: '"DM Sans"', size: 11 }, padding: 8 },
    border:{ dash: [4, 4], color: 'transparent' },
  },
};

// ── Legend ────────────────────────────────────────────────────────────────────
export const baseLegend = {
  labels: {
    color:    COLORS.text,
    font:     { family: '"DM Sans"', size: 12 },
    padding:  16,
    usePointStyle: true,
    pointStyleWidth: 8,
  },
};
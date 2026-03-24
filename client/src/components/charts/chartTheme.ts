/**
 * Token dùng chung cho Recharts (màu trục, lưới, tooltip).
 * Import vào từng biểu đồ: ví dụ stroke={chartColors.grid}
 */
export const chartColors = {
  grid: '#334155',
  axis: '#94a3b8',
  tooltipBg: '#1e293b',
  tooltipBorder: '#475569',
  series: ['#34d399', '#38bdf8', '#a78bfa', '#fbbf24', '#fb7185'] as const,
};

export const chartMargins = { top: 8, right: 16, left: 0, bottom: 8 };

export const defaultCartesianGridProps = {
  strokeDasharray: '4 4' as const,
  stroke: chartColors.grid,
  vertical: false,
};

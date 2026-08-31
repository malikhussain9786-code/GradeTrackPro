import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Circle, Line as SvgLine, Text as SvgText } from 'react-native-svg';
import { useAppTheme } from '../theme';

export interface TrendPoint {
  label: string;
  value: number;
}

interface SimpleLineChartProps {
  points: TrendPoint[];
  maxValue: number;
  height?: number;
}

// GradeTrack Pro — SGPA Trend Chart
// A hand-built SVG line chart (no charting library needed for one
// simple trend line) matching the mockup's gold trend-line style.

export function SimpleLineChart({ points, maxValue, height = 160 }: SimpleLineChartProps) {
  const { theme, type } = useAppTheme();

  if (points.length === 0) {
    return (
      <View style={[styles.emptyWrap, { height }]}>
        <Text style={[type.caption, { color: theme.textMuted }]}>
          Save a semester to see your SGPA trend here.
        </Text>
      </View>
    );
  }

  const chartWidth = 300;
  const paddingX = 24;
  const paddingTop = 16;
  const paddingBottom = 28;
  const plotHeight = height - paddingTop - paddingBottom;
  const plotWidth = chartWidth - paddingX * 2;

  const stepX = points.length > 1 ? plotWidth / (points.length - 1) : 0;

  const coords = points.map((p, i) => {
    const x = paddingX + i * stepX;
    const y = paddingTop + plotHeight * (1 - Math.min(p.value, maxValue) / maxValue);
    return { x, y, value: p.value, label: p.label };
  });

  const polylinePoints = coords.map((c) => `${c.x},${c.y}`).join(' ');

  return (
    <View>
      <Svg width="100%" height={height} viewBox={`0 0 ${chartWidth} ${height}`}>
        {/* Baseline grid line */}
        <SvgLine
          x1={paddingX}
          y1={paddingTop + plotHeight}
          x2={chartWidth - paddingX}
          y2={paddingTop + plotHeight}
          stroke={theme.border}
          strokeWidth={1}
        />

        <Polyline points={polylinePoints} fill="none" stroke={theme.accent} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

        {coords.map((c, i) => (
          <Circle key={i} cx={c.x} cy={c.y} r={4} fill={theme.accent} stroke={theme.surface} strokeWidth={2} />
        ))}

        {coords.map((c, i) => (
          <SvgText
            key={`label-${i}`}
            x={c.x}
            y={height - 8}
            fontSize={9}
            fill={theme.textMuted}
            textAnchor="middle"
          >
            {c.label}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

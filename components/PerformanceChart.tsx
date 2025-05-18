// components/PerformanceChart.tsx
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar
} from 'recharts';
import { PerformanceEntry } from './PerformanceEntryForm';

interface PerformanceChartProps {
  entries: PerformanceEntry[];
}

export default function PerformanceChart({ entries }: PerformanceChartProps) {
  const data = entries.map(e => ({
    date: e.date,
    ctr: e.clicks > 0 ? (e.conversions / e.clicks) * 100 : 0,
    conversions: e.conversions,
  }));

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>📈 성과 차트</h2>

      {/* 날짜별 CTR 라인 차트 */}
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis unit="%" />
        <Tooltip
          formatter={v => {
            const num = Number(v);
            return `${isNaN(num) ? 0 : num.toFixed(1)}%`;
          }}
        />
        <Line type="monotone" dataKey="ctr" stroke="#2563eb" />
      </LineChart>

      {/* 날짜별 전환 수 바 차트 */}
      <BarChart width={600} height={300} data={data} style={{ marginTop: '2rem' }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="conversions" fill="#10b981" />
      </BarChart>
    </div>
  );
}

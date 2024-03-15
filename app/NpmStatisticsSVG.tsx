// SmoothLineChartSVG.js
import React from 'react';


const data = [
  { x: 1, y: 10 },
  { x: 2, y: 20 },
  { x: 3, y: 15 },
  { x: 4, y: 25 },
  { x: 5, y: 30 },
  { x: 6, y: 20 },
  { x: 7, y: 35 },
];
const width= 400
const  height= 300

function SmoothLineChartSVG({  }) {
  const viewBox = `0 0 ${width} ${height}`;
  const margin = 40;
  const maxY = Math.max(...data.map(point => point.y));
  const minY = Math.min(...data.map(point => point.y));
  const maxX = Math.max(...data.map(point => point.x));
  const scaleX = (width - margin * 2) / (maxX - 1);
  const scaleY = (height - margin * 2) / (maxY - minY);

  // 生成平滑曲线路径
  function generateSmoothPath(points) {
    let path = `M ${points[0].x * scaleX + margin} ${height - (points[0].y - minY) * scaleY + margin}`;
    for (let i = 1; i < points.length - 2; i++) {
      const xc = (points[i].x * scaleX + points[i + 1].x * scaleX) / 2;
      const yc = (points[i].y - minY) * scaleY + margin;
      path += ` Q ${points[i].x * scaleX + margin} ${height - (points[i].y - minY) * scaleY + margin} ${xc} ${yc}`;
    }
    path += ` T ${points[points.length - 1].x * scaleX + margin} ${height - (points[points.length - 1].y - minY) * scaleY + margin}`;
    return path;
  }

  return (
    <svg width={width} height={height} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
      {/* 绘制数据点和平滑曲线 */}
      <path d={generateSmoothPath(data)} fill="none" stroke="blue" strokeWidth="2" />
      {data.map((point, index) => (
        <circle
          key={index}
          cx={point.x * scaleX + margin}
          cy={height - (point.y - minY) * scaleY + margin}
          r="4"
          fill="blue"
        />
      ))}
    </svg>
  );
}

export default SmoothLineChartSVG;
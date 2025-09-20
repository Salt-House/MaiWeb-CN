import React from 'react';

interface SvgStrokedTextProps {
  text: string;
  strokeColor?: string;
  strokeWidth?: number;
  fill?: string;
  fontSize?: number;
  letterSpacing?: string | number;
  width?: string | number;
  height?: string | number;
}

/**
 * SVG 描边文本组件
 * 用于显示带有描边效果的文本，支持自定义颜色、描边宽度等属性
 */
const SvgStrokedText: React.FC<SvgStrokedTextProps> = ({
  text,
  strokeColor = '#000',
  strokeWidth = 2,
  fill = '#fff',
  fontSize = 32,
  letterSpacing = 'normal',
  width = '100%',
  height = 'auto',
}) => {
  // 计算合适的 viewBox 尺寸，基于字体大小和描边宽度
  const padding = strokeWidth * 2;
  const textLength = text.length;
  const estimatedWidth = fontSize * textLength * 0.6 + padding * 2;
  const estimatedHeight = fontSize + padding * 2;
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${estimatedWidth} ${estimatedHeight}`} 
      preserveAspectRatio="xMidYMid meet"
    >
      <text
        x={estimatedWidth / 2}
        y={estimatedHeight / 2}
        dominantBaseline="middle"
        textAnchor="middle"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill={fill}
        fontSize={fontSize}
        fontWeight="bold"
        letterSpacing={letterSpacing}
        style={{ paintOrder: 'stroke' }}
      >
        {text}
      </text>
    </svg>
  );
};

export default SvgStrokedText;

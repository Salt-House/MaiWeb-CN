import React from "react"

interface SvgStrokedTextProps {
  text: string
  strokeColor?: string
  strokeWidth?: number
  fill?: string
  fontSize?: number
  letterSpacing?: string | number
  width?: string | number
  height?: string | number
}

const SvgStrokedText: React.FC<SvgStrokedTextProps> = ({
  text,
  strokeColor = "#000",
  strokeWidth = 2,
  fill = "#fff",
  fontSize = 32,
  letterSpacing = "normal",
  width = "100%",
  height = "auto",
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill={fill}
        fontSize={fontSize}
        fontWeight="bold"
        letterSpacing={letterSpacing}
        style={{ paintOrder: "stroke" }}
      >
        {text}
      </text>
    </svg>
  )
}

export default SvgStrokedText

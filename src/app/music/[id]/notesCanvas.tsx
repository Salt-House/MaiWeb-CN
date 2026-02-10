"use client"; // 必须声明为客户端组件

import { useRef, useEffect } from "react";

export default function NotesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 1. 获取 Canvas 元素
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 2. 获取绘图上下文
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 3. 执行绘图操作
    ctx.fillStyle = "blue";
    ctx.fillRect(10, 10, 150, 100);

    ctx.font = "20px Arial";
    ctx.fillText("Hello Next.js!", 10, 140);
  }, []); // 仅在组件挂载时运行一次

  return (
    <canvas 
      ref={canvasRef} 
      width={400} 
      height={300} 
      className="border border-gray-300"
    />
  );
}
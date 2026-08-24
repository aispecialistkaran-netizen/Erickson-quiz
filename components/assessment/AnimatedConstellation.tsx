'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  label: string;
  x: number; // percentage
  y: number; // percentage
  stage: number; // 1: Q1-3, 2: Q4-6, 3: Q7-9, 4: Q10-12
}

const NODES: Node[] = [
  { id: 'purpose', label: 'Purpose', x: 20, y: 30, stage: 1 },
  { id: 'curiosity', label: 'Curiosity', x: 78, y: 25, stage: 1 },
  { id: 'listening', label: 'Listening', x: 30, y: 70, stage: 2 },
  { id: 'growth', label: 'Growth', x: 72, y: 68, stage: 2 },
  { id: 'impact', label: 'Impact', x: 50, y: 20, stage: 3 },
  { id: 'coaching', label: 'Coaching', x: 18, y: 55, stage: 3 },
  { id: 'career', label: 'Career', x: 82, y: 48, stage: 4 },
];

const CONNECTIONS = [
  ['purpose', 'impact'],
  ['impact', 'curiosity'],
  ['purpose', 'coaching'],
  ['coaching', 'listening'],
  ['listening', 'growth'],
  ['growth', 'career'],
  ['curiosity', 'career'],
  ['coaching', 'growth'],
  ['purpose', 'growth'],
];

interface ConstellationProps {
  progressStage?: number; // 1 to 4
  interactive?: boolean;
}

export const AnimatedConstellation: React.FC<ConstellationProps> = ({
  progressStage = 4,
  interactive = true,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20; // -10 to +10px
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep Background Gradients */}
      <div className="absolute inset-0 bg-[#071E2A]" />

      {/* Radial Ambient Glows */}
      <motion.div
        className="ambient-glow glow-blue w-[600px] h-[600px] top-[-100px] left-[-100px] opacity-40"
        animate={{
          x: mousePos.x * -1.5,
          y: mousePos.y * -1.5,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 30 }}
      />
      <motion.div
        className="ambient-glow glow-gold w-[500px] h-[500px] bottom-[-100px] right-[-100px] opacity-25"
        animate={{
          x: mousePos.x * 2,
          y: mousePos.y * 2,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 30 }}
      />

      {/* SVG Constellation Network */}
      <motion.svg
        className="w-full h-full opacity-60"
        animate={{
          x: mousePos.x * 0.5,
          y: mousePos.y * 0.5,
        }}
        transition={{ type: 'spring', stiffness: 60, damping: 25 }}
      >
        {/* Draw Connection Lines */}
        {CONNECTIONS.map(([startId, endId], idx) => {
          const startNode = NODES.find((n) => n.id === startId);
          const endNode = NODES.find((n) => n.id === endId);
          if (!startNode || !endNode) return null;

          const isConnectedActive =
            startNode.stage <= progressStage || endNode.stage <= progressStage;

          return (
            <line
              key={`edge-${idx}`}
              x1={`${startNode.x}%`}
              y1={`${startNode.y}%`}
              x2={`${endNode.x}%`}
              y2={`${endNode.y}%`}
              stroke={isConnectedActive ? '#167FA3' : '#0C3347'}
              strokeWidth={isConnectedActive ? 1.5 : 1}
              strokeOpacity={isConnectedActive ? 0.45 : 0.2}
              strokeDasharray={isConnectedActive ? 'none' : '4 4'}
            />
          );
        })}

        {/* Render Constellation Nodes */}
        {NODES.map((node) => {
          const isActive = node.stage <= progressStage;

          return (
            <g key={node.id} transform={`translate(0, 0)`}>
              {/* Outer Glow Circle */}
              {isActive && (
                <circle
                  cx={`${node.x}%`}
                  cy={`${node.y}%`}
                  r="12"
                  fill="#F4B740"
                  fillOpacity="0.12"
                  className="animate-pulse"
                />
              )}
              {/* Node Dot */}
              <circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r={isActive ? 4 : 2.5}
                fill={isActive ? '#F4B740' : '#167FA3'}
                fillOpacity={isActive ? 0.9 : 0.4}
              />
              {/* Label */}
              <text
                x={`${node.x}%`}
                y={`${node.y + 3}%`}
                textAnchor="middle"
                fill={isActive ? '#FFD978' : '#64757D'}
                fontSize="11"
                fontWeight="500"
                letterSpacing="0.05em"
                fillOpacity={isActive ? 0.8 : 0.35}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </motion.svg>
    </div>
  );
};

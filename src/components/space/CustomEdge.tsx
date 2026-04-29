"use client";

import { memo } from "react";
import { EdgeProps, getBezierPath, BaseEdge, EdgeLabelRenderer } from "@xyflow/react";

type CustomEdgeData = {
  isContradiction?: boolean;
  label?: string;
};

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps) {
  const edgeData = data as CustomEdgeData | undefined;
  const isContradiction = edgeData?.isContradiction;
  const label = edgeData?.label;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const color = isContradiction ? "#ff3366" : "#7a00ff";
  const glowColor = isContradiction ? "rgba(255,51,102,0.6)" : "rgba(122,0,255,0.6)";

  return (
    <>
      {/* Glowing background stroke */}
      <BaseEdge
        path={edgePath}
        style={{
          stroke: color,
          strokeWidth: 6,
          strokeOpacity: 0.15,
          strokeDasharray: "none",
          filter: `blur(3px)`,
        }}
        markerEnd={undefined}
      />

      {/* Main animated stroke */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: color,
          strokeWidth: 2,
          strokeDasharray: "8 4",
          animation: "dash-draw 0.8s linear infinite",
          filter: `drop-shadow(0 0 4px ${glowColor})`,
        }}
      />

      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
          >
            <div
              className="rounded-md px-2 py-0.5 text-xs font-semibold"
              style={{
                background: "rgba(0,0,0,0.7)",
                border: `1px solid ${color}44`,
                color: color,
                backdropFilter: "blur(8px)",
              }}
            >
              {label}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export default memo(CustomEdge);

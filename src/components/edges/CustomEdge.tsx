import React from 'react';
import { EdgeProps, getStraightPath } from '@xyflow/react';

const CustomEdge: React.FC<EdgeProps> = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  style = {},
  ...props
}) => {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const color = (data?.color || style?.stroke || '#4CAF50') as string;
  console.log('CustomEdge rendering with color:', color);

  // IMPORTANT: Return direct SVG instead of using BaseEdge
  return (
    <path
      id={id}
      d={edgePath}
      stroke={color}
      strokeWidth={2}
      fill="none"
      className="custom-edge-path"
      style={{
        stroke: color as string,
        strokeWidth: 2,
      }}
    />
  );
};

export default CustomEdge; 
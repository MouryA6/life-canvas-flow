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
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
  ...props
}) => {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  // Extract color from multiple possible sources
  const color = data?.color || style?.stroke || '#00FFFF';
  
  console.log('CustomEdge rendering with color:', color, 'Data:', data, 'Style:', style);

  // Render the edge with very explicit styling
  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={{
          stroke: `${color} !important`,
          strokeWidth: style?.strokeWidth || 2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }}
        markerEnd={markerEnd}
      />
    </>
  );
};

export default CustomEdge; 
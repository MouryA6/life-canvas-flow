import React from 'react';
import { EdgeProps, BaseEdge, getStraightPath, MarkerType } from '@xyflow/react';

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
  markerEnd,
  ...props
}) => {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        cursor: 'pointer',
      }}
      labelX={labelX}
      labelY={labelY}
      {...props}
    />
  );
};

export default CustomEdge; 
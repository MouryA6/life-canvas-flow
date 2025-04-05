import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface NodeHandlesProps {
  color: string;
  isConnectable: boolean;
  shape: 'rectangle' | 'circle' | 'cloud';
}

const NodeHandles: React.FC<NodeHandlesProps> = ({ color, isConnectable, shape }) => {
  const handleStyle = {
    width: '10px',
    height: '10px',
    background: '#fff',
    border: `2px solid ${color}`,
    borderRadius: '50%',
    zIndex: 500,
  };

  const positions = [
    { id: 'top', position: Position.Top },
    { id: 'right', position: Position.Right },
    { id: 'bottom', position: Position.Bottom },
    { id: 'left', position: Position.Left }
  ];

  return (
    <div className="node-handles">
      {positions.map((handle) => (
        <Handle
          key={`source-${handle.id}`}
          type="source"
          position={handle.position}
          id={handle.id}
          style={handleStyle}
          isConnectable={isConnectable}
        />
      ))}
      {positions.map((handle) => (
        <Handle
          key={`target-${handle.id}`}
          type="target"
          position={handle.position}
          id={handle.id}
          style={handleStyle}
          isConnectable={isConnectable}
        />
      ))}
    </div>
  );
};

export default NodeHandles; 
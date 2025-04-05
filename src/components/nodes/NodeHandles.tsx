import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface NodeHandlesProps {
  color: string;
  isConnectable: boolean;
  shape: 'rectangle' | 'circle' | 'cloud';
}

const NodeHandles: React.FC<NodeHandlesProps> = ({ color, isConnectable }) => {
  const handleStyle = {
    width: '8px',
    height: '8px',
    background: '#fff',
    border: `2px solid ${color}`,
    borderRadius: '50%',
    opacity: 1,
  };

  return (
    <div className="node-handles">
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={handleStyle}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={handleStyle}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        style={handleStyle}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        style={handleStyle}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default NodeHandles; 

import { NodeProps, Handle, Position } from '@xyflow/react';
import React, { useState } from 'react';

// Define interface for the node data
interface CloudNodeData {
  label: string;
  color?: string;
  onTextChange?: (text: string) => void;
}

// Use the generic NodeProps from ReactFlow and pass our custom data type
const CloudNode = ({ data, isConnectable, selected }: NodeProps<CloudNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data?.label || 'New Node');

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (data?.onTextChange) {
      data.onTextChange(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (data?.onTextChange) {
        data.onTextChange(text);
      }
    }
  };

  // SVG path for cloud shape
  const cloudPath = "M 25,60 C 25,45 15,30 28,30 C 30,5 70,5 80,20 C 85,10 105,10 108,30 C 115,30 125,45 110,60 C 110,60 25,60 25,60 z";

  return (
    <div 
      className="lifenode relative min-w-[140px] min-h-[80px]"
      onDoubleClick={handleDoubleClick}
      style={{ backgroundColor: 'transparent' }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: data?.color || '#00FF00' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: data?.color || '#00FF00' }}
        isConnectable={isConnectable}
      />
      
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 130 70" 
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <path 
          d={cloudPath} 
          fill="transparent" 
          stroke={data?.color || '#00FF00'} 
          strokeWidth={selected ? 3 : 2} 
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center p-2 z-10">
        {isEditing ? (
          <input
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="bg-transparent font-handwritten text-white text-xl outline-none text-center w-full"
          />
        ) : (
          <div className="font-handwritten text-white text-xl">{text}</div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: data?.color || '#00FF00' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: data?.color || '#00FF00' }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default CloudNode;

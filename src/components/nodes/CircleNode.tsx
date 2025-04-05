
import { NodeProps, Handle, Position } from '@xyflow/react';
import React, { useState } from 'react';

// Define correct interface for the node data
interface CircleNodeData {
  label: string;
  color?: string;
  onTextChange?: (text: string) => void;
}

// Use correct generic type syntax for NodeProps
const CircleNode = ({ data, isConnectable, selected }: NodeProps<CircleNodeData>) => {
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

  const borderStyle = selected 
    ? 'border-[3px]' 
    : 'border-[2px]';

  return (
    <div 
      className={`lifenode rounded-full min-w-[100px] min-h-[100px] ${borderStyle}`}
      style={{ 
        borderColor: data?.color || '#00FF00',
        backgroundColor: 'transparent',
        width: '100%',
        height: '100%',
      }}
      onDoubleClick={handleDoubleClick}
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

export default CircleNode;

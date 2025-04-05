
import { NodeProps, Handle, Position } from '@xyflow/react';
import React, { useState } from 'react';

interface RectangleNodeData {
  label: string;
  color?: string;
  onTextChange?: (text: string) => void;
}

const RectangleNode = ({ data, isConnectable, selected }: NodeProps<RectangleNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.label || 'New Node');

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (data.onTextChange) {
      data.onTextChange(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (data.onTextChange) {
        data.onTextChange(text);
      }
    }
  };

  const borderStyle = selected 
    ? 'border-[3px]' 
    : 'border-[2px]';

  return (
    <div 
      className={`lifenode min-w-[100px] min-h-[60px] ${borderStyle}`}
      style={{ 
        borderColor: data.color || '#00FF00',
        backgroundColor: 'transparent'
      }}
      onDoubleClick={handleDoubleClick}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: data.color || '#00FF00' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: data.color || '#00FF00' }}
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
        style={{ background: data.color || '#00FF00' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: data.color || '#00FF00' }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default RectangleNode;

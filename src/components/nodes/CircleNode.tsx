import React, { useState, useCallback } from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';
import NodeHandles from './NodeHandles';

// Define interface for the node data
interface CircleNodeData {
  label: string;
  color?: string;
  onTextChange?: (text: string) => void;
}

// Use the generic NodeProps from ReactFlow and pass our custom data type
const CircleNode: React.FC<NodeProps> = ({ data, selected, isConnectable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.label);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (data.onTextChange) {
      data.onTextChange(text);
    }
  }, [text, data]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (data.onTextChange) {
        data.onTextChange(text);
      }
    }
  }, [text, data]);

  const borderStyle = selected 
    ? 'border-[3px]' 
    : 'border-[2px]';

  const getPlaceholderText = () => {
    const color = data?.color || '#00FF00';
    switch (color) {
      case '#00FF00': return 'Personal Growth...';
      case '#00FFFF': return 'Career Goal...';
      case '#FF00FF': return 'Relationship...';
      case '#FFFF00': return 'Health Goal...';
      case '#FF0000': return 'Challenge...';
      default: return 'Enter text...';
    }
  };

  return (
    <div className="relative">
      <NodeResizer 
        color={data.color}
        isVisible={selected}
        minWidth={100}
        minHeight={100}
        maxWidth={300}
        maxHeight={300}
        handleStyle={{ width: 8, height: 8 }}
        lineStyle={{ stroke: data.color, strokeWidth: 1 }}
        handleClassName="noderesize-handle"
        lineClassName="noderesize-line"
        shouldResize={(e) => !isEditing}
        keepAspectRatio
      />
      <div
        style={{
          border: `2px solid ${data.color}`,
          borderRadius: '50%',
          padding: '10px',
          minWidth: '100px',
          minHeight: '100px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          aspectRatio: '1',
        }}
        className="node-container"
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="node-input"
            autoFocus
            style={{
              background: 'transparent',
              border: 'none',
              color: data.color,
              width: '80%',
              outline: 'none',
              fontSize: '16px',
              fontFamily: 'cursive',
              textAlign: 'center',
            }}
          />
        ) : (
          <div
            style={{
              color: data.color,
              fontSize: '16px',
              fontFamily: 'cursive',
              textAlign: 'center',
              wordBreak: 'break-word',
              width: '80%',
            }}
          >
            {text === 'New Node' ? (
              <>
                <span className="opacity-50">{getPlaceholderText()}</span>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm text-white/50">Double click to edit</span>
                </div>
              </>
            ) : (
              text
            )}
          </div>
        )}
      </div>
      <NodeHandles color={data.color} isConnectable={isConnectable} shape="circle" />
    </div>
  );
};

export default CircleNode;

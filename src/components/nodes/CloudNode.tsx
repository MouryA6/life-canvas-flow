import React, { useState, useCallback } from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';
import NodeHandles from './NodeHandles';

// Define interface for the node data
interface CloudNodeData {
  label: string;
  color?: string;
  onTextChange?: (text: string) => void;
}

// Use the generic NodeProps from ReactFlow and pass our custom data type
const CloudNode: React.FC<NodeProps> = ({ data, selected, isConnectable }) => {
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

  // SVG path for cloud shape
  const getCloudPath = (width: number, height: number) => {
    const w = width;
    const h = height;
    return `
      M ${w * 0.2},${h * 0.5}
      C ${w * 0.1},${h * 0.5} ${w * 0.05},${h * 0.3} ${w * 0.2},${h * 0.3}
      C ${w * 0.2},${h * 0.15} ${w * 0.35},${h * 0.1} ${w * 0.45},${h * 0.2}
      C ${w * 0.5},${h * 0.1} ${w * 0.65},${h * 0.1} ${w * 0.7},${h * 0.2}
      C ${w * 0.85},${h * 0.1} ${w * 0.95},${h * 0.3} ${w * 0.8},${h * 0.4}
      C ${w * 0.95},${h * 0.45} ${w * 0.95},${h * 0.7} ${w * 0.8},${h * 0.7}
      C ${w * 0.8},${h * 0.8} ${w * 0.65},${h * 0.9} ${w * 0.5},${h * 0.8}
      C ${w * 0.45},${h * 0.9} ${w * 0.3},${h * 0.9} ${w * 0.25},${h * 0.8}
      C ${w * 0.1},${h * 0.8} ${w * 0.1},${h * 0.6} ${w * 0.2},${h * 0.5}
      Z
    `;
  };

  const getPlaceholderText = () => {
    const color = data?.color || '#00FF00';
    switch (color) {
      case '#00FF00': return 'Future Vision...';
      case '#00FFFF': return 'Career Dream...';
      case '#FF00FF': return 'Relationship Goal...';
      case '#FFFF00': return 'Lifestyle Dream...';
      case '#FF0000': return 'Challenge...';
      default: return 'Enter text...';
    }
  };

  return (
    <div className="relative">
      <NodeResizer 
        color={data.color}
        isVisible={selected}
        minWidth={150}
        minHeight={80}
        maxWidth={400}
        maxHeight={200}
        handleStyle={{ width: 8, height: 8 }}
        lineStyle={{ stroke: data.color, strokeWidth: 1 }}
        handleClassName="noderesize-handle"
        lineClassName="noderesize-line"
        shouldResize={(e) => !isEditing}
      />
      <div
        style={{
          position: 'relative',
          minWidth: '150px',
          minHeight: '80px',
          width: '100%',
          height: '100%',
        }}
        className="node-container"
        onDoubleClick={handleDoubleClick}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <path
            d={getCloudPath(100, 100)}
            fill="rgba(0, 0, 0, 0.5)"
            stroke={data.color}
            strokeWidth={selected ? "3" : "2"}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            textAlign: 'center',
            zIndex: 1,
          }}
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
                width: '100%',
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
                wordBreak: 'break-word',
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
      </div>
      <NodeHandles color={data.color} isConnectable={isConnectable} shape="cloud" />
    </div>
  );
};

export default CloudNode;

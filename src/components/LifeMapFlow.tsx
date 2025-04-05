
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  useReactFlow,
  Panel,
  NodeTypes,
  BackgroundVariant,
  Node,
  SelectionMode,
  GetMiniMapNodeAttribute,
} from '@xyflow/react';
import { toast } from 'sonner';

import RectangleNode from './nodes/RectangleNode';
import CircleNode from './nodes/CircleNode';
import CloudNode from './nodes/CloudNode';
import Toolbar from './Toolbar';

// Properly define the node types
const nodeTypes: NodeTypes = {
  rectangle: RectangleNode,
  circle: CircleNode,
  cloud: CloudNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'circle',
    data: { label: 'Me', color: '#00FF00' },
    position: { x: 400, y: 200 },
    style: { width: 100, height: 100 },
  },
];

const LifeMapFlow = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedColor, setSelectedColor] = useState('#00FF00');
  const [nextNodeId, setNextNodeId] = useState(2);
  const { zoomIn, zoomOut, setViewport, getViewport, toObject } = useReactFlow();

  // Load saved data from localStorage
  useEffect(() => {
    const savedFlow = localStorage.getItem('lifemap-flow');
    if (savedFlow) {
      try {
        const flow = JSON.parse(savedFlow);
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        // Find highest node ID to continue from there
        if (flow.nodes && flow.nodes.length > 0) {
          const ids = flow.nodes.map((node: any) => parseInt(node.id)).filter((id: any) => !isNaN(id));
          if (ids.length > 0) {
            setNextNodeId(Math.max(...ids) + 1);
          }
        }
      } catch (error) {
        console.error('Failed to load flow data:', error);
      }
    }
  }, [setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ 
        ...params, 
        animated: false,
        style: { stroke: selectedColor },
      }, eds));
    },
    [setEdges, selectedColor]
  );

  const onNodeDoubleClick = useCallback(
    (event: React.MouseEvent, node: any) => {
      // We handle editing in the node components
    },
    []
  );

  const addNode = useCallback(
    (type: string) => {
      if (!reactFlowWrapper.current) return;

      const viewport = getViewport();
      const centerX = (reactFlowWrapper.current.clientWidth / 2) / viewport.zoom - viewport.x / viewport.zoom;
      const centerY = (reactFlowWrapper.current.clientHeight / 2) / viewport.zoom - viewport.y / viewport.zoom;

      const newNodeId = nextNodeId.toString();
      setNextNodeId(nextNodeId + 1);

      const style = type === 'circle' 
        ? { width: 100, height: 100 } 
        : { width: 150, height: type === 'cloud' ? 80 : 60 };

      const newNode = {
        id: newNodeId,
        type,
        position: { x: centerX, y: centerY },
        data: {
          label: 'New Node',
          color: selectedColor,
          onTextChange: (text: string) => {
            setNodes(nodes => 
              nodes.map(node => 
                node.id === newNodeId 
                  ? { ...node, data: { ...node.data, label: text } } 
                  : node
              )
            );
          }
        },
        style,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nextNodeId, setNodes, selectedColor, getViewport]
  );

  const handleDeleteSelected = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => !node.selected));
    setEdges((edges) => edges.filter((edge) => !edge.selected));
  }, [setNodes, setEdges]);

  const handleSave = useCallback(() => {
    const flow = toObject();
    localStorage.setItem('lifemap-flow', JSON.stringify(flow));
    toast.success('Map saved successfully!');
  }, [toObject]);

  const handleExport = useCallback(() => {
    // This is a placeholder. In a real app, you would implement actual export functionality
    toast.info('Export functionality would save an image of your mind map');
  }, []);

  // Define getMiniMapNodeColor as a function that returns a string
  const getMiniMapNodeColor: GetMiniMapNodeAttribute<Node> = (node) => {
    return node.data?.color || '#00FF00';
  };

  // Define getMiniMapNodeStrokeColor as a function that returns a string
  const getMiniMapNodeStrokeColor: GetMiniMapNodeAttribute<Node> = (node) => {
    return node.data?.color || '#00FF00';
  };

  return (
    <div className="canvas-wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeDoubleClick={onNodeDoubleClick}
        className="life-map-flow"
        panOnScroll={selectedTool === 'pan'}
        panOnDrag={selectedTool === 'pan'}
        selectionOnDrag={selectedTool === 'select'}
        selectionMode={selectedTool === 'select' ? SelectionMode.Full : SelectionMode.Partial}
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={24} 
          color="rgba(255, 255, 255, 0.1)"
        />
        <Controls showInteractive={false} />
        <MiniMap 
          nodeColor={getMiniMapNodeColor}
          maskColor="rgba(0, 0, 0, 0.6)"
          nodeStrokeColor={getMiniMapNodeStrokeColor}
          nodeStrokeWidth={2}
        />
        <Toolbar 
          addNode={addNode}
          onDelete={handleDeleteSelected}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onSave={handleSave}
          onExport={handleExport}
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
      </ReactFlow>
    </div>
  );
};

export default LifeMapFlow;

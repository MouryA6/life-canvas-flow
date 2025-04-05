import React, { useCallback, useRef, useState, useEffect } from 'react';
import { 
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  NodeChange,
  EdgeChange,
  Connection,
  MarkerType,
  ConnectionMode,
  NodeTypes,
  EdgeTypes,
  addEdge,
  useReactFlow,
  Panel,
  BackgroundVariant,
  SelectionMode,
  GetMiniMapNodeAttribute,
  Position,
  BaseEdge,
  getStraightPath,
  getBezierPath,
  ConnectionLineType,
} from '@xyflow/react';
import { toast } from 'sonner';
import CustomEdge from './edges/CustomEdge';

import RectangleNode from './nodes/RectangleNode';
import CircleNode from './nodes/CircleNode';
import CloudNode from './nodes/CloudNode';
import Toolbar from './Toolbar';
import Legend from './Legend';
import AuthModal from './auth/AuthModal';
import SaveProjectDialog from './projects/SaveProjectDialog';
import { Project } from '@/services/projectService';
import { useAuth } from '@/context/AuthContext';
import { getConnectionPoints } from '@/utils/connectionUtils';

// Properly define the node types
const nodeTypes: NodeTypes = {
  rectangle: RectangleNode,
  circle: CircleNode,
  cloud: CloudNode,
};

const edgeTypes: EdgeTypes = {
  default: CustomEdge,
};

export interface CustomNode extends Node {
  type: string;
  data: {
    label: string;
    color: string;
  };
  position: {
    x: number;
    y: number;
  };
  style: {
    width: number;
    height: number;
  };
}

export interface CustomEdge extends Edge {
  id: string;
  source: string;
  target: string;
  type: string;
  animated: boolean;
  style: {
    stroke: string;
    strokeWidth: number;
  };
  markerEnd: {
    type: MarkerType;
    color: string;
  };
}

const initialNodes: CustomNode[] = [
  {
    id: '1',
    type: 'circle',
    data: { label: 'Me', color: '#4CAF50' },
    position: { x: 400, y: 200 },
    style: { width: 100, height: 100 },
  },
];

interface FlowState {
  nodes: CustomNode[];
  edges: CustomEdge[];
}

const LifeMapFlowInner = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>(initialNodes);
  const [edges, setEdges, _onEdgesChange] = useEdgesState<CustomEdge>([]);
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedColor, setSelectedColor] = useState('#4CAF50');
  const [nextNodeId, setNextNodeId] = useState(2);
  const { zoomIn, zoomOut, setViewport, getViewport } = useReactFlow();
  
  // Auth and project states
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState('');
  const [currentProject, setCurrentProject] = useState<{id?: string, name?: string}>({});
  const [shareIntent, setShareIntent] = useState(false);
  // Enhanced onEdgesChange with error handling
  const onEdgesChange = useCallback((changes: EdgeChange<CustomEdge>[]) => {
    try {
      console.log('Edge changes:', changes);
      _onEdgesChange(changes);
    } catch (error) {
      console.error('Error updating edges:', error);
    }
  }, [_onEdgesChange]);

  // Save flow to localStorage
  const saveToLocalStorage = useCallback((flow: FlowState) => {
    try {
      localStorage.setItem('lifemap-flow', JSON.stringify(flow));
    } catch (error) {
      console.error('Failed to save flow:', error);
    }
  }, []);

  // Load saved data from localStorage
  useEffect(() => {
    const savedFlow = localStorage.getItem('lifemap-flow');
    if (savedFlow) {
      try {
        const flow: FlowState = JSON.parse(savedFlow);
        const typedNodes = flow.nodes?.map(node => ({
          ...node,
          type: node.type || 'rectangle',
        })) as CustomNode[] || initialNodes;
        
        const typedEdges = flow.edges?.map(edge => ({
          ...edge,
          type: edge.type || 'default',
          animated: edge.animated || false,
          style: {
            stroke: edge.style?.stroke || selectedColor,
            strokeWidth: edge.style?.strokeWidth || 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edge.style?.stroke || selectedColor,
          },
        })) as CustomEdge[] || [];

        setNodes(typedNodes);
        setEdges(typedEdges);

        // Find highest node ID to continue from there
        if (typedNodes.length > 0) {
          const ids = typedNodes
            .map(node => parseInt(node.id))
            .filter(id => !isNaN(id));
          if (ids.length > 0) {
            setNextNodeId(Math.max(...ids) + 1);
          }
        }
      } catch (error: unknown) {
        console.error('Failed to load flow data:', error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }, [setNodes, setEdges, selectedColor]);

  const onConnect = useCallback(
    (params: Connection) => {
      console.log('onConnect called with params:', params);
      
      if (!params.source || !params.target) {
        console.error('Invalid connection params:', params);
        return;
      }

      const newEdge: CustomEdge = {
        id: `e${params.source}-${params.target}-${Date.now()}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle || null,
        targetHandle: params.targetHandle || null,
        type: 'default',
        animated: false,
        style: { 
          stroke: selectedColor,
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: selectedColor,
        },
      };

      console.log('Creating new edge:', newEdge);
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, selectedColor]
  );

  // Add logging for nodes and edges on render
  useEffect(() => {
    console.log('Current nodes:', nodes);
    console.log('Current edges:', edges);
  }, [nodes, edges]);

  const onNodeDoubleClick = useCallback(
    (event: React.MouseEvent, node: CustomNode) => {
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
    // First save to localStorage as a backup
    const flow = { nodes, edges };
    saveToLocalStorage(flow);

    // If user not logged in, show auth modal
    if (!user) {
      setAuthModalMessage('Sign in to save your Life Map to the cloud');
      setAuthModalOpen(true);
    } else {
      // Show save dialog
      setSaveDialogOpen(true);
    }
  }, [nodes, edges, user, saveToLocalStorage]);

  const handleShare = useCallback(() => {
    if (!user) {
      setShareIntent(true);
      setAuthModalMessage('Sign in to share your Life Map with others');
      setAuthModalOpen(true);
    } else {
      toast.info('Sharing functionality coming soon');
    }
  }, [user]);

  const handleExport = useCallback(() => {
    // This is a placeholder. In a real app, you would implement actual export functionality
    toast.info('Export functionality would save an image of your mind map');
  }, []);

  const handleLoadProject = useCallback((project: Project) => {
    try {
      const { nodes, edges } = project.project_data;
      setNodes(nodes as CustomNode[]);
      setEdges(edges as CustomEdge[]);
      setCurrentProject({ 
        id: project.id, 
        name: project.project_name 
      });
      
      // Find highest node ID to continue from there
      if (nodes && nodes.length > 0) {
        const ids = nodes
          .map(node => parseInt(node.id))
          .filter((id): id is number => !isNaN(id));
        if (ids.length > 0) {
          setNextNodeId(Math.max(...ids) + 1);
        }
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      toast.error('Failed to load the selected project');
    }
  }, [setNodes, setEdges]);

  const getNodeColor: GetMiniMapNodeAttribute = useCallback((node: CustomNode) => {
    return node.data.color;
  }, []);

  const getNodeStroke: GetMiniMapNodeAttribute = useCallback((node: CustomNode) => {
    return node.selected ? '#1a192b' : 'none';
  }, []);

  return (
    <div className="canvas-wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeDoubleClick={onNodeDoubleClick}
        className="life-map-flow"
        fitView
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.1}
        maxZoom={4}
        defaultEdgeOptions={{
          type: 'default',
          style: { strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        }}
        connectionMode={ConnectionMode.Loose}
        connectionLineType={ConnectionLineType.Straight}
        connectionLineStyle={{ stroke: selectedColor, strokeWidth: 2 }}
        elevateEdgesOnSelect={true}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        onError={(error) => {
          console.error('ReactFlow error:', error);
          toast.error('An error occurred. Please try again.');
        }}
        snapToGrid={false}
        selectNodesOnDrag={false}
        panOnScroll={true}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
      >
        <Background variant={BackgroundVariant.Dots} />
        <Controls />
        <MiniMap
          nodeColor={getNodeColor}
          nodeStrokeColor={getNodeStroke}
          maskColor="rgb(0, 0, 0, 0.1)"
        />
        <Panel position="top-left">
          <Toolbar
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            onAddNode={addNode}
            onDelete={handleDeleteSelected}
            onSave={handleSave}
            onShare={handleShare}
            onExport={handleExport}
          />
        </Panel>
        <Panel position="top-right">
          <Legend />
        </Panel>
      </ReactFlow>
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        message={authModalMessage}
        shareIntent={shareIntent}
        setShareIntent={setShareIntent}
      />
      <SaveProjectDialog
        isOpen={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        currentProjectId={currentProject.id}
        flow={{ nodes, edges }}
        onLoadProject={handleLoadProject}
      />
    </div>
  );
};

// Wrap the component with ReactFlowProvider
const LifeMapFlow = () => {
  return (
    <ReactFlowProvider>
      <LifeMapFlowInner />
    </ReactFlowProvider>
  );
};

export default LifeMapFlow;

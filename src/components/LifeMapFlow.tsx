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
  ConnectionMode,
  MarkerType,
  Position,
  EdgeTypes,
  BaseEdge,
  getStraightPath,
  getBezierPath,
  ReactFlowProvider,
} from '@xyflow/react';
import { toast } from 'sonner';

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
  default: BaseEdge,
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

const LifeMapFlowInner = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, _onEdgesChange] = useEdgesState([]);
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedColor, setSelectedColor] = useState('#00FF00');
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
  const onEdgesChange = useCallback((changes: any) => {
    try {
      console.log('Edge changes:', changes);
      _onEdgesChange(changes);
    } catch (error) {
      console.error('Error updating edges:', error);
    }
  }, [_onEdgesChange]);

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
      console.log('onConnect called with params:', params);
      
      if (!params.source || !params.target) {
        console.error('Invalid connection params:', params);
        return;
      }

      const edge = {
        ...params,
        id: `e${params.source}-${params.target}-${Date.now()}`,
        type: 'default',
        animated: false,
        data: { color: selectedColor },
        style: { 
          stroke: selectedColor,
          strokeWidth: 2,
        },
      };

      console.log('Creating new edge:', edge);
      setEdges((eds) => {
        const newEdges = addEdge(edge, eds);
        console.log('Updated edges:', newEdges);
        return newEdges;
      });
    },
    [setEdges, selectedColor]
  );

  // Add logging for nodes and edges on render
  useEffect(() => {
    console.log('Current nodes:', nodes);
    console.log('Current edges:', edges);
  }, [nodes, edges]);

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
    // First save to localStorage as a backup
    const flow = { nodes, edges };
    localStorage.setItem('lifemap-flow', JSON.stringify(flow));

    // If user not logged in, show auth modal
    if (!user) {
      setAuthModalMessage('Sign in to save your Life Map to the cloud');
      setAuthModalOpen(true);
    } else {
      // Show save dialog
      setSaveDialogOpen(true);
    }
  }, [nodes, edges, user]);

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
      setNodes(nodes);
      setEdges(edges);
      setCurrentProject({ 
        id: project.id, 
        name: project.project_name 
      });
      
      // Find highest node ID to continue from there
      if (nodes && nodes.length > 0) {
        const ids = nodes.map((node: any) => parseInt(node.id)).filter((id: any) => !isNaN(id));
        if (ids.length > 0) {
          setNextNodeId(Math.max(...ids) + 1);
        }
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      toast.error('Failed to load the selected project');
    }
  }, [setNodes, setEdges]);

  // Define getMiniMapNodeColor as a function that returns a string
  const getMiniMapNodeColor: GetMiniMapNodeAttribute = (node) => {
    return node.data?.color || '#00FF00';
  };

  // Define getMiniMapNodeStrokeColor as a function that returns a string
  const getMiniMapNodeStrokeColor: GetMiniMapNodeAttribute = (node) => {
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
        }}
        connectionMode={ConnectionMode.Loose}
        onError={(error) => {
          console.error('ReactFlow error:', error);
          toast.error('An error occurred. Please try again.');
        }}
        snapToGrid={false}
        elevateEdgesOnSelect={true}
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
          nodeColor={getMiniMapNodeColor}
          nodeStrokeColor={getMiniMapNodeStrokeColor}
          maskColor="rgb(0, 0, 0, 0.3)"
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
      </ReactFlow>
      <Legend />
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
        currentProject={currentProject}
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

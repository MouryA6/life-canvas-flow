
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Square,
  Circle,
  Cloud,
  Hand,
  Plus,
  Minus,
  MousePointer,
  Trash2,
  Download,
  Save,
} from 'lucide-react';

type ToolbarProps = {
  addNode: (type: string) => void;
  onDelete: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSave: () => void;
  onExport: () => void;
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
};

const Toolbar: React.FC<ToolbarProps> = ({
  addNode,
  onDelete,
  onZoomIn,
  onZoomOut,
  onSave,
  onExport,
  selectedTool,
  setSelectedTool,
  selectedColor,
  setSelectedColor,
}) => {
  const colors = [
    { name: 'green', value: '#00FF00' },
    { name: 'blue', value: '#00FFFF' },
    { name: 'pink', value: '#FF00FF' },
    { name: 'yellow', value: '#FFFF00' },
    { name: 'red', value: '#FF0000' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 p-2 bg-black bg-opacity-75 flex items-center gap-2 z-10">
      <div className="mr-4">
        <span className="font-handwritten text-white text-xl">Life Map</span>
      </div>
      
      <div className="border-r border-white/20 h-8 mx-2" />
      
      <Button
        variant={selectedTool === 'select' ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setSelectedTool('select')}
        title="Select"
      >
        <MousePointer className="h-4 w-4" />
      </Button>
      
      <Button
        variant={selectedTool === 'pan' ? "secondary" : "ghost"}
        size="icon"
        onClick={() => setSelectedTool('pan')}
        title="Pan"
      >
        <Hand className="h-4 w-4" />
      </Button>
      
      <div className="border-r border-white/20 h-8 mx-2" />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => addNode('rectangle')}
        title="Add Rectangle"
      >
        <Square className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => addNode('circle')}
        title="Add Circle"
      >
        <Circle className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => addNode('cloud')}
        title="Add Cloud"
      >
        <Cloud className="h-4 w-4" />
      </Button>
      
      <div className="border-r border-white/20 h-8 mx-2" />
      
      {colors.map((color) => (
        <button
          key={color.name}
          className={`w-6 h-6 rounded-full ${
            selectedColor === color.value ? 'ring-2 ring-white' : ''
          }`}
          style={{ backgroundColor: color.value }}
          onClick={() => setSelectedColor(color.value)}
          title={`Select ${color.name}`}
        />
      ))}
      
      <div className="border-r border-white/20 h-8 mx-2" />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onZoomIn}
        title="Zoom In"
      >
        <Plus className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onZoomOut}
        title="Zoom Out"
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <div className="border-r border-white/20 h-8 mx-2" />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        title="Delete Selected"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      
      <div className="border-r border-white/20 h-8 mx-2" />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onSave}
        title="Save"
      >
        <Save className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onExport}
        title="Export"
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Toolbar;

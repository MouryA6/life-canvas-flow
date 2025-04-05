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
  Share2,
  LogOut,
  User,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ProjectDrawer from './projects/ProjectDrawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type ToolbarProps = {
  selectedTool: string;
  setSelectedTool: (tool: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  onAddNode: (type: string) => void;
  onDelete: () => void;
  onSave: () => void;
  onShare: () => void;
  onExport: () => void;
};

const Toolbar: React.FC<ToolbarProps> = ({
  selectedTool,
  setSelectedTool,
  selectedColor,
  setSelectedColor,
  onAddNode,
  onDelete,
  onSave,
  onShare,
  onExport,
}) => {
  const colors = [
    { name: 'green', value: '#00FF00' },
    { name: 'blue', value: '#00FFFF' },
    { name: 'pink', value: '#FF00FF' },
    { name: 'yellow', value: '#FFFF00' },
    { name: 'red', value: '#FF0000' },
  ];

  const { user, signOut } = useAuth();
  
  const getUserInitials = () => {
    if (!user || !user.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

  // Helper function to determine button styling based on selection
  const getButtonStyle = (tool: string) => {
    if (selectedTool === tool) {
      return "bg-white text-black hover:bg-white/90 hover:text-black";
    }
    return "bg-black text-white hover:bg-black/80";
  };

  return (
    <div className="fixed top-0 left-0 right-0 p-2 bg-black bg-opacity-75 flex items-center gap-2 z-10">
      <div className="mr-4">
        <span className="font-handwritten text-white text-xl">Life Map</span>
      </div>
      
      <div className="border-r border-white/20 h-8 mx-2" />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSelectedTool('select')}
        title="Select"
        className={getButtonStyle('select')}
      >
        <MousePointer className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSelectedTool('pan')}
        title="Pan"
        className={getButtonStyle('pan')}
      >
        <Hand className="h-4 w-4" />
      </Button>
      
      <div className="border-r border-white/20 h-8 mx-2" />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAddNode('rectangle')}
        title="Add Rectangle"
        className="bg-black text-white hover:bg-black/80"
      >
        <Square className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAddNode('circle')}
        title="Add Circle"
        className="bg-black text-white hover:bg-black/80"
      >
        <Circle className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAddNode('cloud')}
        title="Add Cloud"
        className="bg-black text-white hover:bg-black/80"
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
        onClick={onDelete}
        title="Delete Selected"
        className="bg-black text-white hover:bg-black/80"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      
      <div className="border-r border-white/20 h-8 mx-2" />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onSave}
        title="Save"
        className="bg-black text-white hover:bg-black/80"
      >
        <Save className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onShare}
        title="Share"
        className="bg-black text-white hover:bg-black/80"
      >
        <Share2 className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onExport}
        title="Export"
        className="bg-black text-white hover:bg-black/80"
      >
        <Download className="h-4 w-4" />
      </Button>
      
      {/* Spacer to push user menu to the right */}
      <div className="flex-1"></div>
      
      {/* User menu */}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full" size="icon">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.user_metadata.avatar_url} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>
              {user.email}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-white" onClick={onSave}>
          <User className="h-4 w-4" />
          <span>Sign In</span>
        </Button>
      )}
    </div>
  );
};

export default Toolbar;

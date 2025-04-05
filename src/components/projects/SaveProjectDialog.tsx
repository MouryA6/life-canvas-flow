import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProjectService } from '@/services/projectService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Node, Edge } from '@xyflow/react';
import type { CustomNode, CustomEdge } from '../LifeMapFlow';

interface SaveProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentProjectId?: string;
  flow: {
    nodes: CustomNode[];
    edges: CustomEdge[];
  };
  onLoadProject: (project: Project) => void;
}

const SaveProjectDialog: React.FC<SaveProjectDialogProps> = ({
  isOpen,
  onClose,
  currentProjectId,
  flow,
  onLoadProject,
}) => {
  const [projectName, setProjectName] = useState('');
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to save a project');
      onClose();
      return;
    }

    if (!projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    setSaving(true);
    try {
      await ProjectService.saveProject(
        user.id,
        projectName,
        flow.nodes,
        flow.edges,
        currentProjectId
      );
      
      toast.success(`"${projectName}" saved successfully`);
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save your project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Your Map</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My Awesome Life Map"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Map'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveProjectDialog;

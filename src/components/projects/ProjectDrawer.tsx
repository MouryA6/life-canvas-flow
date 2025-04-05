
import React, { useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ProjectService, Project } from '@/services/projectService';
import { useAuth } from '@/context/AuthContext';
import { format, parseISO } from 'date-fns';
import { Folder, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface ProjectDrawerProps {
  onLoadProject: (project: Project) => void;
}

const ProjectDrawer: React.FC<ProjectDrawerProps> = ({ onLoadProject }) => {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadProjects = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await ProjectService.loadProjects(user.id);
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load your projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && user) {
      loadProjects();
    }
  }, [open, user]);

  const handleLoadProject = (project: Project) => {
    onLoadProject(project);
    setOpen(false);
    toast.success(`Loaded "${project.project_name}"`);
  };

  const handleDeleteProject = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await ProjectService.deleteProject(projectId);
        setProjects(projects.filter(p => p.id !== projectId));
        toast.success('Project deleted');
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Folder className="h-4 w-4" />
          <span>Load Saved Maps</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <DrawerHeader>
          <DrawerTitle className="text-center text-xl">Your Saved Maps</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <ScrollArea className="h-[70vh] pr-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No saved maps found</p>
                <p className="text-sm mt-2">Save your current map to see it here</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-card border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleLoadProject(project)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg">{project.project_name}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDeleteProject(e, project.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <div>
                        Created: {format(parseISO(project.created_at), 'PPp')}
                      </div>
                      <div>
                        Updated: {format(parseISO(project.updated_at), 'PPp')}
                      </div>
                      <div className="mt-1">
                        {project.project_data.nodes.length} nodes, {project.project_data.edges.length} connections
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ProjectDrawer;

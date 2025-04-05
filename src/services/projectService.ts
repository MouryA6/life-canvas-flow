
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { Node, Edge } from '@xyflow/react';

export type Project = {
  id: string;
  project_name: string;
  project_data: {
    nodes: Node[];
    edges: Edge[];
  };
  created_at: string;
  updated_at: string;
};

export const ProjectService = {
  async saveProject(
    userId: string,
    projectName: string,
    nodes: Node[],
    edges: Edge[],
    projectId?: string
  ) {
    const now = new Date().toISOString();
    const project = {
      id: projectId || uuidv4(),
      user_id: userId,
      project_name: projectName,
      project_data: {
        nodes,
        edges
      },
      updated_at: now,
      ...(projectId ? {} : { created_at: now })
    };

    const { data, error } = await supabase
      .from('projects')
      .upsert(project)
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async loadProjects(userId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data as Project[];
  },

  async getProject(projectId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) throw error;
    return data as Project;
  },

  async deleteProject(projectId: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
    return true;
  }
};

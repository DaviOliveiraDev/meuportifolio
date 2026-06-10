import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface ProjectData {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  cover_image_url: string | null;
  repository_url: string | null;
  demo_url: string | null;
  is_featured: boolean;
  order_weight: number;
  technologies?: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export function useProjects() {
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading, error } = useQuery<ProjectData[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await apiClient.get('/projects');
      return response.data.projects;
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: Omit<ProjectData, 'id' | 'profile_id'>) => {
      const response = await apiClient.post('/projects', data);
      return response.data.project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProjectData> }) => {
      const response = await apiClient.put(`/projects/${id}`, data);
      return response.data.project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    },
  });

  return {
    projects,
    isLoading,
    error,
    createProject: createProjectMutation.mutateAsync,
    isCreating: createProjectMutation.isPending,
    updateProject: updateProjectMutation.mutateAsync,
    isUpdating: updateProjectMutation.isPending,
    deleteProject: deleteProjectMutation.mutateAsync,
    isDeleting: deleteProjectMutation.isPending,
  };
}

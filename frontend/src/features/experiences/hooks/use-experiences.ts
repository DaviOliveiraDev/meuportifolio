import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface ExperienceData {
  id: string;
  profile_id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  technologies?: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export function useExperiences() {
  const queryClient = useQueryClient();

  const { data: experiences = [], isLoading, error } = useQuery<ExperienceData[]>({
    queryKey: ['experiences'],
    queryFn: async () => {
      const response = await apiClient.get('/experiences');
      return response.data.experiences;
    },
  });

  const createExperienceMutation = useMutation({
    mutationFn: async (data: Omit<ExperienceData, 'id' | 'profile_id'>) => {
      const response = await apiClient.post('/experiences', data);
      return response.data.experience;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    },
  });

  const updateExperienceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ExperienceData> }) => {
      const response = await apiClient.put(`/experiences/${id}`, data);
      return response.data.experience;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    },
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/experiences/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    },
  });

  return {
    experiences,
    isLoading,
    error,
    createExperience: createExperienceMutation.mutateAsync,
    isCreating: createExperienceMutation.isPending,
    updateExperience: updateExperienceMutation.mutateAsync,
    isUpdating: updateExperienceMutation.isPending,
    deleteExperience: deleteExperienceMutation.mutateAsync,
    isDeleting: deleteExperienceMutation.isPending,
  };
}

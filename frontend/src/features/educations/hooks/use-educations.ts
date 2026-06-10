import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface EducationData {
  id: string;
  profile_id: string;
  institution: string;
  course: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  technologies?: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export function useEducations() {
  const queryClient = useQueryClient();

  const { data: educations = [], isLoading, error } = useQuery<EducationData[]>({
    queryKey: ['educations'],
    queryFn: async () => {
      const response = await apiClient.get('/educations');
      return response.data.educations;
    },
  });

  const createEducationMutation = useMutation({
    mutationFn: async (data: Omit<EducationData, 'id' | 'profile_id'>) => {
      const response = await apiClient.post('/educations', data);
      return response.data.education;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educations'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    },
  });

  const updateEducationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EducationData> }) => {
      const response = await apiClient.put(`/educations/${id}`, data);
      return response.data.education;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educations'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    },
  });

  const deleteEducationMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/educations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educations'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    },
  });

  return {
    educations,
    isLoading,
    error,
    createEducation: createEducationMutation.mutateAsync,
    isCreating: createEducationMutation.isPending,
    updateEducation: updateEducationMutation.mutateAsync,
    isUpdating: updateEducationMutation.isPending,
    deleteEducation: deleteEducationMutation.mutateAsync,
    isDeleting: deleteEducationMutation.isPending,
  };
}

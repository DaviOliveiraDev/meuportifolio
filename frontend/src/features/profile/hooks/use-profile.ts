import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface ProfileData {
  id: string;
  name: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  role: string | null;
  location: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  website_url: string | null;
  theme_name: string;
  custom_styles?: any;
  skills?: any[];
}

export function useProfile() {
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery<ProfileData>({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await apiClient.get('/profile');
      return response.data.profile;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<ProfileData>) => {
      const response = await apiClient.put('/profile', data);
      return response.data.profile;
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['profile'], updatedProfile);
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error,
  };
}

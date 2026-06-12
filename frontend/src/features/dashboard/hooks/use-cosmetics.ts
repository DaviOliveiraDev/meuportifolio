import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface TitleItem {
  id: string;
  name: string;
  unlocked: boolean;
  is_equipped: boolean;
  unlock_requirement: string | null;
}

export interface CosmeticItem {
  id: string;
  name: string;
  type: 'border' | 'background' | 'effect';
  value: string;
  unlocked: boolean;
  is_equipped: boolean;
  unlock_requirement: string | null;
}

export interface CosmeticsCatalog {
  titles: TitleItem[];
  cosmetics: CosmeticItem[];
}

export function useCosmetics() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<CosmeticsCatalog>({
    queryKey: ['cosmetics-catalog'],
    queryFn: async () => {
      const response = await apiClient.get('/profile/cosmetics');
      return response.data;
    },
  });

  const equipTitleMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.post(`/profile/titles/${id}/equip`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['cosmetics-catalog'] });
    },
  });

  const unequipTitleMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.post(`/profile/titles/${id}/unequip`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['cosmetics-catalog'] });
    },
  });

  const equipCosmeticMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.post(`/profile/cosmetics/${id}/equip`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['cosmetics-catalog'] });
    },
  });

  const unequipCosmeticMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.post(`/profile/cosmetics/${id}/unequip`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['cosmetics-catalog'] });
    },
  });

  return {
    catalog: data,
    isLoading,
    error,
    equipTitle: equipTitleMutation.mutateAsync,
    isEquippingTitle: equipTitleMutation.isPending,
    unequipTitle: unequipTitleMutation.mutateAsync,
    isUnequippingTitle: unequipTitleMutation.isPending,
    equipCosmetic: equipCosmeticMutation.mutateAsync,
    isEquippingCosmetic: equipCosmeticMutation.isPending,
    unequipCosmetic: unequipCosmeticMutation.mutateAsync,
    isUnequippingCosmetic: unequipCosmeticMutation.isPending,
  };
}

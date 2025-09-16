import { useMutation, useQueryClient } from '@tanstack/react-query';
import { superheroApi } from '../api/superheroApi';
import type {
  CreateSuperheroRequest,
  UpdateSuperheroRequest,
} from '../../../../backend/src/types/types';
import type { SuperheroEntity } from '../../../../backend/src/types/types';

export function useSuperheroMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateSuperheroRequest) => superheroApi.createSuperhero(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superheroes'] });
    },
    onError: error => {
      console.error(`Failed to create superhero: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSuperheroRequest }) =>
      superheroApi.updateSuperhero(id, data),
    onSuccess: (updatedSuperhero: SuperheroEntity) => {
      queryClient.invalidateQueries({ queryKey: ['superheroes'] });
      queryClient.setQueryData(['superhero', updatedSuperhero.id], updatedSuperhero);
    },
    onError: error => {
      console.error(`Failed to update superhero: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => superheroApi.deleteSuperhero(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superheroes'] });
    },
    onError: error => {
      console.error(`Failed to delete superhero: ${error.message}`);
    },
  });

  return {
    createSuperhero: createMutation.mutate,
    updateSuperhero: updateMutation.mutate,
    deleteSuperhero: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

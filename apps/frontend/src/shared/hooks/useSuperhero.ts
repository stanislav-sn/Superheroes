import { useQuery } from '@tanstack/react-query';
import { superheroApi } from '../api/superheroApi';

export function useSuperhero(id: string | undefined) {
  return useQuery({
    queryKey: ['superhero', id],
    queryFn: () => superheroApi.getSuperheroById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
}

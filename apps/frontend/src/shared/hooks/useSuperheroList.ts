import { useQuery } from '@tanstack/react-query';
import { superheroApi } from '../api/superheroApi';
import type { PaginationQuery } from '../../../../backend/src/types/types';

export function useSuperheroList(filters: PaginationQuery) {
  return useQuery({
    queryKey: ['superheroes', filters],
    queryFn: () => superheroApi.getSuperheroList(filters),
    staleTime: 1000 * 60 * 5,
  });
}

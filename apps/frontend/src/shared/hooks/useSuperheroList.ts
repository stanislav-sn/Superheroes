import { useQuery } from '@tanstack/react-query';
import type { PaginationQuery } from '../../types/types';
import { superheroApi } from '../api/superheroApi';

export function useSuperheroList(filters: PaginationQuery) {
  return useQuery({
    queryKey: ['superheroes', filters],
    queryFn: () => superheroApi.getSuperheroList(filters),
    staleTime: 1000 * 60 * 5,
  });
}

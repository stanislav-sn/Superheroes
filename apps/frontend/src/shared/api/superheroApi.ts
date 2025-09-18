import axios from 'axios';
import type {
  CreateUpdateSuperheroDTO,
  PaginatedResponse,
  PaginationQuery,
  SuperheroEntity,
} from '../../types/types';

const API_BASE_URL = import.meta.env.VITE_URL_BACKEND_API || '/api/superheroes';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const superheroApi = {
  async getSuperheroList(filters: PaginationQuery): Promise<PaginatedResponse<SuperheroEntity>> {
    try {
      const params = new URLSearchParams();
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());

      const response = await api.get(`/?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching superheroes:', error);
      throw error;
    }
  },

  async getSuperheroById(id: string): Promise<SuperheroEntity> {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching superhero:', error);
      throw error;
    }
  },

  async createSuperhero(data: CreateUpdateSuperheroDTO): Promise<SuperheroEntity> {
    try {
      const requestPayload: CreateUpdateSuperheroDTO = {
        ...data,
        superpowers: JSON.stringify(data.superpowers),
      };

      const response = await api.post<SuperheroEntity>('/', requestPayload);
      return response.data;
    } catch (error) {
      console.error('Error creating superhero:', error);
      throw error;
    }
  },

  async updateSuperhero(id: string, data: CreateUpdateSuperheroDTO): Promise<SuperheroEntity> {
    try {
      const requestPayload: CreateUpdateSuperheroDTO = {
        nickname: data.nickname,
        realName: data.realName,
        originDescription: data.originDescription,
        catchPhrase: data.catchPhrase,
        superpowers: data.superpowers,
        images: data.images,
      };

      if (data.superpowers && typeof data.superpowers !== 'string') {
        requestPayload.superpowers = JSON.stringify(data.superpowers);
      }

      const response = await api.put<SuperheroEntity>(`/${id}`, requestPayload);
      return response.data;
    } catch (error) {
      console.error('Error updating superhero:', error);
      throw error;
    }
  },

  async deleteSuperhero(id: string): Promise<void> {
    try {
      await api.delete(`/${id}`);
    } catch (error) {
      console.error('Error deleting superhero:', error);
      throw error;
    }
  },
};

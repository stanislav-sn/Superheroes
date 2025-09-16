import axios from 'axios';
import type {
  SuperheroEntity,
  PaginatedResponse,
  PaginationQuery,
  CreateSuperheroRequest,
  UpdateSuperheroRequest,
} from '../../../../../packages/types/types';

interface CreateSuperheroApiRequest extends Omit<CreateSuperheroRequest, 'superpowers'> {
  superpowers: string;
}

interface UpdateSuperheroApiRequest extends Omit<UpdateSuperheroRequest, 'superpowers'> {
  superpowers?: string;
}

const API_BASE_URL = '/api/superheroes';

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

  async createSuperhero(data: CreateSuperheroRequest): Promise<SuperheroEntity> {
    try {
      const requestPayload: CreateSuperheroApiRequest = {
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

  async updateSuperhero(id: string, data: UpdateSuperheroRequest): Promise<SuperheroEntity> {
    try {
      const requestPayload: UpdateSuperheroApiRequest = {};

      (Object.keys(data) as Array<keyof UpdateSuperheroRequest>).forEach(key => {
        if (data[key] !== undefined) {
          if (key === 'superpowers' && data.superpowers) {
            requestPayload.superpowers =
              typeof data.superpowers === 'string'
                ? data.superpowers
                : JSON.stringify(data.superpowers);
          } else {
            // @ts-expect-error - We know the types are compatible
            requestPayload[key] = data[key];
          }
        }
      });

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

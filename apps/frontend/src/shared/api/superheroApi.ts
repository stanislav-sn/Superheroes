import axios from 'axios';
import type {
  SuperheroEntity,
  PaginatedResponse,
  PaginationQuery,
  CreateSuperheroRequest,
  UpdateSuperheroRequest,
} from '../../../../../packages/types/types';

// API base URL
const API_BASE_URL = '/api/superheroes';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for demonstration --------------------------------! ! ! ! ! ---------------------
// const mockSuperheroes: SuperheroEntity[] = [
//   {
//     id: '731',
//     nickname: 'Zoom',
//     realName: 'Hunter Zolomon',
//     originDescription:
//       'Hunter Zolomon was a police detective who became obsessed with understanding criminals. After being paralyzed in an accident caused by Gorilla Grodd, he sought to use the Cosmic Treadmill to prevent the accident, but instead gained super-speed powers and became the villain Zoom.',
//     superpowers: JSON.stringify({
//       intelligence: 50,
//       strength: 10,
//       speed: 100,
//       durability: 28,
//       power: 100,
//       combat: 28,
//     }),
//     catchPhrase: "You can't lock up the darkness!",
//     createdAt: '2025-09-13T19:24:25.732Z',
//     updatedAt: '2025-09-14T16:28:13.789Z',
//     images: [
//       {
//         id: 'f8653823-75ab-447d-8f75-bfff9a141c87',
//         url: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/731-zoom.jpg',
//         heroId: '731',
//         createdAt: '2025-09-14T16:28:13.789Z',
//       },
//     ],
//   },
//   {
//     id: '1',
//     nickname: 'A-Bomb',
//     realName: 'Richard Milhouse Jones',
//     originDescription:
//       "Rick Jones has been Hulk's best bud since day one, but now he's more than a friend...he's a teammate! Transformed by a Gamma energy explosion, A-Bomb's thick, armored skin is just as strong and powerful as it is blue. And when he curls into action, he uses it like a giant bowling ball of destruction!",
//     superpowers: JSON.stringify({
//       intelligence: 38,
//       strength: 100,
//       speed: 17,
//       durability: 80,
//       power: 24,
//       combat: 64,
//     }),
//     catchPhrase: "Hulk's best friend forever!",
//     createdAt: '2025-09-13T19:24:25.732Z',
//     updatedAt: '2025-09-14T16:28:13.789Z',
//     images: [
//       {
//         id: 'img1',
//         url: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/1-a-bomb.jpg',
//         heroId: '1',
//         createdAt: '2025-09-14T16:28:13.789Z',
//       },
//     ],
//   },
//   {
//     id: '2',
//     nickname: 'Abe Sapien',
//     realName: 'Abraham Sapien',
//     originDescription:
//       'Abe Sapien is an amphibious man discovered in a tube in an underwater temple. He works with the Bureau for Paranormal Research and Defense and has psychometric abilities.',
//     superpowers: JSON.stringify({
//       intelligence: 88,
//       strength: 28,
//       speed: 35,
//       durability: 65,
//       power: 100,
//       combat: 85,
//     }),
//     catchPhrase: 'The water remembers everything.',
//     createdAt: '2025-09-13T19:24:25.732Z',
//     updatedAt: '2025-09-14T16:28:13.789Z',
//     images: [
//       {
//         id: 'img2',
//         url: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/2-abe-sapien.jpg',
//         heroId: '2',
//         createdAt: '2025-09-14T16:28:13.789Z',
//       },
//     ],
//   },
//   {
//     id: '3',
//     nickname: 'Abin Sur',
//     realName: 'Abin Sur',
//     originDescription:
//       'Abin Sur was a member of the Green Lantern Corps and the predecessor of Hal Jordan. He was known for his courage and strong will.',
//     superpowers: JSON.stringify({
//       intelligence: 50,
//       strength: 90,
//       speed: 53,
//       durability: 64,
//       power: 99,
//       combat: 65,
//     }),
//     catchPhrase: 'In brightest day, in blackest night!',
//     createdAt: '2025-09-13T19:24:25.732Z',
//     updatedAt: '2025-09-14T16:28:13.789Z',
//     images: [
//       {
//         id: 'img3',
//         url: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/3-abin-sur.jpg',
//         heroId: '3',
//         createdAt: '2025-09-14T16:28:13.789Z',
//       },
//     ],
//   },
//   {
//     id: '4',
//     nickname: 'Abomination',
//     realName: 'Emil Blonsky',
//     originDescription:
//       'Emil Blonsky was a spy and became the Abomination after being exposed to gamma radiation. He has similar powers to the Hulk but retains his intelligence.',
//     superpowers: JSON.stringify({
//       intelligence: 63,
//       strength: 80,
//       speed: 53,
//       durability: 90,
//       power: 62,
//       combat: 95,
//     }),
//     catchPhrase: 'I am the strongest there is!',
//     createdAt: '2025-09-13T19:24:25.732Z',
//     updatedAt: '2025-09-14T16:28:13.789Z',
//     images: [
//       {
//         id: 'img4',
//         url: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/4-abomination.jpg',
//         heroId: '4',
//         createdAt: '2025-09-14T16:28:13.789Z',
//       },
//     ],
//   },
//   {
//     id: '5',
//     nickname: 'Abraxas',
//     realName: 'Abraxas',
//     originDescription:
//       'Abraxas is a cosmic entity and the antithesis of Eternity. He seeks to destroy all realities and is one of the most powerful beings in the Marvel Universe.',
//     superpowers: JSON.stringify({
//       intelligence: 88,
//       strength: 100,
//       speed: 83,
//       durability: 100,
//       power: 100,
//       combat: 55,
//     }),
//     catchPhrase: 'I am the end of all things!',
//     createdAt: '2025-09-13T19:24:25.732Z',
//     updatedAt: '2025-09-14T16:28:13.789Z',
//     images: [
//       {
//         id: 'img5',
//         url: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/5-abraxas.jpg',
//         heroId: '5',
//         createdAt: '2025-09-14T16:28:13.789Z',
//       },
//     ],
//   },
// ];

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

      // Fallback to mock data if API fails--------------------------------! ! ! ! ! ---------------------
      // const { page, limit } = filters;
      // const numericLimit = limit === 'all' ? mockSuperheroes.length : Number(limit);
      // const startIndex = (page - 1) * numericLimit;
      // const endIndex = limit === 'all' ? mockSuperheroes.length : startIndex + numericLimit;

      // const paginatedData = mockSuperheroes.slice(startIndex, endIndex);
      // const totalPages = limit === 'all' ? 1 : Math.ceil(mockSuperheroes.length / numericLimit);

      // return {
      //   data: paginatedData,
      //   total: mockSuperheroes.length,
      //   page,
      //   limit: numericLimit,
      //   totalPages: totalPages,
      // };
    }
  },

  async getSuperheroById(id: string): Promise<SuperheroEntity> {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching superhero:', error);
      throw error;
      // Fallback to mock data if API fails --------------------------------! ! ! ! ! ---------------------
      // const superhero = mockSuperheroes.find(hero => hero.id === id);
      // if (!superhero) {
      //   throw new Error('Superhero not found');
      // }
      // return superhero;
    }
  },

  async createSuperhero(data: CreateSuperheroRequest): Promise<SuperheroEntity> {
    try {
      const payload = {
        nickname: data.nickname,
        realName: data.realName,
        originDescription: data.originDescription,
        superpowers: data.superpowers,
        catchPhrase: data.catchPhrase,
        images: data.images,
      };

      const response = await api.post('/', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating superhero:', error);
      throw error;
    }
  },

  async updateSuperhero(id: string, data: UpdateSuperheroRequest): Promise<SuperheroEntity> {
    try {
      const payload = {
        nickname: data.nickname,
        realName: data.realName,
        originDescription: data.originDescription,
        superpowers: data.superpowers,
        catchPhrase: data.catchPhrase,
        images: data.images,
      };

      Object.keys(payload).forEach(
        key =>
          payload[key as keyof typeof payload] === undefined &&
          delete payload[key as keyof typeof payload],
      );

      const response = await api.put(`/${id}`, payload);
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

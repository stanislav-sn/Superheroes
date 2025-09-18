export interface SuperpowerStats {
  intelligence: number;
  strength: number;
  speed: number;
  durability: number;
  power: number;
  combat: number;
}

interface BaseSuperhero {
  nickname: string;
  realName: string;
  originDescription: string;
  superpowers: SuperpowerStats;
  catchPhrase: string;
}

interface ImageEntity {
  id: string;
  url: string;
  heroId: string;
  createdAt: string;
}

export interface SuperheroEntity extends BaseSuperhero {
  id: string;
  images: ImageEntity[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUpdateSuperheroDTO extends Omit<BaseSuperhero, 'superpowers'> {
  superpowers?: Partial<SuperpowerStats> | string;
  images?: Array<{ url: string }>;
}

export interface PaginationQuery {
  page: number;
  limit: number | 'all';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number | 'all';
  totalPages: number;
}

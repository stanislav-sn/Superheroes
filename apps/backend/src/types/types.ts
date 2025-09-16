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

export interface ImageEntity {
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

export interface ImageDTO {
  id: string;
  url: string;
  heroId: string;
  createdAt: string;
}

export interface SuperheroDTO extends BaseSuperhero {
  id: string;
  images: ImageDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface SuperheroPreviewDTO {
  id: string;
  nickname: string;
  image: string;
}

export interface CreateSuperheroRequest extends BaseSuperhero {
  images?: Pick<ImageDTO, 'url'>[];
}

export type UpdateSuperheroRequest = Partial<CreateSuperheroRequest>;

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

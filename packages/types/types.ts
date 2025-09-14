interface BaseSuperhero {
  nickname: string;
  realName: string | null;
  originDescription: string | null;
  superpowers: string | null;
  catchPhrase: string | null;
}

export interface ImageEntity {
  id: string;
  url: string;
  heroId: string;
  createdAt: Date;
}

export interface SuperheroEntity extends BaseSuperhero {
  id: string;
  images: ImageEntity[];
  createdAt: Date;
  updatedAt: Date;
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
  id: string;
  images?: Pick<ImageDTO, 'url'>[];
}

export type UpdateSuperheroRequest = Partial<Omit<CreateSuperheroRequest, 'id'>>;

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

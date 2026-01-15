export type PersonId = number;

export interface CreatePersonInput {
  names: string[];
  bio?: string;
  birthYear?: number;
  deathYear?: number;
  country?: string;
  createdByUserId: number;
}

export interface UpdatePersonInput {
  bio?: string;
  birthYear?: number;
  deathYear?: number;
  country?: string;
}

export interface PersonSearchCriteria {
  query?: string;
  country?: string;
  isAlive?: boolean;
  limit?: number;
  offset?: number;
}

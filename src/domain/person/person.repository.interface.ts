import { Person } from './person.entity';
import {
  PersonId,
  CreatePersonInput,
  UpdatePersonInput,
  PersonSearchCriteria,
} from './person.types';

export interface IPersonRepository {
  findById(id: PersonId): Promise<Person | null>;
  search(criteria: PersonSearchCriteria): Promise<Person[]>;
  create(input: CreatePersonInput): Promise<Person>;
  update(id: PersonId, input: UpdatePersonInput): Promise<Person>;
  delete(id: PersonId, deletedByUserId: number): Promise<void>;
  addName(id: PersonId, name: string): Promise<void>;
  removeName(personNameId: number): Promise<void>;
}

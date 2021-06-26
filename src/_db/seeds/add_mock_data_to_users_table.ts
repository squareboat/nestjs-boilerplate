import * as Knex from 'knex';
import { v4 as uuidv4 } from 'uuid';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').truncate();
  // Inserts seed entries
  await knex('users').insert([
    {
      uuid: uuidv4(),
      firstName: 'Vinayak',
      lastName: 'Sarawagi',
      username: 'codingdogg',
    },
  ]);
}

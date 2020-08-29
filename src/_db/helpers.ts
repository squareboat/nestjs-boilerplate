import * as Knex from 'knex';

export function timestamps(knex: Knex, table) {
  table
    .timestamp('created_at')
    .notNullable()
    .defaultTo(knex.raw('CURRENT_TIMESTAMP'));

  table
    .timestamp('updated_at')
    .notNullable()
    .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
}

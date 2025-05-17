const { timestamps } = require('../utils');

exports.up = async function (knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.integer('role').defaultTo(0); // 0: user, 1: recuiter, 2: admin
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.date('dob').notNullable();
    table.string('username').notNullable().unique();
    table.string('email').unique();
    table.string('password').notNullable();
    // table.timestamps('deleted_at').nullable();
    timestamps(knex, table);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable('users');
};
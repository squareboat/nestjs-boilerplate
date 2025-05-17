const { timestamps } = require("../utils");

exports.up = async function (knex) {
   await knex.schema.createTable('jobs', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.string('title').notNullable();
        table.string('description').notNullable();
        table.string('location').notNullable();
        table.string('skills').notNullable();
        table.integer('status').defaultTo(0); // 0: open, 1: closed
        // table.timestamps('deleted_at').nullable();
        timestamps(knex, table);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable('jobs');
};

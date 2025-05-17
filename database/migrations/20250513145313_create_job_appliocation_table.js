const { timestamps } = require("../utils");

exports.up = async function (knex) {
   await knex.schema.createTable('job_applications', (table) => {
        table.increments('id').primary();
        table.uuid('uuid').defaultTo(knex.raw('(UUID())'));
        table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
        table.integer('job_id').unsigned().references('id').inTable('jobs').onDelete('CASCADE');
        // table.timestamps('deleted_at').nullable();
        timestamps(knex, table);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable('job_applications');

};

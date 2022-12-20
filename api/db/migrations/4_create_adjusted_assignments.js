/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("adjusted_assignments", (table) => {
    table.increments('id').primary();
    table.integer('time_slot_id').notNullable();
    table.foreign('time_slot_id').references('time_slots.id').onDelete('SET NULL');
    table.integer('removed_member_id').notNullable();
    table.foreign('removed_member_id').references('users.id').onDelete('SET NULL');
    table.integer('added_member_id').notNullable();
    table.foreign('added_member_id').references('users.id').onDelete('SET NULL');
    table.timestamps(true, true); 
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('adjusted_assignments', table => {
    table.dropForeign('time_slot_id');
    table.dropForeign('removed_member_id');
    table.dropForeign('added_member_id');
    })
    .then(() => {
        return knex.schema.dropTableIfExists('adjusted_assignments');
    });
};

'use strict'

exports.up = function (knex, Promise) {
  return Promise
    .all([])
    .then(() => knex.schema.createTableIfNotExists('test_table', (table) => {
      table.increments()
      table.string('query').unique()
      table.string('url')
        // table.timestamps()
      table.timestamps(true, true)
    })
    )
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('test_table')
}

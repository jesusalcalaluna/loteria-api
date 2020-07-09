'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('user', 80).notNullable().unique()
      table.string('password', 60).notNullable()
      table.integer('lottery_wins').notNullable().defaultTo('0')
      table.integer('center_wins').notNullable().defaultTo('0')
      table.integer('full_wins').notNullable().defaultTo('0')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema

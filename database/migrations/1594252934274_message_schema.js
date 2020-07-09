'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MessageSchema extends Schema {
  up () {
    this.create('messages', (table) => {
      table.increments()
      table.string('message', 255).notNullable().defaultTo('0')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('sala_id').unsigned().references('id').inTable('salas')
      table.timestamps()
    })
  }

  down () {
    this.drop('messages')
  }
}

module.exports = MessageSchema

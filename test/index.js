/* eslint-env mocha */
'use strict'

const Code = require('code')
const expect = Code.expect
const bookshelf = require('./bookshelf')
// const ModelBase = require('quantal-base-model')(bookshelf)
const ModelBase = require('bookshelf-modelbase')(bookshelf)
const knex = bookshelf.knex
const BaseRepository = require('../lib')
const CommonErrors = require('quantal-errors')
const modelBase = require('bookshelf-modelbase').pluggable
bookshelf.plugin(modelBase)

let TestModel = ModelBase.extend({
  tableName: 'test_table',

  related: function () {
    return this.hasOne(TestRelated, 'test_id')
  }
})

let TestRelated = ModelBase.extend({
  tableName: 'test_table'
})

describe('Base Repository', function () {
  const baseRepo = new BaseRepository(TestModel)
  let saveData = {
    // id: 1000,
    query: 'Marvel',
    url: 'www.giphy.com'
  }

  before(function () {
    return bookshelf
      .knex
      .migrate
      .latest()
      .then(() => knex.raw('DELETE FROM "test_table";'))
  })

  beforeEach(function () {
    return TestModel.create(saveData)
  })

  afterEach(function () {
    return knex.raw('DELETE FROM "test_table";')
  })

  it('should create a new instance of Base Repository', function () {
    expect(new BaseRepository(TestModel)).to.be.an.instanceof(BaseRepository)
  })

  it('findById - should throw a NotFoundError given non existent ID', function () {
    return baseRepo
      .findById(100000)
      .catch((err) => {
        expect(err).to.be.an.instanceof(CommonErrors.NotFoundError)
      })
  })

  it('should throw an IllegalArgumentError if null  is passed to BaseRepository constructor', function () {
    const thrown = () => {
      new BaseRepository(null) //eslint-disable-line
    }

    expect(thrown).to.throw(CommonErrors.IllegalArgumentError, 'model must be an instance of ModelBase of bookshelf plugin bookshelf-modelbase')
  })

  it('should find all entries', function () {
    return baseRepo
      .findAll()
      .then((entries) => {
        expect(entries).to.be.an.array()
        expect(entries.length).to.equal(1)
      })
  })

  it('findAll - should throw a NotFoundError given non existent ID', function () {
    return bookshelf
      .knex
      .migrate
      .latest()
      .then(() => knex.raw('DELETE FROM "test_table";'))
      .then(() => {
        return baseRepo
          .findAll(null, {require: true})
          .catch((err) => {
            expect(err).to.be.an.instanceof(CommonErrors.NotFoundError)
          })
      })
  })

  it('update - should throw a NotFoundError given non existent ID', function () {
    return baseRepo
      .update({url: 'www.yahoo.com'}, {id: 11000, require: true})
      .catch((err) => {
        expect(err).to.be.an.instanceof(CommonErrors.NotFoundError)
      })
  })

  it('upsert - should insert given data that does not exist', function () {
    return baseRepo
      .upsert({query: 'Marvel'}, {url: 'www.yahoo.com'}, {require: true})
      .catch((err) => {
        expect(err).to.be.an.instanceof(CommonErrors.NotFoundError)
      })
  })

  it('upsert - should update given data that does not exit', function () {
    return baseRepo
      .upsert({query: 'Superman'}, {url: 'www.quantal.com'}, {require: true})
      .catch((err) => {
        expect(err).to.be.an.instanceof(CommonErrors.NotFoundError)
      })
  })
})

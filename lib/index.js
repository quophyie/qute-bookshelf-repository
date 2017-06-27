'use strict'
const CommonErrors = require('quantal-errors')
const Bookshelf = require('bookshelf')(null)

const convertToJson = (model, bConvertResultToJson) => {
  if (model && bConvertResultToJson) return model.toJSON()
  return model
}

class BaseRepository {
  /**
   *
   * @param model {Object}  - The type (class type) of the model that this repository manages e.g. GiphyModel
   */
  constructor (model) {
    if (!model) {
      throw new CommonErrors.IllegalArgumentError('model must be an instance of ModelBase of bookshelf plugin bookshelf-modelbase')
    }

    this.model = model
  }

  /**
   * Returns a single instance of a model
   * @param data - the data to pass fetch
   * @param options {Object} - the options to pass to model.fetch
   * @param {Boolean} [bConvertResultToJson=true] - if true, result will be converted to JSON, otherwise Bookself model instance will be returned
   * @returns {Promise}
   */
  findOne (data, options, bConvertResultToJson = true) {
    return this.model.findOne(data, options)
      .then(result => convertToJson(result, bConvertResultToJson))
      .catch(Bookshelf.NotFoundError, () => Promise.reject(new CommonErrors.NotFoundError('NotFoundError')))
      .catch(err => Promise.reject(CommonErrors.utils.bookshelfToApp(err)))
  }

  /**
   * Naive add - create and save a model based on data
   * @param {Object} data
   * @param {Object} options (optional)
   * @param {Boolean} [bConvertResultToJson=true] - if true, result will be converted to JSON, otherwise Bookself model instance will be returned
   * @return {Promise(bookshelf.Model)} single Model
   */
  create (data, options, bConvertResultToJson = true) {
    return this.model.create(data, options)
      .then(result => convertToJson(result, bConvertResultToJson))
      .catch(err => Promise.reject(CommonErrors.utils.bookshelfToApp(err)))
  }

  /**
   * Naive destroy
   * @param {Object} options - The options passed to destroy
   * @param options.id {Number|String} - The id of the model to be deleted
   * @param {Boolean} [bConvertResultToJson=true] - if true, result will be converted to JSON, otherwise Bookself model instance will be returned
   * @return {Promise(bookshelf.Model)} empty Model
   */
  destroy (options, bConvertResultToJson = true) {
    return this.model.destroy(options)
      .then(result => convertToJson(result, bConvertResultToJson))
      .catch(Bookshelf.NoRowsDeletedError, () => Promise.reject(new CommonErrors.NoRowsDeletedError('NoRowsDeletedError')))
      .catch(Bookshelf.NotFoundError, () => Promise.reject(new CommonErrors.NotFoundError('NotFoundError')))
      .catch(err => Promise.reject(CommonErrors.utils.bookshelfToApp(err)))
  }

  /**
   * Naive findAll - fetches all data for `this`
   * @param {Object} [filter] - filters by the attributes
   * @param {Object} options (optional)
   * @param {Boolean} [bConvertResultToJson=true] - if true, result will be converted to JSON, otherwise Bookself model instance will be returned
   * @return {Promise(bookshelf.Collection)} Bookshelf Collection of all Models
   */
  findAll (filter, options, bConvertResultToJson = true) {
    return this.model.findAll(filter, options)
      .then(result => convertToJson(result, bConvertResultToJson))
      .catch(Bookshelf.NotFoundError, () => Promise.reject(new CommonErrors.NotFoundError('NotFoundError')))
      .catch(Bookshelf.EmptyError, () => Promise.reject(new CommonErrors.NotFoundError('NotFoundError')))
      .catch(err => Promise.reject(CommonErrors.utils.bookshelfToApp(err)))
  }

  /**
   * Naive findWhere - fetches all data for `this`. This method is an alias for findAll
   * @param {Object} filter - The filter/ query that will be applied to the find all query
   * @param {Object} options (optional)
   * @param {Boolean} [bConvertResultToJson=true] - if true, result will be converted to JSON, otherwise Bookself model instance will be returned
   * @return {Promise(bookshelf.Collection)} Bookshelf Collection of all Models
   */
  findWhere (filter, options, bConvertResultToJson = true) {
    return this.findAll(filter, options, bConvertResultToJson)
  }

  /**
   * Find a model based on it's ID
   * @param {String | Number} id The model's ID
   * @param {Object} [options] Options used of model.fetch
   * @param {Boolean} [bConvertResultToJson=true] - if true, result will be converted to JSON, otherwise Bookself model instance will be returned
   * @return {Promise(bookshelf.Model)}
   */
  findById (id, options, bConvertResultToJson = true) {
    return this.model.findById(id, options)
      .then(result => convertToJson(result, bConvertResultToJson))
      .catch(Bookshelf.NotFoundError, () => Promise.reject(new CommonErrors.NotFoundError('NotFoundError')))
      .catch(err => Promise.reject(CommonErrors.utils.bookshelfToApp(err)))
  }

  /**
   * Find or create - try and find the model, create one if not found
   * @param {Object} data
   * @param {Object} options
   * @param {Boolean} [bConvertResultToJson=true] - if true, result will be converted to JSON, otherwise Bookself model instance will be returned
   * @return {Promise(bookshelf.Model)} single Model
   */
  findOrCreate (data, options, bConvertResultToJson = true) {
    return this.model.findOrCreate(data, options)
      .then(result => convertToJson(result, bConvertResultToJson))
      .catch(Bookshelf.NotFoundError, () => Promise.reject(new CommonErrors.NotFoundError('NotFoundError')))
      .catch(err => Promise.reject(CommonErrors.utils.bookshelfToApp(err)))
  }

  /**
   * Naive update - update a model based on data
   * @param {Object} data
   * @param {Object} options
   * @param {Boolean} [bConvertResultToJson=true] - if true, result will be converted to JSON, otherwise Bookself model instance will be returned
   * @return {Promise(bookshelf.Model)} edited Model
   */
  update (data, options, bConvertResultToJson = true) {
    return this.model.update(data, options)
      .then(result => convertToJson(result, bConvertResultToJson))
      .catch(Bookshelf.NotFoundError, () => Promise.reject(new CommonErrors.NotFoundError('NotFoundError')))
      .catch(Bookshelf.NoRowsUpdatedError, () => Promise.reject(new CommonErrors.NoRowsUpdatedError('NoRowsUpdatedError')))
      .catch(err => Promise.reject(CommonErrors.utils.bookshelfToApp(err)))
  }

  /**
   * Upsert - select a model based on data and update if found, insert if not found
   * @param {Object} selectData Data for select
   * @param {Object} updateData Data for update
   * @param {Object} [options] Options for model.save
   * @param {Boolean} [bConvertResultToJson=true] - if true, result will be converted to JSON, otherwise Bookself model instance will be returned
   * @return {Promise(bookshelf.Model)} edited Model
   */
  upsert (selectData, updateData, options, bConvertResultToJson = true) {
    return this.model.upsert(selectData, updateData, options)
      .then(result => convertToJson(result, bConvertResultToJson))
      .catch(Bookshelf.NotFoundError, () => Promise.reject(new CommonErrors.NotFoundError('NotFoundError')))
      .catch(Bookshelf.NoRowsUpdatedError, () => Promise.reject(new CommonErrors.NoRowsUpdatedError('NoRowsUpdatedError')))
      .catch(err => Promise.reject(CommonErrors.utils.bookshelfToApp(err)))
  }
}

module.exports = BaseRepository

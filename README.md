# Qute Bookshelf Repository

A simple repository that manages a **`single`**  [bookshelf-modelbase](https://github.com/bsiddiqui/bookshelf-modelbase) model which is in turn a [bookshelf model](http://bookshelfjs.org/). 
This repository provides many commonly used methods that are found in repository classes / objects
This repository should be used as as abstraction layer between the [bookshelf model](http://bookshelfjs.org/) and services to prevent the bookshelf models from leaking into services (i.e. encourages loose coupling)
This module should be extended / inherited to add additional functionality
**`qute-bookshelf-repository`** will return JSON objects by default. This behaviour can be controlled by the **`bConvertResultToJson`** (defaults to **`true`**) variable that is passed to every method in the API . If  **`bConvertResultToJson`** 
is set to **`false`**, the [bookshelf model](http://bookshelfjs.org/) will be returned. 

**`Unless there is a really good reason to do so, you  should not be returning the`** [bookshelf model](http://bookshelfjs.org/)
which is passed to each method

### **NOTE** 

This module wraps the original [bookshelf-modelbase](https://github.com/bsiddiqui/bookshelf-modelbase)/ [bookshelf](http://bookshelfjs.org/) errors with [quantal-errors](https://github.com/quophyie/errors.git). The reason being that it makes
handling certain [bookshelf-modelbase](https://github.com/bsiddiqui/bookshelf-modelbase) / [bookshelf](http://bookshelfjs.org/)errors easier e.g. (`Collection.EmptyError` and `Model.NotFoundError` are simply coerced to `NotFoundError`)

# Install

**`npm install quantal-base-model`**

# Example Usage

### The bookshelf model
```javascript
// giphy-model.js
'use strict'
const bookshelf = require('./../../db')
const ModelBase = require('bookshelf-modelbase')(bookshelf)

const Giphy = ModelBase.extend({
  tableName: 'giphys',
  idAttribute: 'giphy_id'
})

module.exports = bookshelf.model('Giphy', Giphy)

```

### The repository to manage the model
```javascript
// giphy-repository.js
'use strict'
const BaseRepository = require('qute-bookshelf-repository')
const GiphyModel = require('./models/giphy-model')

class GiphyRepository extends BaseRepository {
  /**
   * Repositories must call BaseRepository constructor
   */
  constructor () {
    super(GiphyModel)
  }
}

module.exports = GiphyRepository

```
### The usage of the repository

```javascript
// giphy-service.js

'use strict'
const GiphyRepository = require('./giphy-repository')
const giphyRepository = new GiphyRepository()

module.exports = Object.freeze({

  findOrCreate (data) {
    return giphyRepository.findOrCreate(data)
  }
})

```



# API

**`constructor`**

```javascript
 /**
   *
   * @param model {Object}  - The type (class type) of the model that this repository manages e.g. MyModel
   */
  constructor (model)
```

 **repository.findOne**
 ```javascript
 /**
       * Returns a single instance of a model
       * @param filter - the filter to pass fetch
       * @param options {Object} - the options to pass to model.fetch
       * @param {Boolean} [bConvertResultToJson=true] - if true, result will be converted to JSON, otherwise Bookself model instance will be returned
       * @returns {Promise}
       */
      findOne (filter, options, bConvertResultToJson = true)
```

 **repository.create**
```javascript
 /**
       * Naive add - create and save a model based on data
       * @param {Object} data
       * @param {Object} options (optional)
       * @param {Boolean} [bConvertResultToJson=true] - if true, result will be converted to JSON, otherwise Bookself model instance will be returned
       * @return {Promise(bookshelf.Model)} single Model
       */
      create (data, options, bConvertResultToJson = true)
```

 **repository.destroy**
```javascript
      /**
       * Naive destroy
       * @param {Object} options - The bookshelf destroy options
       * @param options.id {Number|String} - The id of the model to be deleted
       * @param {Boolean} [bConvertResultToJson=true] - if true, result will be converted to JSON, otherwise Bookself model instance will be returned
       * @return {Promise(bookshelf.Model)} empty Model
       */
      destroy (options, bConvertResultToJson = true)
```

 **repository.findAll**
```javascript
 /**
       * Naive findAll - fetches all data for `this`
       * @param {Object} filter - The filter/ query that will be applied to the find all query
       * @param {Object} [options] - The bookshelf destroy options
       * @param {Boolean} [bConvertResultToJson=true] - if true, result will be converted to JSON, otherwise Bookself model instance will be returned
       * @return {Promise(bookshelf.Collection)} Bookshelf Collection of all Models
       */
      findAll (filter, options, bConvertResultToJson = true) 
```

 **repository.findWhere**
```javascript
    /**
       * Naive findWhere - fetches all data for `this`. This method is an alias for findAll
       * @param {Object} filter - The filter/ query that will be applied to the find all query
       * @param {Object} options (optional)
       * @param {Boolean} [bConvertResultToJson=true] - if true, result will be converted to JSON, otherwise Bookself model instance will be returned
       * @return {Promise(bookshelf.Collection)} Bookshelf Collection of all Models
       */
      findWhere (filter, options, bConvertResultToJson = true)
```

 **repository.findById**
```javascript

      /**
       * Find a model based on it's ID
       * @param {String | Number} id The model's ID
       * @param {Object} [options] Options used of model.fetch
       * @param {Boolean} [bConvertResultToJson=true] - if true, result will be converted to JSON, otherwise Bookself model instance will be returned
       * @return {Promise(bookshelf.Model)}
       */
      findById (id, options, bConvertResultToJson = true)
```

 **repository.findOrCreate**
```javascript
    /**
       * Find or create - try and find the model, create one if not found
       * @param {Object} data - The data to use to find a model. If The model does not exist, this data will be persisted
       * @param {Object} options - The options thar are passed to fetch and create
       * @param {Boolean} [bConvertResultToJson=true] - if true, result will be converted to JSON, otherwise Bookself model instance will be returned
       * @return {Promise(bookshelf.Model)} single Model
       */
      findOrCreate (data, options, bConvertResultToJson = true)
```

 **repository.update**
```javascript
      /**
       * Naive update - update a model based on data
       * @param {Object} data - The data to be used to update a model
       * @param {Object} options - The options to pass to save
       * @param {Boolean} [bConvertResultToJson=true] - if true, result will be converted to JSON, otherwise Bookself model instance will be returned
       * @return {Promise(bookshelf.Model)} edited Model
       */
      update (data, options, bConvertResultToJson = true)
```

 **repository.upsert**
```javascript
      /**
       * Upsert - select a model based on data and update if found, insert if not found
       * @param {Object} selectData - Data for select
       * @param {Object} updateData -  Data for update
       * @param {Object} [options] options - for model.save
       * @param {Boolean} [bConvertResultToJson=true] - if true, result will be converted to JSON, otherwise Bookself model instance will be returned
       * @return {Promise(bookshelf.Model)} edited Model
       */
      upsert (selectData, updateData, options, bConvertResultToJson = true)
```

# Licence

    MIT
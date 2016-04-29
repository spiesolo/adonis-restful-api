'use strict'

const models = {
  credential: use('App/Model/Credential'),
  device_class: use('App/Model/DeviceClass'),
  device_definition: use('App/Model/DeviceDefinition'),
  device_model: use('App/Model/DeviceModel'),
  device: use('App/Model/Device'),
  user: use('App/Model/User')
}

class ApiController {

  // create - POST /api/:resource
  * store (request, response) {
    const model = request.param('resource')
    const data = request.input('model')
    const result = yield models[model].create(data)
    // todo: better response? handleError
    response.json(result[0])
  }

  // readMany - GET /api/:resource
  * index (request, response) {
    const model = request.param('resource')
    const query = models[model].query()
    const where = JSON.parse(request.input('query'))
    if (where) {
      query.where(where)
    }
    const results = yield query.fetch()
    response.json(results)
  }

  // query - POST /api/:resource/query
  * query (request, response) {
    console.log('query():request', request.params(), request.get())
    const model = request.param('resource')
    const query = models[model].query()

    const where = request.input('where')
    console.log('query():where', where, typeof where)
    if (where) {
      query.where(where)
    }

    const related = request.input('related')
    console.log('query():related', related)
    if (related) {
      query.with(related)
    }

    const orderBy = request.input('orderBy')
    console.log('query():orderBy', orderBy)
    if (orderBy) {
      query.orderBy(orderBy.column, orderBy.direction)
    }

    const limit = request.input('limit')
    console.log('query():limit', limit)
    if (limit) {
      query.limit(limit)
    }

    const offset = request.input('offset')
    console.log('query():offset', offset)
    if (offset) {
      query.offset(offset)
    }

    const results = yield query.fetch()
    // console.log('index():results', results)
    response.json(results)
  }

  // readOne - GET /api/:resource/:id
  * show (request, response) {
    console.log('show()', request.all())
    const model = request.param('resource')
    const result = yield models[model].find(request.param('id'))
    response.json(result)
  }

  // update - PATCH /api/:resource/:id
  * update (request, response) {
    const model = request.param('resource')
    const data = request.input('model')
    const instance = yield models[model].find(request.param('id'))
    const result = yield instance.update(data)
    response.json(result)
  }

  // delete - DELETE /api/:resource/:id
  * destroy (request, response) {
    const model = request.param('resource')
    const record = yield models[model].find(request.param('id'))
    const result = yield record.delete()
    response.json(result)
  }

}

module.exports = ApiController

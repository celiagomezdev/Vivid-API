import test from 'ava'
import request from 'supertest'
import app from '../app'
import dbHelper from '../bin/empty-db'

//Empty db
dbHelper.emptyBarDB()

test('Get list of bars', async t => {
  const bar = {
    name: 'Natascha',
    address: 'Weserstr.',
    placeId: 'hjsgjhdsg56215673562'
  }

  const creation = await request(app)
    .post('/bar')
    .send(bar)

  const res = await request(app).get('/bar')

  t.is(res.status, 200)
  t.true(Array.isArray(res.body), 'Body should be an array')
  t.true(res.body.length > 0)
})

test('Get bars of a certain neighbourhood', async t => {
  const bar = {
    name: 'Rudi Marie',
    neighbourhood: 'Neukölln',
    placeId: 'jsdhkjsahkjdsh'
  }

  const creation = await request(app)
    .post('/bar')
    .send(bar)

  const res = await request(app).get(`/bar/${creation.body.neighbourhood}`)

  t.is(res.status, 200)
  t.is(res.body[0].neighbourhood, bar.neighbourhood)
})

test('Get no results of a certain neighbourhood', async t => {
  const res = await request(app).get(`/bar/Brooklin`)

  t.is(res.status, 404)
})

test('Create a new bar', async t => {
  const bar = {
    name: 'Aloma',
    address: 'Pannierstr.',
    placeId: 'skjhdkjah45435342'
  }

  const res = await request(app)
    .post('/bar')
    .send(bar)

  t.is(res.status, 200)
  t.is(res.body.name, bar.name)
  t.is(res.body.address, bar.address)
  t.is(res.body.placeId, bar.placeId)
})

test('Avoid creating duplicates', async t => {
  const bar = {
    name: 'Wilds',
    address: 'Hermannpl.',
    placeId: 'sajhgsjhag65656'
  }

  const res = await request(app)
    .post('/bar')
    .send(bar)

  const dupBar = {
    name: 'Wilds',
    address: 'Hermannpl.',
    placeId: 'sajhgsjhag65656'
  }

  const resDupBar = await request(app)
    .post('/bar')
    .send(dupBar)

  t.is(resDupBar.status, 500)
})

test('Fetch a bar', async t => {
  t.plan(2)

  const bar = (await request(app)
    .post('/bar')
    .send({
      name: 'Paloma',
      address: 'Reuterstr.',
      placeId: '236826hhgsdjgwy'
    })).body

  const fetch = await request(app).get(`/bar/${bar._id}/json`)

  t.is(fetch.status, 200)
  t.deepEqual(fetch.body, bar)
})

test('Update a bar', async t => {
  const bar = {
    name: 'Marinae',
    address: 'Lenaustr.',
    placeId: 'jsahkjdsuwyequiwye'
  }

  const res = await request(app)
    .post('/bar')
    .send(bar)

  const upBar = {
    _id: res.body._id,
    address: 'Maybachufer.'
  }

  const resUpBar = await request(app)
    .post('/bar/update')
    .send(upBar)

  const fetch = await request(app).get(`/bar/${upBar._id}/json`)

  t.is(resUpBar.status, 200)
  t.is(upBar.address, fetch.body.address)
})

test('Delete a bar', async t => {
  t.plan(3)

  const bar = (await request(app)
    .post('/bar')
    .send({
      name: 'Lagari',
      address: 'Hobrechstr.',
      placeId: '7638263872'
    })).body

  const del = await request(app).delete(`/bar/${bar._id}`)

  t.is(del.status, 200)
  t.is(del.text, `Bar deleted from the database`)

  const fetch = await request(app).get(`/bar/${bar._id}/json`)

  t.is(fetch.status, 404)
})

test('Add many entries', async t => {
  const barArray = [
    {
      name: 'K-fetisch',
      address: 'Hobrechstr.',
      placeId: 'iuweyeiuwhdskjsdh7'
    },
    {
      name: 'Wilders',
      address: 'Hermannpl.',
      placeId: 'kssddshdu77'
    }
  ]

  const res = await request(app)
    .post('/bar/add-many')
    .send(barArray)

  t.is(res.status, 200)
  t.deepEqual(res.body, barArray)
})

test('Render bars-list page', async t => {
  const renderedPage = await request(app).get('/bar/all')

  t.is(renderedPage.status, 200)
})

test('Render bars-list for neighbourhood page', async t => {
  const renderedPage = await request(app).get('/bar/all/Neukölln')

  t.is(renderedPage.status, 200)
})

test('Render neighbourhood-list page', async t => {
  const renderedPage = await request(app).get('/bar/Neukölln')

  t.is(renderedPage.status, 200)
})

test('Render bar-detail page', async t => {
  const bar = (await request(app)
    .post('/bar')
    .send({
      name: 'Matcha',
      address: 'Reuterstr.',
      placeId: '6287687236ssdds'
    })).body

  const renderedPage = await request(app).get(`/bar/detail/${bar._id}`)

  t.is(renderedPage.status, 200)
})

/* eslint-disable no-magic-numbers, max-lines */
/* global afterEach, beforeEach, describe, Event, it, Race */

var raceController = require('../../../api/controllers/RaceController.js')
var sinon = require('sinon')
var sailsMock = require('sails-mock-models')
var chai = require('chai')
var expect = chai.expect
var Q = require('q')

describe('/controllers/RaceController', function () {
  var sandbox

  beforeEach(function () { sandbox = sinon.sandbox.create() })
  afterEach(function () { sandbox.restore() })
  describe('.create()', function () {
    it('should create a race', function (done) {
      var actual
      var req = { body: { event: 1, group: 5, name: 'new race', racerNumberAllowed: 60, requirePacer: true } }
      var res = { ok: function (obj) { actual = obj }, badRequest: function (obj) { actual = obj } }
      var mockData = { id: 8, event: 1, group: 5, name: 'new race', racerNumberAllowed: 60, requirePacer: true }
      var mockEvent = { id: 1, raceOrder: [] }
      var mockEventUpdate = [ { id: 1, raceOrder: [8] } ]
      var expected = { races: [mockData] }

      sailsMock.mockModel(Race, 'create', mockData)
      sailsMock.mockModel(Event, 'findOne', mockEvent)
      sailsMock.mockModel(Event, 'update', mockEventUpdate)
      this.timeout(90)
      raceController.create(req, res)
      setTimeout(function () {
        expect(actual).to.deep.equal(expected)
        Race.create.restore()
        Event.findOne.restore()
        Event.update.restore()
        done()
      }, 50)
    })
  })

  describe('.update()', function () {
    it('should update race', function (done) {
      var actual
      var req = { body: { race: '5', laps: 28 } }
      var res = { ok: function (obj) { actual = obj }, badRequest: function (obj) { actual = obj } }
      var mock = { id: 5, group: 1, name: 'A race', laps: 28 }
      var mockUpdate = [ { id: 5, group: 1, name: 'A race', laps: 28 } ]
      var expected = { races: [{ id: 5, group: 1, name: 'A race', laps: 28 }] }

      sailsMock.mockModel(Race, 'findOne', mock)
      sailsMock.mockModel(Race, 'update', mockUpdate)
      this.timeout(100)
      raceController.update(req, res)
      setTimeout(function () {
        expect(actual).to.deep.equal(expected)
        Race.findOne.restore()
        Race.update.restore()
        done()
      }, 50)
    })
  })
  describe('.delete()', function () {
    it('return error when trying to delete a started race', function (done) {
      var actual
      var req = { params: { id: 5 } }
      var res = { ok: function (obj) { actual = obj }, badRequest: function (obj) { actual = obj } }
      var mock = { id: 8, group: { id: 5, event: 1 }, name: 'new race', startTime: '2017-10-10T08:00:00-08:00' }
      var expected = 'Cannot delete a started race'

      sailsMock.mockModel(Race, 'findOne', mock)
      this.timeout(90)
      raceController.delete(req, res)
      setTimeout(function () {
        expect(actual.message).to.equal(expected)
        Race.findOne.restore()
        done()
      }, 60)
    })
    it('should delete a race', function (done) {
      var actual
      var req = { params: { id: 5 } }
      var res = { ok: function (obj) { actual = obj }, badRequest: function (obj) { actual = obj } }
      var mock = { id: 8, group: 5, name: 'new race' }
      var mockEvent = { id: 1, raceOrder: [5] }
      var mockEventUpdate = [ { id: 1, raceOrder: [] } ]
      var expected = { race: { id: 5 } }

      sailsMock.mockModel(Race, 'findOne', mock)
      sailsMock.mockModel(Race, 'destroy')
      sailsMock.mockModel(Event, 'findOne', mockEvent)
      sailsMock.mockModel(Event, 'update', mockEventUpdate)
      this.timeout(90)
      raceController.delete(req, res)
      setTimeout(function () {
        expect(actual).to.deep.equal(expected)
        Race.findOne.restore()
        Race.destroy.restore()
        Event.findOne.restore()
        Event.update.restore()
        done()
      }, 60)
    })
  })
  describe('.startRace()', function () {
    it('should throw error if raceStatus not init', function (done) {
      var actual
      var req = { body: { id: 1, startTime: 1507651200000 } }
      var res = { ok: function (obj) { actual = obj }, badRequest: function (obj) { actual = obj } }
      var mock = { id: 1, raceStatus: 'started' }

      sailsMock.mockModel(Race, 'findOne', mock)
      this.timeout(150)
      raceController.startRace(req, res)
      setTimeout(function () {
        expect(actual.message).to.equal('Can only start an init race')
        Race.findOne.restore()
        done()
      }, 90)
    })
    it('should throw error if Another race ongoing', function (done) {
      var actual
      var req = { body: { id: 1, startTime: 1507651200000 } }
      var res = { ok: function (obj) { actual = obj }, badRequest: function (obj) { actual = obj } }
      var mock = { id: 1, raceStatus: 'init', group: { event: 1 } }
      var mockEvent = { id: 1, ongoingRace: 3 }

      sailsMock.mockModel(Race, 'findOne', mock)
      sailsMock.mockModel(Event, 'findOne', mockEvent)
      this.timeout(150)
      raceController.startRace(req, res)
      setTimeout(function () {
        expect(actual.message).to.equal('Another race ongoing')
        Race.findOne.restore()
        Event.findOne.restore()
        done()
      }, 90)
    })
    it('should start a race', function (done) {
      var actual
      var req = { body: { id: 1, startTime: 1507651200000 } }
      var res = { ok: function (obj) { actual = obj }, badRequest: function (obj) { actual = obj } }
      var mock = { id: 1, raceStatus: 'init', group: { event: 1 } }
      var mockEvent = { id: 1, ongoingRace: '' }
      var mockupdate = [ { id: 1, raceStatus: 'started' } ]
      var expected = { races: [{ id: 1, raceStatus: 'started' }] }

      sailsMock.mockModel(Race, 'findOne', mock)
      sailsMock.mockModel(Race, 'update', mockupdate)
      sailsMock.mockModel(Event, 'findOne', mockEvent)
      this.timeout(150)
      raceController.startRace(req, res)
      setTimeout(function () {
        expect(actual).to.deep.equal(expected)
        Race.findOne.restore()
        Race.update.restore()
        Event.findOne.restore()
        done()
      }, 90)
    })
  })
  describe('.resetRace()', function () {
    it('should reset a race', function (done) {
      var actual
      var req = { body: { id: 1 } }
      var res = { ok: function (obj) { actual = obj }, badRequest: function (obj) { actual = obj } }
      var mock = { id: 1, raceStatus: 'init', group: { event: 1 } }
      var mockEvent = { id: 1, ongoingRace: '' }
      var mockupdate = [ { id: 1, raceStatus: 'init' } ]
      var expected = { races: [{ id: 1, raceStatus: 'init' }] }

      sailsMock.mockModel(Race, 'findOne', mock)
      sailsMock.mockModel(Race, 'update', mockupdate)
      sailsMock.mockModel(Event, 'findOne', mockEvent)
      sailsMock.mockModel(Event, 'update', [mockEvent])
      this.timeout(150)
      raceController.resetRace(req, res)
      setTimeout(function () {
        expect(actual).to.deep.equal(expected)
        Race.findOne.restore()
        Race.update.restore()
        Event.findOne.restore()
        Event.update.restore()
        done()
      }, 90)
    })
  })
  describe('.endRace()', function () {
    it('should return error if not started', function (done) {
      var actual
      var req = { body: { id: 1 } }
      var res = { ok: function (obj) { actual = obj }, badRequest: function (obj) { actual = obj } }
      var mock = { id: 1, raceStatus: 'init' }

      sailsMock.mockModel(Race, 'findOne', mock)
      this.timeout(90)
      raceController.endRace(req, res)
      setTimeout(function () {
        expect(actual.message).to.equal('Can only stop a started race')
        Race.findOne.restore()
        done()
      }, 60)
    })
    it('should return error if not started', function (done) {
      var actual
      var req = { body: { id: 1 } }
      var res = { ok: function (obj) { actual = obj }, badRequest: function (obj) { actual = obj } }
      var mock = { id: 1, raceStatus: 'started', group: { event: 1 } }
      var mockEvent = { id: 1, ongoingRace: '' }
      var mockupdate = [ { id: 1, raceStatus: 'ended' } ]
      var expected = { races: mockupdate }

      sailsMock.mockModel(Race, 'findOne', mock)
      sailsMock.mockModel(Race, 'update', mockupdate)
      sailsMock.mockModel(Event, 'update', [mockEvent])
      this.timeout(150)
      raceController.endRace(req, res)
      setTimeout(function () {
        expect(actual).to.deep.equal(expected)
        Race.findOne.restore()
        Race.update.restore()
        Event.update.restore()
        done()
      }, 90)
    })
  })
  describe('.insertRfid()', function () {
    it('should not insert record if event not found', function (done) {
      var actual
      var eventId = 1
      var entriesRaw = [ { epc: 'abc123', timestamp: '1507651200000' } ]
      sandbox.stub(Q, 'defer').callsFake(function () {
        return { resolve: function (obj) { actual = obj }, reject: function (obj) { actual = obj } }
      })
      sailsMock.mockModel(Event, 'findOne')
      this.timeout(150)
      raceController.insertRfid(eventId, entriesRaw)
      setTimeout(function () {
        expect(actual).to.deep.equal(false)
        Event.findOne.restore()
        done()
      }, 90)
    })
    it('should not insert record to race if no ongoing race', function (done) {
      var actual
      var eventId = 1
      var entriesRaw = [ { epc: 'abc123', timestamp: '1507651200000' } ]
      var mock = { id: 1, ongoingRace: '', rawRfidData: [ { epc: 'aaa', timestamp: '1507651100000' } ] }
      var mockUpdate = [ mock ]
      sandbox.stub(Q, 'defer').callsFake(function () {
        return { resolve: function (obj) { actual = obj }, reject: function (obj) { actual = obj } }
      })
      sailsMock.mockModel(Event, 'findOne', mock)
      sailsMock.mockModel(Event, 'update', mockUpdate)
      this.timeout(150)
      raceController.insertRfid(eventId, entriesRaw)
      setTimeout(function () {
        expect(actual).to.deep.equal(false)
        Event.findOne.restore()
        Event.update.restore()
        done()
      }, 90)
    })
    /*

    */
  })
  describe('.insertRfidToRace()', function () {
    it('should not insert record to race if interval too short', function (done) {
      var actual
      var raceId = 'abc'
      var entries = [ { epc: 'abc123', timestamp: 1507651100000 } ]
      var mockRace = { id: 1, recordsHashTable: { abc123: [ 1507651099900 ], aaa: [], slaveEpcMap: {} } }
      var mockRaceUpdate = [ { id: 1, recordsHashTable: { abc123: [], aaa: [] } } ]

      sandbox.stub(Q, 'defer').callsFake(function () {
        return { resolve: function (obj) { actual = obj }, reject: function (obj) { actual = obj } }
      })
      sailsMock.mockModel(Race, 'findOne', mockRace)
      sailsMock.mockModel(Race, 'update', mockRaceUpdate)
      this.timeout(150)
      raceController.insertRfidToRace(raceId, entries, 100)
      setTimeout(function () {
        expect(actual).to.equal(false)
        Race.findOne.restore()
        Race.update.restore()
        done()
      }, 90)
    })
    it('should insert record if valid', function (done) {
      var actual
      var raceId = 'abc'
      var entries = [ { epc: 'abc123', timestamp: 1507651200000 } ]
      var mockRace = { id: 'abc', raceStatus: 'started', startTime: Date.now() - 10000, recordsHashTable: { abc123: [ 1507651000000 ], aaa: [] }, slaveEpcMap: {} }
      var mockRaceUpdate = [ { id: 'abc', recordsHashTable: { abc123: [ 1507651000000, 1507651100000 ], aaa: [] } } ]
      sandbox.stub(Q, 'defer').callsFake(function () {
        return { resolve: function (obj) { actual = obj }, reject: function (obj) { actual = obj } }
      })
      sailsMock.mockModel(Race, 'findOne', mockRace)
      sailsMock.mockModel(Race, 'update', mockRaceUpdate)
      this.timeout(150)
      raceController.insertRfidToRace(raceId, entries, 5000)
      setTimeout(function () {
        expect(actual).to.deep.equal({ races: mockRaceUpdate })
        Race.findOne.restore()
        Race.update.restore()
        done()
      }, 90)
    })
  })
})

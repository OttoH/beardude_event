/* eslint-disable no-magic-numbers, no-undefined, max-lines */
/* global afterEach, accountService, beforeEach, dataService, describe, it, Race, Registration, Team */

var registrationController = require('../../../api/controllers/RegistrationController.js');
var sailsMock = require('sails-mock-models');
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var Q = require('q');

describe('/controllers/RegistrationController', function() {
    var sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });
    describe('.signupAndCreate()', function () {
        it('should create a racer account and register for an event', function (done) {
            var actual;
            var req = {
                body: {
                    group: 1,
                    event: 1,
                    racer: {
                        email: 'info@beardude.com',
                        firstName: 'Jane'
                    }
                }
            };
            var res = {
                ok: function (obj) {
                    actual = obj;
                }
            };
            var expected = {
                message: 'Registered successfully',
                group: 1,
                racer: {
                    id: 1,
                    email: 'info@beardude.com',
                    firstName: 'Jane'
                },
                accessCode: undefined
            };
            var mock = {
                id: 1,
                event: 1,
                group: 1
            };

            sandbox.stub(accountService, 'create').callsFake(function () {
                var q = Q.defer();

                q.resolve({
                    id: 1,
                    email: 'info@beardude.com',
                    firstName: 'Jane'
                });
                return q.promise;
            });
            sandbox.stub(dataService, 'returnAccessCode').callsFake(function () {
                var q = Q.defer();

                q.resolve('');
                return q.promise;
            });
            sailsMock.mockModel(Registration, 'create', mock);
            registrationController.signupAndCreate(req, res);
            this.timeout(99);
            setTimeout(function () {
                expect(actual).to.deep.equal(expected);
                Registration.create.restore();
                done();
            }, 50);
        });
    });
    describe('.signupAndCreateMultiple()', function () {
        it('should create a team and multiple racer accounts, then register all for an event', function (done) {
            var actual;
            var req = {
                body: {
                    group: 1,
                    event: 1,
                    team: {
                        name: 'Team Murica',
                        desc: 'The best of the best of the best',
                        url: 'http://team-murica.cafe'
                    },
                    racers: [
                        {
                            email: 'info@beardude.com',
                            firstName: 'Jane'
                        },
                        {
                            email: 'info@beardude.com',
                            firstName: 'John'
                        },
                        {
                            email: 'info@beardude.com',
                            firstName: 'Peter'
                        }
                    ]
                }
            };
            var racerObjs = [
                {
                    id: 1,
                    email: 'info@beardude.com',
                    firstName: 'Jane'
                },
                {
                    id: 2,
                    email: 'info@beardude.com',
                    firstName: 'John'
                },
                {
                    id: 3,
                    email: 'info@beardude.com',
                    firstName: 'Peter'
                }
            ];
            var regObjs = [
                {
                    event: 1,
                    group: 1,
                    racer: 1
                },
                {
                    event: 1,
                    group: 1,
                    racer: 2
                },
                {
                    event: 1,
                    group: 1,
                    racer: 3
                }
            ];
            var res = {
                ok: function (obj) {
                    actual = obj;
                }
            };
            var expected = {
                message: 'Team registered successfully',
                team: {
                    id: 1,
                    name: 'Team Murica',
                    desc: 'The best of the best of the best',
                    url: 'http://team-murica.cafe',
                    leader: 1
                },
                registrations: regObjs
            };
            var mock = {
                id: 1,
                name: 'Team Murica',
                desc: 'The best of the best of the best',
                url: 'http://team-murica.cafe'
            };
            var mockUpdate = [{
                id: 1,
                name: 'Team Murica',
                desc: 'The best of the best of the best',
                url: 'http://team-murica.cafe',
                leader: 1
            }];
            var mockReg = {
                id: 1,
                event: 1,
                group: 1
            };
            var accountId = 1;
            var stubb = sandbox.stub(Q, 'all');

            sandbox.stub(accountService, 'create').callsFake(function (query) {
                var q = Q.defer();
                var result = query;

                result.id = accountId;
                accountId += 1;
                q.resolve(result);
                return q.promise;
            });
            stubb.onFirstCall().returns(racerObjs);
            stubb.onSecondCall().returns(regObjs);
            sailsMock.mockModel(Team, 'create', mock);
            sailsMock.mockModel(Team, 'update', mockUpdate);
            sailsMock.mockModel(Registration, 'create', mockReg);
            registrationController.signupAndCreateMultiple(req, res);
            this.timeout(99);
            setTimeout(function () {
                expect(actual).to.deep.equal(expected);
                Team.create.restore();
                Team.update.restore();
                Registration.create.restore();
                done();
            }, 70);
        });
    });
    describe('.create()', function () {
        it('should return registration exist if already registered', function (done) {
            var actual;
            var req = {
                body: {
                    group: 1,
                    event: 1,
                    racer: 1
                }
            };
            var res = {
                ok: function (obj) {
                    actual = obj;
                },
                badRequest: function (obj) {
                    actual = obj;
                }
            };
            var expected = 'Already registered';
            var mock = {
                id: 1,
                event: 1,
                group: 1
            };

            sailsMock.mockModel(Registration, 'findOne', mock);
            registrationController.create(req, res);
            this.timeout(99);
            setTimeout(function () {
                expect(actual.message).to.equal(expected);
                Registration.findOne.restore();
                done();
            }, 50);
        });
        it('should register for an event', function (done) {
            var actual;
            var req = {
                body: {
                    group: 1,
                    event: 1,
                    racer: 1
                }
            };
            var res = {
                ok: function (obj) {
                    actual = obj;
                }
            };
            var expected = {
                message: 'Registered successfully',
                group: 1,
                racer: 1,
                accessCode: undefined
            };
            var mock = {
                id: 1,
                email: 'info@beardude.com',
                firstName: 'Jane',
                event: 1,
                group: 1
            };

            sandbox.stub(dataService, 'returnAccessCode').callsFake(function () {
                var q = Q.defer();

                q.resolve('');
                return q.promise;
            });
            sailsMock.mockModel(Registration, 'findOne');
            sailsMock.mockModel(Registration, 'create', mock);
            registrationController.create(req, res);
            this.timeout(99);
            setTimeout(function () {
                expect(actual).to.deep.equal(expected);
                Registration.findOne.restore();
                Registration.create.restore();
                done();
            }, 50);
        });
    });
    describe('.getInfo()', function () {
        it('should return registration info with racer id', function (done) {
            var actual;
            var req = {
                body: {
                    event: '1',
                    racer: '1'
                }
            };
            var mock = {
                races: [{
                    id: 1
                }, {
                    id: 2
                }],
                event: 1,
                group: 1,
                accessCode: 'abcd',
                raceNumber: 1,
                paid: false,
                rfidRecycled: false,
                refundRequested: false,
                refunded: false
            };
            var expected = {
                races: [{
                    id: 1
                }, {
                    id: 2
                }],
                event: 1,
                group: 1,
                accessCode: 'abcd',
                raceNumber: 1,
                paid: false,
                rfidRecycled: false,
                refundRequested: false,
                refunded: false
            };
            var res = {
                ok: function (obj) {
                    actual = obj;
                }
            };

            sailsMock.mockModel(Registration, 'findOne', mock);
            registrationController.getInfo(req, res);
            this.timeout(99);
            setTimeout(function () {
                expect(actual).to.deep.equal(expected);
                Registration.findOne.restore();
                done();
            }, 50);
        });
        it('should return registration info with access code', function (done) {
            var actual;
            var mock = {
                races: [{
                    id: 1
                }, {
                    id: 2
                }],
                event: 1,
                group: 1,
                accessCode: 'abcd',
                raceNumber: 1,
                paid: false,
                rfidRecycled: false,
                refundRequested: false,
                refunded: false
            };
            var expected = {
                races: [{
                    id: 1
                }, {
                    id: 2
                }],
                event: 1,
                group: 1,
                accessCode: 'abcd',
                raceNumber: 1,
                paid: false,
                rfidRecycled: false,
                refundRequested: false,
                refunded: false
            };
            var res = {
                ok: function (obj) {
                    actual = obj;
                }
            };
            var req = {
                body: {
                    event: '1',
                    accessCode: 'abcd'
                }
            };

            sailsMock.mockModel(Registration, 'findOne', mock);
            registrationController.getInfo(req, res);
            this.timeout(99);
            setTimeout(function () {
                expect(actual).to.deep.equal(expected);
                Registration.findOne.restore();
                done();
            }, 50);
        });
    });
    describe('.assignRfid()', function () {
        it('should return error if racer already has RFID', function (done) {
            var actual;
            var mock = {
                id: 1,
                epc: 'abc123'
            };
            var req = {
                body: {
                    event: 1,
                    accessCode: 'aaa',
                    epc: 'abc000'
                }
            };
            var res = {
                badRequest: function (obj) {
                    actual = obj;
                }
            };
            var expected = 'Racer already has RFID';

            sailsMock.mockModel(Registration, 'findOne', mock);
            registrationController.assignRfid(req, res);
            this.timeout(50);
            setTimeout(function () {
                expect(actual.message).to.equal(expected);
                Registration.findOne.restore();
                done();
            }, 25);
        });
        it('should return error if RFID already assigned to another racer', function (done) {
            var actual;
            var req = {
                body: {
                    event: 1,
                    accessCode: 'aaa',
                    epc: 'abc000'
                }
            };
            var mock = {
                id: 1
            };
            var res = {
                badRequest: function (obj) {
                    actual = obj;
                }
            };
            var expected = 'RFID already assigned to another racer';

            sailsMock.mockModel(Registration, 'findOne', mock);
            registrationController.assignRfid(req, res);
            this.timeout(50);
            setTimeout(function () {
                expect(actual.message).to.equal(expected);
                Registration.findOne.restore();
                done();
            }, 25);
        });
        it('should assign RFID', function (done) {
            var actual;
            var req = {
                body: {
                    event: 1,
                    accessCode: 'aaa',
                    epc: 'abc000'
                }
            };
            var mock = {
                id: 1
            };
            var mockUpdate = [{
                id: 1,
                raceNumber: 1
            }];
            var res = {
                ok: function (obj) {
                    actual = obj;
                },
                badRequest: function (obj) {
                    actual = obj;
                }
            };
            var expected = {
                message: 'Rfid assigned',
                raceNumber: 1
            };

            sailsMock.mockModel(Registration, 'findOne', mock);
            sailsMock.mockModel(Registration, 'update', mockUpdate);
            registrationController.assignRfid(req, res);
            Registration.findOne.restore();
            sailsMock.mockModel(Registration, 'findOne');
            this.timeout(50);
            setTimeout(function () {
                expect(actual).to.deep.equal(expected);
                Registration.findOne.restore();
                Registration.update.restore();
                done();
            }, 25);
        });
    });
    describe('.replaceRfid()', function () {
        it('should return error if racer not assigned RFID yet', function (done) {
            var actual;
            var mock = {
                id: 1
            };
            var req = {
                body: {
                    event: 1,
                    raceNumber: 1,
                    epc: 'abc000'
                }
            };
            var res = {
                badRequest: function (obj) {
                    actual = obj;
                }
            };
            var expected = 'Racer not assigned RFID yet';

            sailsMock.mockModel(Registration, 'findOne', mock);
            registrationController.replaceRfid(req, res);
            this.timeout(50);
            setTimeout(function () {
                expect(actual.message).to.equal(expected);
                Registration.findOne.restore();
                done();
            }, 25);
        });
        it('should return error if RFID already assigned to another racer', function (done) {
            var actual;
            var req = {
                body: {
                    event: 1,
                    raceNumber: 1,
                    epc: 'abc000'
                }
            };
            var mock = {
                id: 1,
                epc: 'abc001'
            };
            var mock1 = {
                id: 2,
                epc: 'abc000'
            };
            var res = {
                badRequest: function (obj) {
                    actual = obj;
                }
            };
            var expected = 'RFID already assigned to another racer';

            sailsMock.mockModel(Registration, 'findOne', mock);
            registrationController.replaceRfid(req, res);
            Registration.findOne.restore();
            sailsMock.mockModel(Registration, 'findOne', mock1);
            this.timeout(50);
            setTimeout(function () {
                expect(actual.message).to.equal(expected);
                Registration.findOne.restore();
                done();
            }, 25);
        });
        it('should replace RFID', function (done) {
            var actual;
            var req = {
                body: {
                    event: 1,
                    raceNumber: 1,
                    epc: 'abc000'
                }
            };
            var mock = {
                id: 1,
                epc: 'abc001'
            };
            var mockUpdate = [{
                id: 1,
                epc: 'abc001',
                raceNumber: 1
            }];
            var res = {
                ok: function (obj) {
                    actual = obj;
                },
                badRequest: function (obj) {
                    actual = obj;
                }
            };
            var expected = {
                message: 'Rfid replaced',
                raceNumber: 1
            };

            sailsMock.mockModel(Registration, 'findOne', mock);
            sailsMock.mockModel(Registration, 'update', mockUpdate);
            registrationController.replaceRfid(req, res);
            Registration.findOne.restore();
            sailsMock.mockModel(Registration, 'findOne');
            this.timeout(50);
            setTimeout(function () {
                expect(actual).to.deep.equal(expected);
                Registration.findOne.restore();
                Registration.update.restore();
                done();
            }, 25);
        });
    });
    describe('.recycleRfid()', function () {
        it('should recycle rfid', function (done) {
            var actual;
            var req = {
                body: {
                    event: 1,
                    epc: 'abc000'
                }
            };
            var res = {
                ok: function (obj) {
                    actual = obj;
                }
            };
            var expected = {
                message: 'Rfid recycled',
                epc: 'abc000'
            };
            var mock = [
                {
                    id: 1,
                    epc: 'abc000'
                }
            ];

            sailsMock.mockModel(Registration, 'update', mock);
            registrationController.recycleRfid(req, res);
            this.timeout(50);
            setTimeout(function () {
                expect(actual).to.deep.equal(expected);
                Registration.update.restore();
                done();
            }, 25);
        });
    });
    describe('.confirmRegistration()', function () {
        it('should complain Race number already assigned if race number found', function (done) {
            var actual;
            var req = {
                body: {
                    registration: 1
                }
            };
            var res = {
                ok: function (obj) {
                    actual = obj;
                },
                badRequest: function (obj) {
                    actual = obj;
                }
            };
            var expected = 'Race number already assigned';
            var mock = [
                {
                    id: 1,
                    epc: 'abc000',
                    event: {
                        id: 1,
                        assignedRaceNumber: 10
                    }
                }
            ];
            var mock1 = {
                id: 2
            };

            sailsMock.mockModel(Registration, 'findOne', mock);
            registrationController.confirmRegistration(req, res);
            Registration.findOne.restore();
            sailsMock.mockModel(Registration, 'findOne', mock1);
            this.timeout(50);
            setTimeout(function () {
                expect(actual.message).to.equal(expected);
                Registration.findOne.restore();
                done();
            }, 25);
        });
        it('should complain Race number already assigned if race number found', function (done) {
            var actual;
            var req = {
                body: {
                    registration: 1
                }
            };
            var res = {
                ok: function (obj) {
                    actual = obj;
                },
                badRequest: function (obj) {
                    actual = obj;
                }
            };
            var expected = {
                message: 'Registration confirmed',
                raceNumber: 10
            };
            var mock = {
                id: 1,
                epc: 'abc000',
                event: {
                    id: 1,
                    assignedRaceNumber: 10
                }
            };

            sailsMock.mockModel(Event, 'update');
            sailsMock.mockModel(Registration, 'update');
            sailsMock.mockModel(Registration, 'findOne', mock);
            registrationController.confirmRegistration(req, res);
            Registration.findOne.restore();
            sailsMock.mockModel(Registration, 'findOne');
            this.timeout(50);
            setTimeout(function () {
                expect(actual).to.deep.equal(expected);
                Registration.findOne.restore();
                Registration.update.restore();
                Event.update.restore();
                done();
            }, 25);
        });
    });
    describe('.admitRacer()', function () {
        it('should return warning that the racer is not in the race', function (done) {
            var actual;
            var req = {
                body: {
                    race: 1,
                    epc: 'abc123'
                }
            };
            var res = {
                ok: function (obj) {
                    actual = obj;
                },
                badRequest: function (obj) {
                    actual = obj;
                }
            };
            var expected = 'Racer not in this race';

            sailsMock.mockModel(Registration, 'findOne');
            registrationController.admitRacer(req, res);
            this.timeout(50);
            setTimeout(function () {
                expect(actual.message).to.equal(expected);
                Registration.findOne.restore();
                done();
            }, 25);
        });
        it('should admit racer to the race', function (done) {
            var actual;
            var req = {
                body: {
                    race: 1,
                    epc: 'abc123'
                }
            };
            var res = {
                ok: function (obj) {
                    actual = obj;
                },
                badRequest: function (obj) {
                    actual = obj;
                }
            };
            var expected = {
                message: 'Racer admitted',
                epc: 'abc123'
            };
            var mock = {
                id: 1,
                epc: 'abc000',
                event: {
                    id: 1,
                    assignedRaceNumber: 10
                },
                races: [{
                    id: 1,
                    recordsHashTable: {}
                }, {
                    id: 2,
                    recordsHashTable: {}
                }, {
                    id: 3,
                    recordsHashTable: {}
                }]
            };

            sailsMock.mockModel(Registration, 'findOne', mock);
            sailsMock.mockModel(Race, 'update');
            registrationController.admitRacer(req, res);
            this.timeout(50);
            setTimeout(function () {
                expect(actual).to.deep.equal(expected);
                Registration.findOne.restore();
                Race.update.restore();
                done();
            }, 25);
        });
    });
    describe('.updateDisqualification()', function () {
        it('should add note to registration and disqualify racer', function (done) {
            var actual;
            var req = {
                body: {
                    race: 1,
                    registration: 1,
                    note: 'Dangerous conduct',
                    isDisqualified: true
                }
            };
            var res = {
                ok: function (obj) {
                    actual = obj;
                },
                badRequest: function (obj) {
                    actual = obj;
                }
            };
            var expected = {
                message: 'Racer disqualification updated',
                race: 1,
                isDisqualified: true,
                registration: 1,
                note: 'Dangerous conduct'
            };
            var mock = {
                id: 1,
                epc: 'abc000',
                raceNotes: []
            };

            sailsMock.mockModel(Registration, 'findOne', mock);
            registrationController.updateDisqualification(req, res);
            this.timeout(50);
            setTimeout(function () {
                expect(actual).to.deep.equal(expected);
                Registration.findOne.restore();
                done();
            }, 25);
        });
    });

    describe('.updateRaceNote()', function () {
        it('should update race note', function (done) {
            var actual;
            var req = {
                body: {
                    race: 1,
                    registration: 1,
                    note: 'fall twice'
                }
            };
            var res = {
                ok: function (obj) {
                    actual = obj;
                },
                badRequest: function (obj) {
                    actual = obj;
                }
            };
            var expected = {
                message: 'Race note added',
                race: 1,
                registration: 1,
                note: 'fall twice'
            };
            var mock = {
                id: 1,
                epc: 'abc000',
                raceNotes: []
            };

            sailsMock.mockModel(Registration, 'findOne', mock);
            sailsMock.mockModel(Registration, 'update');
            registrationController.updateRaceNote(req, res);
            this.timeout(50);
            setTimeout(function () {
                expect(actual).to.deep.equal(expected);
                Registration.findOne.restore();
                Registration.update.restore();
                done();
            }, 25);
        });
    });
    /*
    describe('.updatePayment()', function () {
        it('should ', function (done) {
        });
    });
    describe('.requestRefund()', function () {
        it('should ', function (done) {
        });
    });
    describe('.refunded()', function () {
        it('should ', function (done) {
        });
    });


    */
});

/* eslint-disable no-magic-numbers */
/* global afterEach, beforeEach, describe, it, Racer */

var isInactive = require('../../../api/policies/isInactive.js');
var sinon = require('sinon');
var assert = require('assert');
var sailsMock = require('sails-mock-models');

describe('policies/isInactive', function() {
    var sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('', function () {
        it('should return true if the user is not active', function (done) {
            var req = {
                session: {
                    racerInfo: {
                        email: 'info@beardude.com',
                        isActive: false
                    }
                }
            };
            var res = {};
            var expected = 'verified';
            var actual;
            var callbackFunc = function () {
                actual = 'verified';
            };

            isInactive(req, res, callbackFunc);
            assert.equal(actual, expected);
            done();
        });

        it('should return Already activated if logged in as manager', function (done) {
            var req = {
                session: {
                    managerInfo: {
                        email: 'info@beardude.com',
                        isActive: true
                    }
                }
            };
            var actual;
            var mockData;
            var callbackFunc = function () {
                return 'verified';
            };
            var res = {
                forbidden: function (str) {
                    actual = str;
                }
            };
            var expected = 'Already activated';

            isInactive(req, res, callbackFunc);
            assert.equal(actual, expected);
            done();
        });

        it('should return Already activated if logged in as racer', function (done) {
            var req = {
                session: {
                    racerInfo: {
                        email: 'info@beardude.com',
                        isActive: true
                    }
                }
            };
            var actual;
            var mockData;
            var callbackFunc = function () {
                return 'verified';
            };
            var res = {
                forbidden: function (str) {
                    actual = str;
                }
            };
            var expected = 'Already activated';

            isInactive(req, res, callbackFunc);
            assert.equal(actual, expected);
            done();
        });
    });
});
'use strict'

var bcrypt = require('bcrypt-nodejs')

// 活動管理人員, 例如裁判, admin, etc.
// TO DO: 分權限
module.exports = {
  attributes: {
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    phone: {
      type: 'string',
      required: true,
      unique: true
    },
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    street: {
      type: 'string',
      defaultsTo: ''
    },
    district: {
      type: 'string',
      defaultsTo: ''
    },
    city: {
      type: 'string',
      defaultsTo: ''
    },
    county: {
      type: 'string',
      defaultsTo: ''
    },
    country: {
      type: 'string',
      defaultsTo: ''
    },
    zip: {
      type: 'string',
      defaultsTo: ''
    },
    isActive: {
      type: 'boolean',
      required: true,
      defaultsTo: false
    },
    toJSON: function () {
      var obj = this.toObject()

      delete obj.password
      delete obj.createdAt
      delete obj.updatedAt
      return obj
    }
  },
  beforeCreate: function (values, callback) {
    if (values.password && values.password !== '') {
      return bcrypt.hash(values.password, null, null, function (err, hash) {
        if (err) {
          return callback(err)
        }
        values.password = hash
        return callback()
      })
    }
    return callback()
  },
  beforeUpdate: function (values, callback) {
    if (values.password && values.password !== '') {
            // When user updating password
      return bcrypt.hash(values.password, null, null, function (err, hash) {
        if (err) {
          return callback(err)
        }
        values.password = hash
        return callback()
      })
    }
    return callback()
  }
}

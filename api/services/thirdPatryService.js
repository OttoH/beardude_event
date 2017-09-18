'use strict'

var fireBaseConfig = {
  authDomain: "beardude-event.firebaseapp.com",
  databaseURL: "https://beardude-event.firebaseio.com",
  projectId: "beardude-event",
  storageBucket: "beardude-event.appspot.com",
  messagingSenderId: "831024020414"
}

var serviceAccountKey = {
  "type": "service_account",
  "project_id": "beardude-event",
  "private_key_id": "fd20a689b6768b0b2908126c509171107d5a451a",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDLJxqmou96UO1P\nSXjUXgka3U4uJmMcXjNd7RtQyr067ZCdkh7z66bSsTqfanQ89Q/8D49aMJXH+nqP\n15c1yn1araT6baLBW9KcCLCZHe3d4Qgs4Teq0dWlfZ2Dq385S7X9DJ3yVzVBqA5Z\nqkIDUfeLNvM/g4NGha3ZcGRsKS3Bv446tbVy8i0rRSVF2qVmyQ3AtLiMq4Ro0wcs\n1lkoTzClpTBoiJ54VBLzSpQ8KAMS2BVuK55kySdh0ArncYlyHFB2YJbJ5c9ylne+\nqAxUhRGomWjNr6HzZVtdyyCFEeT9umOkl7/3qlxBNrpRsWx+lEzUV7oFE6IoR4kx\n2eG9bpxtAgMBAAECggEAB2FzUWyIAMyh4oiL0ENeV1CE/547aZNukFIF9Qh4mYR6\nBY+CemAsXmk79QC8Gl7Y5tJ15dPwDSTngQRXJQgnR70ZSlPjXt0EKNEUAWwZ8T60\nulSwXg9jkLCgoWEArUc35Gqp7l0GvUzqwI0z+sTmlnM3oS4Y/d3rdAPmUhuo4uoP\nIQsKGyuD8Wuley/ux1T3eR5TeQAZk5fsOk6lQwmahntJU5DxYcj/EoUVSm6XS3o7\njWDKiGaRYSX5wfNFlF7q759CMDSkzg2YO5z/4sgTgCp7KJwmNTEC0I1D3uskQiNP\ngWEqh50U7VuqMPp2Bn2x9awUnTyFP9gY6r73+21VLQKBgQDoDmkVM0LoL6Tb/L5o\nFy4ilFbg9dMZYIGcp+dXWhUnYx3GtrLiEr1SBJ42Gy/EqpIfWxm80k6avrZxPbwx\nphEES9jPHavDiW78gqvrNxaQG1B5hj5rppOECnxBCtmG0EuDU8CGOi+AQhYHw09o\nNp3hPK00bkw/xWF7ivaU8cSMPwKBgQDgHTqMA0zg5AQuUQWqFy+Hfr8wlDQRnFEB\nV5MgKODzbLI5we8CGP7Yo2TjgMfj3rOEyuNxaRLReqKWjYkYnW94ntgCOFcux3VL\nJsdkVlAMVNcJ04FAeka2XUx2TiLz63an5viQ2nGphf+86pAkOBR6EV86gefo9Z+M\nHBg6XhHcUwKBgQDK/GgBKnD5R0vPPruTs8sgZl/EsmOwzBE0Zk7fwyXD6ViPjRrW\n1IuUpgN60rcrMgVVtkvCNriZdf+C+PyY9WnnNy10psCr75kM+oTF4M80yR/Q3ZPW\neMSK+N0NzB7RZXzYaLd88oLAj45Txg283CGod3oO5fh+w/pspfbh/MXv4wKBgQDa\nTP5Ddc+D2/cKmpdW6AC/DcHz8tiJMudg1EoWcFs2IfG0+ufx9iD/KqFSTZXnq3zX\n470KMlxHOhp3ZeRd2rTDHI6yEukxQs5I5rwgS0brzBQumRv0j2ajqluZfWDkkb5h\nrEUA7Bb9Fu5VuXGwJgQkJxnIZtNcAy1nD9K1v/3LywKBgQDaYeBI2XRhAvfpFe7K\n4235cOeUtRUhEtmNcpDx9hCDmQR+R/wpKd05CQNAPPVRNb2F/ulMNFoBQ217Oyu2\nI82b+quWLgDDK9LDOL+Oxl9BZxe6B5BuleUbxW3Q2PjraWeAXYjHWfEB9Jy+8kpQ\n3XcUQyLzXP84mc+CKds/pcrWtQ==\n-----END PRIVATE KEY-----\n",
  "client_email": "beardude-event@appspot.gserviceaccount.com",
  "client_id": "107026645089930667465",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/beardude-event%40appspot.gserviceaccount.com"
}



var admin = require("firebase-admin")

var _global = sails

/**
 * setup thirth party Instance
 * @method setupFirebase
 * @param
 */
var setupFirebase = function setupFirebase (genManagerName) {
  var _admin = null

  if (!_global._admin) {
    try {
      _admin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
        databaseURL: fireBaseConfig.databaseURL,
        databaseAuthVariableOverride: {
          uid: "beardude-event"
        }
      })
    } catch (err) {
      if (!/already exists/.test(err.message)) {
        console.error('Firebase initialization error', err.stack)
      }
    }

    _global._admin = _admin

    if (genManagerName === 'auth' && !_global._AuthManager) {
      _global._AuthManager = new AuthManager()
    }

    if (genManagerName === 'db' && !_global._DbManager) {
      _global._DbManager = new DbManager()
    }

    console.log('setupFirebase: ', `Firebase admin initialize successfully: ${_admin.name}`);
  }

  if (genManagerName === 'auth' && _global._AuthManager) {
    return _global._AuthManager
  } else if (genManagerName === 'db' && _global._DbManager) {
    return _global._DbManager
  } else {
    console.warn('setupFirebase: ', '_AuthManager or _DbManager is null!!');
    return
  }
}

/**
 * AuthManager
 * @class AuthManager
 * @param
 * @constructor
 */
var AuthManager = function AuthManager () {
  if (_global._admin) {
    this._auth = _global._admin.auth()
  } else {
    console.warn('none admin instance', 'please setup firebase first')
  }
}

/**
 * get AuthManager instance
 * @method getInstance
 * @param
 */
AuthManager.prototype.getInstance = function getInstance () {
  if (_global._AuthManager) {
    return _global._AuthManager
  } else {
    console.warn('none AuthManager instance', 'please setup firebase first')
  }
}

/**
 * login with email
 * @method getUserByEmail
 * @param {String} email
 * @async
 */
AuthManager.prototype.getUserByEmail = function getUserByEmail(email) {
  return this._auth.getUserByEmail(email)
}

/**
 * DbManager
 * @class DbManager
 * @param
 * @constructor
 */
var DbManager = function DbManager () {
  if (_global._admin) {
    this._db = _global._admin.database()
  } else {
    console.warn('none admin instance', 'please setup firebase first')
  }
}

/**
 * get DbManager instance
 * @class getInstance
 * @param
 */
DbManager.prototype.getInstance = function getInstance () {
  if (_global._DbManager) {
    return _global._DbManager
  } else {
    console.warn('none DbManager instance', 'please setup firebase first')
  }
}

/**
 * set Data
 * @method updateData
 * @param {String} ref
 * @param {String} child
 * @param {String} data
 * @async
 */
DbManager.prototype.setData = function updateData(ref, child, data) {
  return child ? this._db.ref(ref).child(child).set(data) : this._db.ref(ref).set(data)
}

/**
 * update Data
 * @method updateData
 * @param {String} ref
 * @param {String} child
 * @param {String} data
 * @async
 */
DbManager.prototype.updateData = function updateData(ref, child, data) {
  return child ? this._db.ref(ref).child(child).update(data) : this._db.ref(ref).update(data)
}

module.exports.setupFirebase = setupFirebase

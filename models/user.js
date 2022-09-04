const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this)
    .then()
    .catch(err => {
      console.log(err);
    });
  }

  static findById(userId) { 
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) })
    
  }

}

module.exports = User;

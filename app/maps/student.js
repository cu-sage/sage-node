
var StudentMap = {
  apiToDatabase: object => {
    return _.omitBy({
      _id: object.id,
      name: object.name
    }, _.isNil);
  },

  databaseToApi: document => {
    return _.omitBy({
      id: document._id,
      name: document.name
    }, _.isNil);
  }
}

module.exports = StudentMap;

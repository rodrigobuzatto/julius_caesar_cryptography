module.exports = app => {
  const controller = app.controllers.juliusCaesarCypher

  app.route('/api/v1/julius-caesar-cypher')
    .get(controller.createDataFile)

  app.route('/api/v1/julius-caesar-cypher/decrypt')
    .get(controller.decryptMessage)

  app.route('/api/v1/julius-caesar-cypher/encrypt')
    .get(controller.encryptMessage)

  app.route('/api/v1/julius-caesar-cypher/send')
    .get(controller.sendDataFile)
}
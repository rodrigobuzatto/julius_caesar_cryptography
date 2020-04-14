//api_get = https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=SEU_TOKEN
//api_post = https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=SEU_TOKEN

const express = require('express')
const bodyParser = require('body-parser')
const config = require('config')
const consign = require('consign')

module.exports = () => {
    const app = express()

    app.set('port', process.env.PORT || config.get('server.port'))

    app.use(bodyParser.json())

    consign({cwd: 'api'})
        .then('data')
        .then('controllers')
        .then('routes')
        .into(app)

    return app
}
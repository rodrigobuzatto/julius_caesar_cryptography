const api = "https://api.codenation.dev/v1/challenge/dev-ps/"
const api_get = "generate-data"
const api_post = "submit-solution"
const api_token = "b4a6855d0e7f52a7f05cccaf16ffdec7f219b99e"
const axios = require('axios')
const fs = require('fs')
const crypto = require('crypto')
const FormData = require('form-data')

const getFileData = () => {
  try{
      return axios.get(api + api_get, {
          params: {
              token: api_token
          }
      })
  } catch(error) {
      return error
  }
}

const writeFile = fileData => {
  fs.writeFile('./api/data/answer.json', fileData, (err) => {
    if(err) throw err
  })
}

const fileData = async () => {
  const data = getFileData()
    .then(response => {
      writeFile(JSON.stringify(response.data))
      return {
        "message": "Arquivo gerado com sucesso"
      }
    }) 
    .catch(error => {
      return {
        "message":  error
      }
    })
  return data
}

const decryptMessage = app => {
  const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  const database = app.data.answer
  let message = ""
  const num_casas = database.numero_casas

  if(database.cifrado.length > 0) {
    let cifrado = database.cifrado.toLowerCase()
    for(let c in cifrado) {
      let index = alphabet.indexOf(cifrado[c])
      let decryptedIndex = index + num_casas
      if(index > -1) {
        if(decryptedIndex > alphabet.length) {
          decryptedIndex -= alphabet.length
        }
        message += alphabet[decryptedIndex]
      } else {
        message += cifrado[c]
      }
    }
  }
  
  database.decifrado = message

  writeFile(JSON.stringify(database))

}

const encryptMessage = app => {
  const database = app.data.answer
  const hash = crypto.createHash('sha1')
  let message = ""
  let gen_hash

  message = hash.update(database.decifrado, 'utf-8')
  gen_hash = message.digest('hex')

  database.resumo_criptografico = gen_hash

  writeFile(JSON.stringify(database))
}

const sendFile = () => {
  try{
    const form = new FormData()
    const stream = fs.createReadStream('./api/data/answer.json')

    form.append('answer', stream)

    const formHeaders = form.getHeaders();

    return axios.post(api + api_post, form, {
      params: {
        token: api_token
      },
      headers: {
        ...formHeaders
      }
    }).then(response => console.log(response))
    .catch(error => error)
  } catch(error) {
      return error
  }
}

module.exports = app => {  
  const controller = {}

  controller.createDataFile = (req, res) => res.status(200).json(fileData())
  controller.decryptMessage = (req, res) => res.status(200).json(decryptMessage(app))
  controller.encryptMessage = (req, res) => res.status(200).json(encryptMessage(app))
  controller.sendDataFile = (req, res) => res.status(200).json(sendFile())

  return controller
}
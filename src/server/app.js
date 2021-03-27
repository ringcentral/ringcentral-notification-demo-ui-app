
import { resolve } from 'path'
import _ from 'lodash'
import axios from 'axios'

export default function extend (app) {
  const {
    APP_HOME = '/'
  } = process.env

  // const glob = {
  //   interval: 5000,
  //   msg: '',
  //   webhook: ''
  // }
  const pugData = {
    server: process.env.RINGCENTRAL_APP_SERVER,
    _global: {
      server: process.env.RINGCENTRAL_APP_SERVER
    }
  }

  async function sendMsg (msg, webhook) {
    const r = await axios.post(webhook, {
      text: msg,
      body: msg
    }, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).catch(console.error)
    if (r) {
      console.log(r.data)
    }
  }

  app.set('views', resolve(__dirname, './views'))
  app.set('view engine', 'pug')

  app.post('/api/action', (req, res) => {
    const {
      msg,
      webhook
    } = req.body
    if (_.isString(msg) && _.isString(webhook)) {
      sendMsg(msg, webhook)
    }
    res.send('ok')
  })

  app.get(APP_HOME, (req, res) => {
    res.render('app', pugData)
  })
  app.get('/auth', (req, res) => {
    res.render('auth', pugData)
  })
}

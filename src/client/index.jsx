import { useEffect, useRef, useState } from 'react'
import { Form, Button, Input } from 'antd'
import { RingCentralNotificationIntegrationHelper } from 'ringcentral-notification-integration-helper'
import qs from 'query-string'

const FormItem = Form.Item
const inIframe = window.top !== window

function getQuery () {
  return qs.parse(window.location.search)
}
function getFrameName () {
  const arr = window.location.href.match(/frameName=([\w-_\d]+)/)
  return arr
    ? arr[1]
    : ''
}

const q = getQuery()

export default function Options () {
  const ref = useRef(null)
  const [form] = Form.useForm()
  const [authed, setter] = useState(false)
  const state = {
    msg: '',
    webhook: q.webhook || ''
  }
  function onFinish (res) {
    return window.axios.post(
      window.rc.server + '/api/action',
      res
    )
  }
  function nofitfyCanSubmit (canSubmit) {
    ref.current.send({ canSubmit })
  }
  function onChange () {
    const values = form.getFieldsValue(true)
    console.log('values', values)
    nofitfyCanSubmit(!!(values.msg && values.webhook))
  }
  async function submit () {
    const values = form.getFieldsValue(true)
    await onFinish(values)
    return {
      status: true
    }
  }
  function auth () {
    window.open(window.rc.server + '/auth', getFrameName())
  }
  function onAuthCallack (e) {
    console.log(e)
    if (e && e.data && e.data.authDone) {
      setter(true)
    }
  }
  function init () {
    window.addEventListener('message', onAuthCallack)
    ref.current = new RingCentralNotificationIntegrationHelper()
    ref.current.on('submit', submit)
  }
  useEffect(() => {
    init()
  }, [])
  if (!authed) {
    return (
      <div className='wrap'>
        <h1>Demo RingCentral notification app with UI</h1>
        <p>
          <Button type='primary' onClick={auth}>
            Authorize
          </Button>
        </p>
      </div>
    )
  }
  return (
    <div className='wrap'>
      <h1>Demo RingCentral notification app with UI</h1>
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={state}
      >
        <FormItem
          label='Webhook'
          hasFeedback
          name='webhook'
          rules={[{
            required: true, message: 'webhook url required'
          }]}
        >
          <Input
            placeholder='Webhook url'
            onChange={onChange}
          />
        </FormItem>
        <FormItem
          label='Message'
          hasFeedback
          name='msg'
          rules={[{
            max: 128, message: '128 chars max'
          }, {
            required: true, message: 'message required'
          }]}
        >
          <Input
            placeholder='message will be send to RingCentral team'
            onChange={onChange}
          />
        </FormItem>
        {
          !inIframe
            ? (
              <p className='pd1 hide'>
                <Button
                  type='primary'
                  htmlType='submit'
                >
                  Submit
                </Button>
              </p>
            )
            : null
        }
      </Form>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Form, Button, Input, InputNumber } from 'antd'
import { MESSAGE_CHANNEL } from './common/constants'
import { PostMessageApp } from './common/post-message'
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
    window.axios.post(
      window.rc.server + '/api/action',
      res
    )
  }
  function nofitfyCanSubmit (status) {
    ref.current.send(MESSAGE_CHANNEL.oauth, { status })
  }
  function onChange () {
    const values = form.getFieldsValue(true)
    console.log('values', values)
    nofitfyCanSubmit(!!(values.msg && values.webhook))
  }
  function submit () {
    form.submit()
    return {
      status: false
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
    ref.current = new PostMessageApp()
    ref.current.handle(MESSAGE_CHANNEL.submitted, submit)
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

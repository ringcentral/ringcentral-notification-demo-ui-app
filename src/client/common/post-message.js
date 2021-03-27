/**
 * post message lib
 */

export class PostMessageApp {
  handle (channel, handler) {
    this.handler = this.createHandler(channel, handler)
    window.addEventListener('message', this.handler)
  }

  createHandler (channelName, handler) {
    return async (e) => {
      if (!e || !e.data) {
        return false
      }
      const {
        channel,
        type
      } = e.data
      if (channel !== channelName || type !== 'handle') {
        return false
      }
      const res = await handler(e)
      this.send(channel, {
        type: 'event',
        channel,
        payload: res
      })
    }
  }

  send (channel, data) {
    window.parent.postMessage({
      type: 'event',
      channel,
      payload: data
    }, '*')
  }

  dispose () {
    window.removeEventListener('message', this.handler)
  }
}

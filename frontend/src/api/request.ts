import { getAuthToken } from 'utils/authToken'
import { Response } from 'generated/models'
import { NotificationType, useNotification } from 'composables/notification'

export function guardError(res: Response | any) {
  if (res.error) {
    useNotification({
      type: NotificationType.Error,
      message: res.error
    })
  }
  return res
}

enum Method {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete'
}

export class RequestAPI {
  private url: string
  private prefix: string

  constructor(prefix: string) {
    const { REACT_APP_SERVER_URL } = process.env
    if (!REACT_APP_SERVER_URL) {
      throw new Error('Expected REACT_APP_SERVER_URL but not set')
    }
    this.prefix = prefix
    this.url = REACT_APP_SERVER_URL
  }

  get(path: string) {
    return this.request(Method.GET, path)
  }

  post(path: string, body: any = {}) {
    return this.request(Method.POST, path, body)
  }

  put(path: string, body: any = {}) {
    return this.request(Method.PUT, path, body)
  }

  delete(path: string, body: any = {}) {
    return this.request(Method.DELETE, path, body)
  }

  private async request(method: Method, path: string, body: any = {}) {
    const token = getAuthToken()
    return fetch(this.url + this.prefix + path, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      credentials: 'include',
      ...(method === Method.GET ? {} : { body: JSON.stringify(body) })
    })
      .then((res) => res.json())
      .then(guardError)
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e)
      })
  }
}

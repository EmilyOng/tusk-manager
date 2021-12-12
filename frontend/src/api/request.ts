enum Method {
  GET = 'get',
  POST = 'post',
}

export interface Response {
  error?: string
}

export class RequestAPI {
  private url: string

  constructor() {
    const { REACT_APP_SERVER_URL } = process.env
    if (!REACT_APP_SERVER_URL) {
      throw new Error('Expected REACT_APP_SERVER_URL but not set')
    }
    this.url = REACT_APP_SERVER_URL
  }

  get(path: string, body: any = {}) {
    return this.request(Method.GET, path, body)
  }

  post(path: string, body: any = {}) {
    return this.request(Method.POST, path, body)
  }

  private async request(method: Method, path: string, body: any = {}) {
    return fetch(this.url + path, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      ...(method === Method.GET ? {} : { body: JSON.stringify(body) }),
    })
      .then((res) => res.json())
      .catch((e) => {
        throw e
      })
  }
}

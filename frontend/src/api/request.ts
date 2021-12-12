enum Method {
  GET = 'get',
  POST = 'post',
}

export class RequestAPI {
  get(url: string, body: any = {}) {
    return this.request(Method.GET, url, body)
  }

  post(url: string, body: any = {}) {
    return this.request(Method.POST, url, body)
  }

  private request(method: Method, url: string, body: any = {}) {
    return fetch(url, {
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

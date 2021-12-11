export class RequestAPI {
  get(url: string, body: any = {}) {
    return this.request('GET', url, body)
  }

  post(url: string, body: any = {}) {
    return this.request('POST', url, body)
  }

  private request(method: string, url: string, body: any = {}) {
    return fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .catch((e) => {
        throw e
      })
  }
}

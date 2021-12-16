import { Category } from 'types/category'
import { RequestAPI, Response } from './request'

type Categories = Category[]
interface CategoriesResponse extends Response, Categories {}

export class CategoryAPI {
  private req: RequestAPI

  constructor() {
    this.req = new RequestAPI()
  }

  async getCategories(): Promise<CategoriesResponse> {
    return this.req.get('/categories/')
  }
}

import { Injectable } from '@nestjs/common';
import { createClient, SanityClient } from '@sanity/client';

@Injectable()
export class SanityService {
  private client: SanityClient;

  constructor() {
    this.client = createClient({
      projectId: process.env.SANITY_PROJECTID,
      dataset: process.env.SANITY_DATASET, 
      useCdn: false, 
      apiVersion: '2026-07-11', 
    });
  }

  async getProductWithComplements(productId: string) {
    const query = `*[_type == "product" && _id == $productId][0]{
      _id,
      name,
      price,
      complements[]->{
        _id,
        name,
        price
      }
    }`;

    return this.client.fetch(query, { productId });
  }
}
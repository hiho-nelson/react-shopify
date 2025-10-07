'use server';

import { shopifyClient } from './client';
import type { ShopifyProduct, ShopifyCollection, ShopifyCart, CartItem, ShopifyArticle } from './types';

// 服务端产品操作 - 无缓存，直接调用
export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  try {
    return await shopifyClient.getProductByHandle(handle);
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getProducts(first: number = 20, after?: string): Promise<{ products: ShopifyProduct[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } }> {
  try {
    return await shopifyClient.getProducts(first, after);
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], pageInfo: { hasNextPage: false, endCursor: null } };
  }
}

export async function getCollections(first: number = 10): Promise<ShopifyCollection[]> {
  try {
    return await shopifyClient.getCollections(first);
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

export async function getBlogArticles(handle: string, first: number = 3): Promise<ShopifyArticle[]> {
  try {
    return await shopifyClient.getBlogArticles(handle, first);
  } catch (error) {
    console.error('Error fetching blog articles:', error);
    return [];
  }
}

// 购物车相关 Server Actions
export async function createCart(items: CartItem[] = []): Promise<ShopifyCart | null> {
  try {
    return await shopifyClient.createCart(items);
  } catch (error) {
    console.error('Error creating cart:', error);
    return null;
  }
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  try {
    return await shopifyClient.getCart(cartId);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
}

export async function addToCart(cartId: string, items: CartItem[]): Promise<ShopifyCart | null> {
  try {
    return await shopifyClient.addToCart(cartId, items);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return null;
  }
}

export async function updateCartLines(cartId: string, lineUpdates: { id: string; quantity: number }[]): Promise<ShopifyCart | null> {
  try {
    return await shopifyClient.updateCartLines(cartId, lineUpdates);
  } catch (error) {
    console.error('Error updating cart:', error);
    return null;
  }
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<ShopifyCart | null> {
  try {
    return await shopifyClient.removeFromCart(cartId, lineIds);
  } catch (error) {
    console.error('Error removing from cart:', error);
    return null;
  }
}

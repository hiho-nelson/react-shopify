import { SHOPIFY_CONFIG, SHOPIFY_QUERIES } from './config';
import type { ShopifyProduct, ShopifyCollection, ShopifyCart, CartItem, ShopifyArticle } from './types';

// Shopify Storefront API 客户端
class ShopifyClient {
  private storeDomain: string;
  private accessToken: string;

  constructor() {
    this.storeDomain = SHOPIFY_CONFIG.SHOPIFY_STORE_DOMAIN;
    this.accessToken = SHOPIFY_CONFIG.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  }

  private async graphqlRequest(query: string, variables: Record<string, any> = {}, retries = 3) {
    // 检查环境变量
    if (!this.storeDomain || !this.accessToken) {
      throw new Error('Shopify environment variables are not configured. Please check your .env.local file.');
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔄 [Shopify API] 尝试 ${attempt}/${retries} - ${new Date().toLocaleTimeString()}`);
        
        // 添加超时控制
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log('⏰ [Shopify API] 请求超时，取消请求');
          controller.abort();
        }, 10000); // 10秒超时

        const response = await fetch(`https://${this.storeDomain}/api/2025-01/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': this.accessToken,
          },
          body: JSON.stringify({
            query,
            variables,
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        console.log(`✅ [Shopify API] 请求成功 - ${response.status}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Shopify API error (attempt ${attempt}/${retries}):`, {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
            url: response.url
          });
          
          // 如果是速率限制，等待更长时间
          if (response.status === 429) {
            const waitTime = Math.pow(2, attempt) * 1000; // 指数退避
            console.log(`Rate limited, waiting ${waitTime}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
          
          // 如果是服务器错误，重试
          if (response.status >= 500 && attempt < retries) {
            const waitTime = attempt * 1000;
            console.log(`Server error, waiting ${waitTime}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
          
          throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.errors) {
          console.error('GraphQL errors:', data.errors);
          throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
        }

        return data.data;
      } catch (error) {
        console.error(`GraphQL request failed (attempt ${attempt}/${retries}):`, error);
        
        // 如果是网络错误且还有重试机会，等待后重试
        if (attempt < retries && (error instanceof TypeError || (error instanceof Error && error.message.includes('fetch failed')))) {
          const waitTime = attempt * 1000;
          console.log(`Network error, waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        
        throw error;
      }
    }
  }

  // Customers (auth)
  async customerCreate(input: { email: string; password: string; firstName?: string; lastName?: string; }) {
    const data = await this.graphqlRequest(SHOPIFY_QUERIES.CUSTOMER_CREATE, { input });
    return data.customerCreate;
  }

  async customerAccessTokenCreate(input: { email: string; password: string; }) {
    const data = await this.graphqlRequest(SHOPIFY_QUERIES.CUSTOMER_ACCESS_TOKEN_CREATE, { input });
    return data.customerAccessTokenCreate;
  }

  async customerAccessTokenRenew(token: string) {
    const data = await this.graphqlRequest(SHOPIFY_QUERIES.CUSTOMER_ACCESS_TOKEN_RENEW, { customerAccessToken: token });
    return data.customerAccessTokenRenew;
  }

  async getCustomerByToken(token: string) {
    const data = await this.graphqlRequest(SHOPIFY_QUERIES.CUSTOMER_BY_TOKEN, { customerAccessToken: token });
    return data.customer;
  }

  async customerAccessTokenDelete(token: string) {
    const data = await this.graphqlRequest(SHOPIFY_QUERIES.CUSTOMER_ACCESS_TOKEN_DELETE, { customerAccessToken: token });
    return data.customerAccessTokenDelete;
  }

  async customerOrders(token: string, first: number = 20) {
    const data = await this.graphqlRequest(SHOPIFY_QUERIES.CUSTOMER_ORDERS, { customerAccessToken: token, first });
    return data.customer?.orders || null;
  }

  async customerProfile(token: string) {
    const data = await this.graphqlRequest(SHOPIFY_QUERIES.CUSTOMER_BY_TOKEN, { customerAccessToken: token });
    return data.customer || null;
  }

  async customerUpdate(token: string, customer: any) {
    const data = await this.graphqlRequest(SHOPIFY_QUERIES.CUSTOMER_UPDATE, { customerAccessToken: token, customer });
    return data.customerUpdate;
  }

  async customerRecover(email: string) {
    const data = await this.graphqlRequest(SHOPIFY_QUERIES.CUSTOMER_RECOVER, { email });
    return data.customerRecover;
  }

  async customerReset(id: string, resetToken: string, password: string) {
    const data = await this.graphqlRequest(SHOPIFY_QUERIES.CUSTOMER_RESET, { id, input: { password, resetToken } });
    return data.customerReset;
  }

  // 获取产品列表
  async getProducts(first: number = 20, after?: string) {
    const data = await this.graphqlRequest(SHOPIFY_QUERIES.GET_PRODUCTS, {
      first,
      after,
    });

    return {
      products: data.products.edges.map((edge: any) => this.transformProduct(edge.node)),
      pageInfo: data.products.pageInfo,
    };
  }

  // 根据 handle 获取单个产品
  async getProductByHandle(handle: string) {
    const data = await this.graphqlRequest(SHOPIFY_QUERIES.GET_PRODUCT_BY_HANDLE, {
      handle,
    });

    return data.product ? this.transformProduct(data.product) : null;
  }

  // 获取分类列表
  async getCollections(first: number = 10) {
    const data = await this.graphqlRequest(SHOPIFY_QUERIES.GET_COLLECTIONS, {
      first,
    });

    return data.collections.edges.map((edge: any) => this.transformCollection(edge.node));
  }

  // 获取博客文章
  async getBlogArticles(handle: string, first: number = 3): Promise<ShopifyArticle[]> {
    const data = await this.graphqlRequest(SHOPIFY_QUERIES.GET_BLOG_ARTICLES, { handle, first });
    const edges = data.blog?.articles?.edges || [];
    return edges.map((edge: any) => {
      const a = edge.node;
      return {
        id: a.id,
        title: a.title,
        handle: a.handle,
        excerpt: a.excerpt || '',
        publishedAt: a.publishedAt,
        authorName: a.authorV2?.name,
        image: a.image
          ? {
              id: a.image.id,
              url: a.image.url,
              altText: a.image.altText,
              width: a.image.width,
              height: a.image.height,
            }
          : null,
      } as ShopifyArticle;
    });
  }

  // 转换产品数据格式
  private transformProduct(product: any): ShopifyProduct {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      handle: product.handle,
      availableForSale: product.availableForSale,
      tags: product.tags,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      images: product.images.edges.map((edge: any) => ({
        id: edge.node.id,
        url: edge.node.url,
        altText: edge.node.altText,
        width: edge.node.width,
        height: edge.node.height,
      })),
      variants: product.variants.edges.map((edge: any) => ({
        id: edge.node.id,
        title: edge.node.title,
        availableForSale: edge.node.availableForSale,
        price: {
          amount: edge.node.price.amount,
          currencyCode: edge.node.price.currencyCode,
        },
        selectedOptions: edge.node.selectedOptions,
      })),
      price: {
        amount: product.priceRange.minVariantPrice.amount,
        currencyCode: product.priceRange.minVariantPrice.currencyCode,
      },
    };
  }

  // 转换分类数据格式
  private transformCollection(collection: any): ShopifyCollection {
    return {
      id: collection.id,
      title: collection.title,
      handle: collection.handle,
      description: collection.description,
      image: collection.image ? {
        id: collection.image.id,
        url: collection.image.url,
        altText: collection.image.altText,
        width: collection.image.width,
        height: collection.image.height,
      } : null,
      products: [], // 分类下的产品需要单独查询
    };
  }

  // 购物车相关方法
  async createCart(items: CartItem[] = []): Promise<ShopifyCart | null> {
    try {
      const lines = items.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity,
      }));
      const data = await this.graphqlRequest(SHOPIFY_QUERIES.CART_CREATE, {
        input: { lines }
      });

      if (data.cartCreate.userErrors.length > 0) {
        throw new Error(`Cart creation failed: ${data.cartCreate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return this.transformCart(data.cartCreate.cart);
    } catch (error) {
      return null;
    }
  }

  async getCart(cartId: string): Promise<ShopifyCart | null> {
    try {
      const data = await this.graphqlRequest(SHOPIFY_QUERIES.CART_GET, {
        id: cartId
      });

      return data.cart ? this.transformCart(data.cart) : null;
    } catch (error) {
      console.error('Error fetching cart:', error);
      return null;
    }
  }

  async addToCart(cartId: string, items: CartItem[]): Promise<ShopifyCart | null> {
    try {
      const lines = items.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity,
      }));

      const data = await this.graphqlRequest(SHOPIFY_QUERIES.CART_LINES_ADD, {
        cartId,
        lines
      });

      if (data.cartLinesAdd.userErrors.length > 0) {
        throw new Error(`Add to cart failed: ${data.cartLinesAdd.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return this.transformCart(data.cartLinesAdd.cart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      return null;
    }
  }

  async updateCartLines(cartId: string, lineUpdates: { id: string; quantity: number }[]): Promise<ShopifyCart | null> {
    try {
      const lines = lineUpdates.map(update => ({
        id: update.id,
        quantity: update.quantity,
      }));

      const data = await this.graphqlRequest(SHOPIFY_QUERIES.CART_LINES_UPDATE, {
        cartId,
        lines
      });

      if (data.cartLinesUpdate.userErrors.length > 0) {
        throw new Error(`Update cart failed: ${data.cartLinesUpdate.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return this.transformCart(data.cartLinesUpdate.cart);
    } catch (error) {
      console.error('Error updating cart:', error);
      return null;
    }
  }

  async removeFromCart(cartId: string, lineIds: string[]): Promise<ShopifyCart | null> {
    try {
      const data = await this.graphqlRequest(SHOPIFY_QUERIES.CART_LINES_REMOVE, {
        cartId,
        lineIds
      });

      if (data.cartLinesRemove.userErrors.length > 0) {
        throw new Error(`Remove from cart failed: ${data.cartLinesRemove.userErrors.map((e: any) => e.message).join(', ')}`);
      }

      return this.transformCart(data.cartLinesRemove.cart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      return null;
    }
  }

  // 转换购物车数据格式
  private transformCart(cart: any): ShopifyCart {
    return {
      id: cart.id,
      checkoutUrl: cart.checkoutUrl,
      lines: cart.lines.edges.map((edge: any) => {
        const line = edge.node;
        return {
          id: line.id,
          quantity: line.quantity,
          merchandise: {
            id: line.merchandise.id,
            title: line.merchandise.title,
            product: {
              id: line.merchandise.product.id,
              title: line.merchandise.product.title,
              handle: line.merchandise.product.handle,
              description: '',
              availableForSale: true,
              tags: [],
              createdAt: '',
              updatedAt: '',
              images: line.merchandise.product.images.edges.map((edge: any) => ({
                id: edge.node.id,
                url: edge.node.url,
                altText: edge.node.altText,
                width: edge.node.width,
                height: edge.node.height,
              })),
              variants: [],
              price: {
                amount: '0',
                currencyCode: 'USD',
              },
            },
          },
          cost: {
            totalAmount: {
              amount: line.cost.totalAmount.amount,
              currencyCode: line.cost.totalAmount.currencyCode,
            },
          },
        };
      }),
      totalQuantity: cart.totalQuantity,
      cost: {
        totalAmount: {
          amount: cart.cost.totalAmount.amount,
          currencyCode: cart.cost.totalAmount.currencyCode,
        },
      },
    };
  }
}

export const shopifyClient = new ShopifyClient();

// Shopify 数据类型定义
export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  metafields?: {
    capture_notes?: {
      value: string;
      type?: string;
      namespace?: string;
      key?: string;
    };
    custom?: {
      geography_map?: {
        value: string;
        type?: string;
        namespace?: string;
        key?: string;
      };
    };
  };
}

export interface ShopifyImage {
  id: string;
  url: string;
  altText: string;
  width: number;
  height: number;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: ShopifyImage | null;
  products: ShopifyProduct[];
}

export interface ShopifyArticle {
  id: string;
  title: string;
  handle: string;
  excerpt: string;
  publishedAt: string;
  authorName?: string;
  image: ShopifyImage | null;
}

export interface ShopifyCart {
  id: string;
  lines: ShopifyCartLine[];
  totalQuantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  checkoutUrl?: string;
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: ShopifyProduct;
  };
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface CartItem {
  variantId: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: ShopifyProduct;
  };
}

// Removed legacy local CartState and CheckoutSession; hosted checkout is used

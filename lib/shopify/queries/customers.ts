export const CUSTOMER_CREATE = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const CUSTOMER_ACCESS_TOKEN_CREATE = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken { accessToken, expiresAt }
      customerUserErrors { code, field, message }
    }
  }
`;

export const CUSTOMER_ACCESS_TOKEN_RENEW = `
  mutation customerAccessTokenRenew($customerAccessToken: String!) {
    customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
      customerAccessToken { accessToken, expiresAt }
      userErrors { field, message }
    }
  }
`;

export const CUSTOMER_BY_TOKEN = `
  query customer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      phone
      acceptsMarketing
    }
  }
`;

export const CUSTOMER_ACCESS_TOKEN_DELETE = `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors { field, message }
    }
  }
`;

export const CUSTOMER_ORDERS = `
  query customerOrders($customerAccessToken: String!, $first: Int = 20) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: $first) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPriceSet { shopMoney { amount currencyCode } }
            lineItems(first: 20) {
              edges {
                node {
                  title
                  sku
                  quantity
                  discountedTotalPriceSet { shopMoney { amount currencyCode } }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const CUSTOMER_UPDATE = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer { id email firstName lastName phone acceptsMarketing }
      customerUserErrors { code field message }
    }
  }
`;

export const CUSTOMER_RECOVER = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors { code field message }
    }
  }
`;

export const CUSTOMER_RESET = `
  mutation customerReset($id: ID!, $input: CustomerResetInput!) {
    customerReset(id: $id, input: $input) {
      customer { id email }
      customerUserErrors { code field message }
    }
  }
`;


# Shopify 设置指南

## 环境变量配置

在项目根目录创建 `.env.local` 文件，并添加以下环境变量：

```bash
# Shopify 商店域名 (例如: your-store.myshopify.com)
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com

# Shopify Storefront API 访问令牌
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
```

## 如何获取 Shopify Storefront API 访问令牌

1. 登录你的 Shopify Admin 面板
2. 进入 **Apps** > **App and sales channel settings**
3. 点击 **Develop apps** > **Create an app**
4. 填写应用名称，例如 "My Storefront App"
5. 在 **Configuration** 标签页中：
   - 勾选 **Allow this app to access your storefront data using the Storefront API**
   - 选择需要的权限（至少需要 `unauthenticated_read_product_listings`）
6. 点击 **Save**
7. 在 **API credentials** 标签页中，复制 **Storefront access token**

## 测试数据

如果你没有 Shopify 商店，可以使用 Shopify 的测试商店：
- 商店域名: `checkout.shopify.com`
- 访问令牌: `your-test-token`

## 验证设置

设置完成后，重启开发服务器：
```bash
pnpm dev
```

然后访问产品页面，如果看到产品列表，说明配置成功。
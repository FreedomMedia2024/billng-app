import { json, LoaderFunction } from '@remix-run/node';
import { authenticate, apiVersion } from "app/shopify.server";

interface ErrorResponse {
  error: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const { shop, accessToken } = session;
  try {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);
    const title = params.get('title');
    const id = '8976594305307';
    console.log("this is product id",id)
    if (!title) {
      throw new Error('Title parameter is missing');
    }

    const apkikay = 'e4ab98c8ab2fec28036cf89db9621d06';
    const pass = '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';
    const apiUrl = `https://${shop}/admin/api/${apiVersion}/products.json?title=${encodeURIComponent(title)}`;
    // const apiUrl = `https://${shop}/admin/api/${apiVersion}/products/${id}.json`;
    
    // const response = await fetch(apiUrl, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Basic ${Buffer.from(`${apkikay}:${pass}`).toString('base64')}`
    //   },
    // });
     console.log('this is api url',apiUrl)
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken!
      },
  });

    if (!response.ok) {
      console.error('Failed to fetch product:', response.statusText);
      throw new Error('Failed to fetch product');
    }

    const responseData = await response.json();
    console.log('Response Data:', JSON.stringify(responseData, null, 2)); // Log the full response data
    return json(responseData);

  } catch (error) {
    console.error('Error:', error);
    const errorResponse: ErrorResponse = { error: error instanceof Error ? error.message : 'Unknown error occurred' };
    return json(errorResponse, { status: 500 });
  }
};

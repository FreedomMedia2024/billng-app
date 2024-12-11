import { json } from "@remix-run/node";
import { Modal } from "app/routes/components/alphabetModal";
import { Form } from '@remix-run/react';
import { FormField } from "app/routes/components/formfield";
import React, { useState } from 'react';
import type { ActionFunctionArgs } from "@remix-run/node";
import Uploadwidget from "app/routes/components/imageuploader";
import db from "app/db.server";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";

interface ProductData {
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  price: string;
  sku: string;
  image: string;
  tags: string[];
}


export async function action({ request }: ActionFunctionArgs) {
  // Parse form data
  const formData = await request.formData();

  const productData = {
    title: formData.get('title')?.toString() ?? '',
    body_html: formData.get('body_html')?.toString() ?? '',
    vendor: formData.get('vendor')?.toString() ?? '',
    product_type: formData.get('product_type')?.toString() ?? '',
    variants: [
      {
        price: formData.get('price')?.toString() ?? '',
        sku: formData.get('sku')?.toString() ?? ''
      }
    ],
    images: [
      {
        src: formData.get('image')?.toString() ?? ''
      }
    ],
    tags: formData.getAll('tags').map(tag => tag.toString())
  };

  try {
    // Shopify API call to add the product
    const response = await fetch('https://z9-developers.myshopify.com/admin/api/2023-10/products.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa('e4ab98c8ab2fec28036cf89db9621d06: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')}`
      },
      body: JSON.stringify({ product: productData })
    });

    if (!response.ok) {
      throw new Error('Failed to add product');
    }

    const responseData = await response.json();
   
    // Await and return the result of saveToDatabase
    return await saveToDatabase(responseData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return json({ error: errorMessage }, { status: 500 });
  }
}

async function saveToDatabase(responseData: any) {
  const variantId = responseData.product.variants[0].id?.toString() ?? '';
  const variantPrice = responseData.product.variants[0].price?.toString() ?? '';
  const productImage = responseData.product.images[0].src?.toString() ?? '';
 

  // Adjust data object according to your Prisma schema
  const data = {
    image: productImage,
    variant_id: variantId,
    price: variantPrice,
    // Add other properties from your Prisma schema here
  };

  try {
    const lolaPatches = await db.lolaPatches.create({
      data,
      // If you have a select option, provide it here
    });
    return json({ success: true, ImageData: lolaPatches });
  } catch (error) {
    console.error("Error saving data to database:", error);
    // Handle error
    return null; // Return null if an error occurs
  }
}



export default function MyFormPage() {
  const handleUploadSuccess = (url: string) => {
    setFormData(form => ({ ...form, image: url }));
    
};
  // State to hold form data
  const [formData, setFormData] = useState<ProductData>({
    title: '',
    body_html: '',
    vendor: '',
    product_type: '',
    price: '',
    sku: '',
    image: '',
    tags: []
  });

  // Function to handle form submission
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch('/api/products', {
  //       method: 'POST',
  //       body: new FormData(e.currentTarget)
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to submit form data');
  //     }

  //     const responseData = await response.json();
  //     console.log(responseData); // Handle response from the API
  //   } catch (error) {
  //     console.error('Error:', error);
  //     // Handle error
  //   }
  // };

  return (
    <Modal isOpen={true}>
     
      <h2>Add New Product</h2>
      <div className="product-form">
        <Form method="post" >
        <Uploadwidget onUploadSuccess={handleUploadSuccess} />
        <img src={formData.image || ''} alt="" />
        <input type="hidden"  value={formData.image || ''} name="image"/>
          {/* Render form fields */}
          <FormField
            htmlFor="title"
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <FormField
            htmlFor="body_html"
            label="Description"
            value={formData.body_html}
            onChange={(e) => setFormData({ ...formData, body_html: e.target.value })}
          />
          <FormField
            htmlFor="vendor"
            label="Vendor"
            value={formData.vendor}
            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
          />
          <FormField
            htmlFor="product_type"
            label="Product Type"
            value={formData.product_type}
            onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
          />
          <FormField
            htmlFor="price"
            label="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <FormField
            htmlFor="sku"
            label="SKU"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          />
          {/* Add tags field */}
          <div>
            <label htmlFor="tags">Tags:</label>
            <input type="text" id="tags" name="tags" value={formData.tags.join(',')} onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',') })} />
          </div>
          <button type="submit">Submit</button>
        </Form>
      </div>
  
     </Modal>
  )
}
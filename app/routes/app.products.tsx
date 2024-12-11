// product.tsx

import { LoaderFunction, json } from '@remix-run/node';

// Define an interface for the product object
interface Product {
    images: { src: string }[];
    variants: { id: string }[];
}
// Define an interface for the extracted data item
interface ExtractedDataItem {
    imageSrc: string | null;
    variantId: string | null;
}

export let loader: LoaderFunction = async () => {
    let apkikay = 'e4ab98c8ab2fec28036cf89db9621d06';
    let pass = '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';
    let url = 'https://z9-developers.myshopify.com/admin/api/2023-10/products.json';

    try {
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(`${apkikay}:${pass}`)}`, // Include API key and password as Basic Auth
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch product data');
        }

        let data = await response.json();

        // Extracting required information
        let extractedData: ExtractedDataItem[] = data.products.map((product: Product) => ({
            imageSrc: product.images.length > 0 ? product.images[0].src : null, // Get the first image src if available
            variantId: product.variants.length > 0 ? product.variants[0].id : null // Get the id of the first variant if available
        }));

        // Filter out any null values
        extractedData = extractedData.filter((item: ExtractedDataItem) => item.imageSrc && item.variantId);

        // Take only the first two records
        extractedData = extractedData.slice(0, 2);

        return json(extractedData);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return json({ error: errorMessage }, { status: 500 });
    }
};




    
  
  

// Define the React component to render the product page


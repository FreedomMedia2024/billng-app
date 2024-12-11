import { json, LoaderFunction } from '@remix-run/node';

export let loader: LoaderFunction = async () => {
    try {
        const productData = {
            title: 'New Product',
            body_html: '<p>This is a new product</p>',
            vendor: 'Your Vendor',
            product_type: 'Your Product Type',
            variants: [
                {
                    price: '10.00',
                    sku: 'SKU001'
                }
            ],
            images: [
                {
                    src: 'https://res.cloudinary.com/dt7izmknv/image/upload/v1712565745/ggweabgwhgsmun7w6sn8.webp'
                },
                {
                    src: 'https://res.cloudinary.com/dt7izmknv/image/upload/v1712565745/ggweabgwhgsmun7w6sn8.webp'
                }
            ],
            tags: ['patch'] 
            // Add more product details as needed
        };
        let apkikay = 'e4ab98c8ab2fec28036cf89db9621d06';
        let pass = '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';
        const response = await fetch('https://z9-developers.myshopify.com/admin/api/2023-10/products.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(`${apkikay}:${pass}`)}`
            },
            body: JSON.stringify({ product: productData })
        });

        if (!response.ok) {
            throw new Error('Failed to add product');
        }

        const responseData = await response.json();
        return json(responseData);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return json({ error: errorMessage }, { status: 500 });
    }
};

// routes/orders.tsx

import { json, useLoaderData } from '@remix-run/react';
import {LoaderFunction } from '@remix-run/node';
import { Card, Layout, List, Page } from "@shopify/polaris";
import { authenticate, apiVersion } from "app/shopify.server";

interface LoaderData {
    ordersResponse: any; // Adjust the type according to the structure of the Shopify API response
    // Add other properties as needed
}

export const loader: LoaderFunction = async ({ request }) => {
    const { session } = await authenticate.admin(request);
    const { shop, accessToken } = session;

    try {
        const response = await fetch(`https://${shop}/admin/api/${apiVersion}/orders.json`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken!
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        const data = await response.json();

        console.log('Orders Response:', data);
        console.log('No orders') // Log the complete response from Shopify API

        return json({
            ordersResponse: data // Pass the complete response from Shopify API
        });
    } catch (err) {
        console.error('Error fetching orders:', err);
        return json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
};

export default function Orders() {
    const { ordersResponse } = useLoaderData() as LoaderData;

    // You can access the complete response from ordersResponse and process it as needed

    return (
        <Page>
            <Layout>
                <Layout.Section>
                    <Card>
                        {ordersResponse}
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

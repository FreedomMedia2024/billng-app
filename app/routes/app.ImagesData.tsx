import db from "app/db.server";
import { json, LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async ({ request }) => {
    // Extract the value of the Shopify.shop parameter from the request query string

    // Check if the shopName matches the expected value

        // If the condition is true, execute the loader function and fetch data from the database
        const ImagesData = await db.frontImgData.findMany();
        return json(ImagesData);
  
};
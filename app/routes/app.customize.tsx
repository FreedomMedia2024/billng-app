import db from "app/db.server";
import { json, LoaderFunction } from '@remix-run/node';


// This function handles the POST request to your endpoint
export const loader: LoaderFunction = async ({ request }) => {
    // Extract the value of the Shopify.shop parameter from the request query string

    // Check if the shopName matches the expected value

        // If the condition is true, execute the loader function and fetch data from the database
        const alphabets = await db.alphabets.findMany();
        return json(alphabets);
  
};
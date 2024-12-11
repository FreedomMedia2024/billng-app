import db from "app/db.server";

import { json, LoaderFunction } from '@remix-run/node';

// export const loader: LoaderFunction = async ({ request }) => {
//     // Extract the value of the Shopify.shop parameter from the request query string
//     const url = new URL(request.url);
//     const shopName = url.searchParams.get('shop');

//     // Check if the shopName matches the expected value
//     if (shopName === 'z9-developers.myshopify.com') {
//         // If the condition is true, execute the loader function and fetch data from the database
//         const alphabets = await db.alphabets.findMany();
//         return json(alphabets);
//     } else {
//         // If the condition is false, return an empty response or an appropriate error message
//         return new Response('Unauthorized', { status: 401 });
//     }
// };


export const loader: LoaderFunction = async ({ request }) => {
    try {
      // Fetch data from the lolaAlphabets database
      const alphabets = await db.lolaAlphabets.findMany();
  
      // Fetch data from the lolaPatches database
      const patches = await db.lolaPatches.findMany();
  
      // Fetch data from the FrontImgData database
      const frontImgData = await db.frontImgData.findMany();

      const colorvariants = await db.colorVariants.findMany();
      const sizevariants = await db.sizeVariants.findMany();
      const embImgData = await db.embImgData.findMany();
      const threadsColor = await db.threadsColor.findMany();
      const fonts = await db.fonts.findMany();
      const checkingImageData = await db.checkingImageData.findMany();
  
      // Return the fetched data
      return json({ alphabets, patches, frontImgData,colorvariants,sizevariants,embImgData,threadsColor,fonts,checkingImageData });
    } catch (error) {
      console.error("Error fetching data from the databases:", error);
      // Return an error response if something went wrong
      return json({ error: "Failed tooo fetch data from the databases" }, { status: 500 });
    }
  };
import { json, LoaderFunction } from '@remix-run/node';
import db from 'app/db.server';

export const loader: LoaderFunction = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const params = new URLSearchParams(url.search);
        const searchdata = params.get('searchdata') || ''; // Default to empty string if searchdata is null

        console.log('this is searchdata',searchdata)
        // Fetch data from the lolaPatches database
        let patches;
        if(searchdata){
            patches = await db.lolaAlphabets.findMany({
                where: {
                    alphabetname: { contains: searchdata }
                }
            });
        }
    
            return json({ patches });
       
       
    } catch (error) {
        console.error("Error fetching data from the databases:", error);
        // Return an error response if something went wrong
        return json({ error: "Failed to fetch data from the databases" }, { status: 500 });
    }
};

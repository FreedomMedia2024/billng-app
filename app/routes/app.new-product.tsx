import React, { useState, ChangeEvent } from 'react';
import { Page, Card, TextField, Icon,Button,Spinner, } from '@shopify/polaris';
import { Link, useNavigate } from 'react-router-dom';
import { json, LoaderFunction, ActionFunctionArgs} from '@remix-run/node';
import { Form } from '@remix-run/react';
import db from 'app/db.server';
import { useLoaderData } from "@remix-run/react";
import styles from 'app/routes/style/product.module.css';
import { SearchIcon, DeleteIcon,} from '@shopify/polaris-icons'; 
import { authenticate, apiVersion, MONTHLY_PLAN } from "app/shopify.server";

interface Product {
  // Define the properties of a product here
}
import {Badge} from '@shopify/polaris';
interface ImageData {
  id: string; 
  FproductId: string;
  FproductTitle: string;
  FProductImg: string;
  FHeight: string;
  FWidth: string;
  FTop:string;
  FLeft:string;

}
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const FproductId = formData.get('db-id')?.toString() ?? '';

  try {
      // Delete all records with the matching FproductId
      await db.frontImgData.delete({
          where: {
              FproductId: FproductId
          }
      });
      await db.colorVariants.deleteMany({
          where: {
            id: FproductId
          }
      });

      return { success: true };
  } catch (error) {
      console.error('Error deleting records:', error);
      return { success: false, error: 'Error deleting records' };
  }
}
export const loader: LoaderFunction = async ({ request }: { request: Request }) => {
  const { billing, session } = await authenticate.admin(request);
  const { shop } = session;
  const myShop = shop.replace(".myshopify.com", "");

  // Fetch the current plan for the shop
  await billing.require({
    plans: [MONTHLY_PLAN],
    onFailure: async () => billing.request({
      plan: MONTHLY_PLAN,
      isTest: true,
      returnUrl: `https://admin.shopify.com/store/${myShop}/apps/patch-customizer-1/app/price`,
    }),
  });
  const frontImageData = await db.frontImgData.findMany();
  return json(frontImageData);
};

export default function Index() {
  const [loading, setLoading] = useState(false); // Add loading state
  const [showerrormsg, seterrormsg] = useState(false); // Add loading state
  const [inputValue, setInputValue] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();
  const imageData: ImageData[] = useLoaderData();
  const [inputValuee] = useState('');

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleSearch = async () => {
    setLoading(true);
    seterrormsg(false);
    try {
      const response = await fetch(`/app/chek?title=${encodeURIComponent(inputValue)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const responseData = await response.json();
      const productsData = responseData.products || [];
      if(productsData == ''){
        setProducts(productsData); 
        setLoading(false);
        seterrormsg(true);
      }
      else{
       setProducts(productsData); 
        setLoading(false);
      }
     
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const clearSearch = async () => {
    setInputValue('');
    const productsData: Product[] = [];
    setProducts(productsData);
    seterrormsg(false);
  };

  return (
    <Page>
      <Card> 
       
        <div>
          <div className={styles.newproductitle}>
          <h3 className={styles.customizeheadertitle}>Add New Product</h3>
         
<Badge tone="attention">Search Product By Title</Badge>
          </div>

          <div className={styles.searbarwrapper}>
            <div className={styles.searchbar}>
              <div className={styles.searchbarfield}>
              <TextField
                label
                value={inputValue}
                onChange={handleInputChange} // No need to pass parameters here
                autoComplete="off"
                prefix={<Icon source={SearchIcon} tone="base" />}
              />
              </div>
            
              <div className={styles.searchbarbtn}>
              <Button  onClick={handleSearch}>Search</Button>
              <Button onClick={clearSearch}>Clear</Button>
              </div>
              
            </div>
            
          </div>
        </div>
        <div className={styles.spinner}>
    {loading && <Spinner accessibilityLabel="Loading" size="small" />}
    </div>
        {showerrormsg && <div>no data found</div>}
        {loading || showerrormsg ? ( null ) : (
         
          
     
          <div className={styles.searchbarproducts}>
          {Array.isArray(products) && products.map((product) => (
             <tbody>
            <tr key={product.variants[0].id} className={styles.searchbarproductswrapper}>
              <div className={styles.searchbarproductimg}>
              {product.images.length > 0 && <img src={product.images[0].src} alt={product.title} />}
              </div>
             <div>

              <p className={styles.searchproductitle}>{product.title}</p></div>
              <Button variant='primary' onClick={() => navigate(`/app/dropzone?id=${product.variants[0].id}&title=${product.title}`)}>Add</Button>
              
            </tr>
            </tbody>
          ))}
        </div>
        )}
      
        <div>
      
        <table className={styles.patchestable}>
     
     <thead>
         <tr>
             <th>Product</th>
             <th>Title</th>
             <th>Action</th>
         </tr>
         
     </thead>
     <tbody>
    
        {imageData.map((imageDatad: ImageData) => (
            
 <tr key={imageDatad.id} className={styles.imagesproductwrapper}>
  <td>
  <div className={styles.productImage}>
            <img src={imageDatad.FProductImg} className={styles.image} />
            <div className={styles.dropzone} style={{ top: `${imageDatad.FTop}%` , left :`${imageDatad.FLeft}%`, height : `${imageDatad.FHeight}%` , width : `${imageDatad.FWidth}%` }}></div>
        </div>
  </td>
  <td >{imageDatad.FproductTitle}</td>
  
  <td> 
    <div className={styles.actionbtns}>
    <Button variant='primary' onClick={() => navigate(`/app/dropzone?id=${imageDatad.FproductId}&title=${imageDatad.FproductTitle}`)}>Edit & See More Details</Button>
  <Form method='post'>
                                                <input type="hidden"  name="db-id" value={imageDatad.FproductId}/>
                                                <input type="hidden"  name="action" value='delete'/>
                                                <Button icon={DeleteIcon} variant="tertiary" size="micro" tone="critical" submit /></Form>
    </div>
   </td>
  
 
    </tr> 
            
       
))}
 </tbody>
 </table>
 
        </div>
      </Card>
    </Page>
  );
}

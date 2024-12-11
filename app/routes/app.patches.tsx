import { Box, Card, Layout, Page, Icon,Button, Frame,Modal,Scrollable,TextField,Spinner} from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunction , ActionFunctionArgs  } from '@remix-run/node';
import {useState, useCallback} from 'react';
import db from 'app/db.server';
import styles from 'app/routes/style/style.module.css';
import { EditIcon, DeleteIcon, PriceListFilledIcon, PlusIcon, XIcon} from '@shopify/polaris-icons'; 
import { Form } from '@remix-run/react';
import { FormField } from "app/routes/components/formfield";
import Uploadwidget from "app/routes/components/imageuploader";
import {SearchIcon } from '@shopify/polaris-icons';
import { authenticate, apiVersion, MONTHLY_PLAN } from "app/shopify.server";

interface Patches {
  id: string; 
  patchname: string;
  price: string;
  width: string;
  height: string;
  image: string;
  variant_id:string;
  product_id:string;
}
interface ProductData {
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  price: string;
  sku: string;
  image: string;
  tags: string[];
  height:string;
  width:string;
}


export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop, accessToken } = session;
  // Parse form data
  const formData = await request.formData();
  const action = formData.get('action')?.toString() ?? '';
  if(action === 'delete'){
    try { 
      const productId = formData.get('product-id')?.toString() ?? '';
      console.log('this is product id',productId)
      const response = await fetch(`https://${shop}/admin/api/${apiVersion}/products/${productId}.json`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken!
    },
      
  })
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
  
  return await delteToDatabase(formData);
    }catch (error) {
      console.error('Error deleting product:', error);
      return null;
    }
     
     
 
  }
  else{
    if (action === 'add') {
      // Add product
      console.log('add')
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
        const response = await fetch(`https://${shop}/admin/api/${apiVersion}/products.json`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": accessToken!
          },
          body: JSON.stringify({ product: productData})
      });
        if (!response.ok) {
          throw new Error('Failed to add product');
        }
    
        const responseData = await response.json();
       
        // Await and return the result of saveToDatabase
        return await saveToDatabase(formData, responseData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return json({ error: errorMessage }, { status: 500 });
      }
    } else if (action === 'edit') {
      console.log('edit')
      console.log(formData)
      const productId = formData.get('product-id')?.toString() ?? '';
      console.log('product ID',productId);
      const productData = {
        title: formData.get('title')?.toString() ?? '',
        // variants: [
        //   {
        //     price: formData.get('price')?.toString() ?? '',
        //   }
        // ],
        images: [
          {
            src: formData.get('image')?.toString() ?? ''
          }
        ]
      };
      console.log(productData)
      console.log(formData.get('image')?.toString() ?? '');
      try {
        // Shopify API call to add the product
        const response = await fetch(`https://${shop}/admin/api/${apiVersion}/products/${productId}.json`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": accessToken!
        },
          body: JSON.stringify({
            "product": {
                "title": productData.title,
                // "variants": [{
                //   "price" : productData.variants[0].price, // Access the price property correctly
                // }],
               "images" : [
                  {
                    src: formData.get('image')?.toString() ? formData.get('image')?.toString() : formData.get('alphabet-image')?.toString()
                  }
                ] // Pass the images array directly
            }
        })
          // body: JSON.stringify({ product: productData })
        });
    
        if (!response.ok) {
          throw new Error('Failed to edit product');
        }
    
        const responseData = await response.json();
        console.log('response data',responseData);
        // Await and return the result of saveToDatabase
        return await editToDatabase(formData, responseData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return json({ error: errorMessage }, { status: 500 });
      }
      
    } else {
      throw new Error('Invalid action');
    }
  }
 
  
 
}

async function delteToDatabase(formData: FormData) {
  const id = formData.get('db-id')?.toString() ?? '';
  console.log(id,'delete')
  try {
    const lolaPatches = await db.lolaPatches.delete({
      where: { id: id }
    });
    
    return { success: true, ImageData: lolaPatches };
  } catch (error) {
      console.error("Error deleted database:", error);
      // Handle error
      return null; // Return null if an error occurs
  }
}
async function editToDatabase(formData: FormData, responseData: any) {
  const variantId = responseData.product.variants[0].id?.toString() ?? '';
  const variantPrice = responseData.product.variants[0].price?.toString() ?? '';
  let productImage = '';
  if (responseData.product.images[0]) {
    productImage = responseData.product.images[0].src?.toString() ?? '';
  } else {
    productImage = formData.get('alphabet-image')?.toString() ?? '';
  }
  
  const patchName = formData.get('title')?.toString() ?? '';
  const patchheight = formData.get('patchHeight')?.toString() ?? '';
  const patchWidth = formData.get('patchWidth')?.toString() ?? '';
  const id = formData.get('db-id')?.toString() ?? '';
  // Adjust data object according to your Prisma schema
  const data = {
      image: productImage,
      variant_id: variantId,
      price: variantPrice,
      height: patchheight,
      width: patchWidth,
      patchname: patchName,
     
      // Add other properties from your Prisma schema here
  };

  try {
    console.log(id,'edit')
    const lolaPatches = await db.lolaPatches.update({
      where: { id: id },
      data
    });
    
    return { success: true, ImageData: lolaPatches };
  } catch (error) {
      console.error("Error updating database:", error);
      // Handle error
      return null; // Return null if an error occurs
  }
}

async function saveToDatabase(formData: FormData, responseData: any) {
  console.log(responseData);
  const variantId = responseData.product.variants[0].id?.toString() ?? '';
  const variantPrice = responseData.product.variants[0].price?.toString() ?? '';
  const productImage = responseData.product.images[0].src?.toString() ?? '';
  const productId = responseData.product.id?.toString() ?? '';
  const patchName = formData.get('title')?.toString() ?? '';
  const patchheight = formData.get('patchHeight')?.toString() ?? '';
  const patchWidth = formData.get('patchWidth')?.toString() ?? '';
  
  // Adjust data object according to your Prisma schema
  const data = {
      image: productImage,
      variant_id: variantId,
      price: variantPrice,
      height: patchheight,
      width: patchWidth,
      patchname: patchName,
      product_id:productId,
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
  const alphabets = await db.lolaPatches.findMany();
  return json(alphabets);
};


export default function AdditionalPage() {
  const [loading, setLoading] = useState(false); // Add loading state
  const [buttonloading, setbtnLoading] = useState(false); // Add loading state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState<{ [key: string]: boolean }>({});
  const editIsModalOpen = (id: string, isOpen: boolean) => {
    setEditModalOpen({ ...editModalOpen, [id]: isOpen });
  };
  const [deleteModalOpen, setDeleteModalOpen] = useState<{ [key: string]: boolean }>({});
  const deleteIsModalOpen = (id: string, isOpen: boolean) => {
    setDeleteModalOpen({ ...deleteModalOpen, [id]: isOpen });
  };
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
    tags: [],
    height:'',
    width:'',
  });
  

  // Specify type for alphabets
  const alphabets: Patches[] = useLoaderData();



  const handleCloseModal = (id: string) => {
    editIsModalOpen(id, false);
    // handleFormSubmit(); // Call handleSubmit function
  };

  const handleCloseDeleteModal = (id: string) => {
    deleteIsModalOpen(id, false);
  };


  
  const handleDelteSubmit = (id: string) =>{
    setbtnLoading(true);
    setTimeout(() => {  
      setbtnLoading(false);
      deleteIsModalOpen(id, false);
    },5000)
   
  }
  const handleEditSubmit = (id: string) =>{
    setbtnLoading(true);
    setTimeout(() => {  
      setbtnLoading(false);
      editIsModalOpen(id, false);
      setFormData({
        title: '',
        body_html: '',
        vendor: '',
        product_type: '',
        price: '',
        sku: '',
        image: '',
        tags: [],
        height:'',
        width:'',
      });
    },5000)

  }


  const handleDelteSubmitsearch = (id: string) =>{
    setbtnLoading(true);
    setTimeout(() => {  
      setbtnLoading(false);
      deleteIsModalOpen(id, false);
      handleSearch();
      setFormData({
        title: '',
        body_html: '',
        vendor: '',
        product_type: '',
        price: '',
        sku: '',
        image: '',
        tags: [],
        height:'',
        width:'',
      });
    },5000)
   
  }
  const handleEditSubmitsearch = (id: string) => {
    setbtnLoading(true);
    setTimeout(() => {  
      setbtnLoading(false);
      editIsModalOpen(id, false);
      handleSearch(); 
      setFormData({
        title: '',
        body_html: '',
        vendor: '',
        product_type: '',
        price: '',
        sku: '',
        image: '',
        tags: [],
        height:'',
        width:'',
      });
      // Call handleSearch after handleEditSubmitsearch completes
    }, 5000);
   
  }
  

  const handleFormSubmit = async () => {
   
    setbtnLoading(true);

    setTimeout(() => {
      // After successful submission or error handling, reset the loading state
      setbtnLoading(false);
      setFormData({
        title: '',
        body_html: '',
        vendor: '',
        product_type: '',
        price: '',
        sku: '',
        image: '',
        tags: [],
        height:'',
        width:'',
      });
      setIsModalOpen(false);
      setbtnLoading(false);
    }, 8000);
    
   

  };

  const closemodal = async () => {
    setFormData({
      title: '',
      body_html: '',
      vendor: '',
      product_type: '',
      price: '',
      sku: '',
      image: '',
      tags: [],
      height:'',
      width:'',
    });
    setIsModalOpen(false); 
  };
  //search-bar code
  const [inputValue, setInputValue] = useState('');
  const [products, setProducts] = useState<any[]>([]); // Initialize products with an empty array
  const [showNoDataMessage, setShowNoDataMessage] = useState<boolean>(false);
  const [inputValuee] = useState('');



  // const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   setInputValue(event.target.value);
  // };

  const handleInputChange = useCallback((value: string, id: string) => {
    setInputValue(value);
  }, []);

const handleSearch = async () => {
  console.log('handlesearch');
  setLoading(true);
  try {
    let url;
    if (inputValue !== '') {
      // If inputValue is not empty, perform search
      url = `/app/search-data?searchdata=${encodeURIComponent(inputValue)}`;
    } else {
      // If inputValue is empty, clear filters
      url = '/app/search-data';
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const responseData = await response.json();
    const productsData = responseData.patches || []; // Update to use 'patches' data
    setProducts(productsData);
    setLoading(false);
    // Show message only if inputValue is not empty and productsData is empty
    if (inputValue && productsData.length === 0) {
      setShowNoDataMessage(true);
    } else {
      setShowNoDataMessage(false);
    }
  } catch (error) {
    console.error('Error:', error);
    setLoading(false);
  }
};
const clearSearch = async () => {
  setLoading(true);
  setInputValue('');
  try {
    let url;
    if (inputValuee !== '') {
      // If inputValue is not empty, perform search
      url = `/app/search-data?searchdata=${encodeURIComponent(inputValue)}`;
    } else {
      // If inputValue is empty, clear filters
      url = '/app/search-data';
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const responseData = await response.json();
    const productsData = responseData.patches || []; // Update to use 'patches' data
    setProducts(productsData);
    setLoading(false);
    // Show message only if inputValue is not empty and productsData is empty
    if (inputValue && productsData.length === 0) {
      setShowNoDataMessage(false);
    } else {
      setShowNoDataMessage(false);
    }
   
  } catch (error) {
    console.error('Error:', error);
  }
};

  
   console.log("Products Array:", products);


  return (

    
    <Page>
      

      <ui-title-bar title="Patches" />



     


      <div className={styles.mainpatchwrapper}>
            <div className={styles.mainheading}>
              <h1>Patches</h1>
            </div>

  <div className={styles.framerapper}>
  <Button onClick={() => setIsModalOpen(true)}>Add Product</Button>
  {isModalOpen && (
        <div className={styles.addcustomproductmodal}>
      
          <div className={styles.addcustomproductmodalcontent}>
            <div className={styles.addcustomproductmodalheader}>
              <h2 className={styles.addcustomproductmodaltitle}>Enhance your inventory: Add patchesss along with their comprehensive details</h2>
            <span className="close" onClick={closemodal}><Button icon={XIcon} accessibilityLabel="Add theme" /></span>
            </div>
           
            <Scrollable  style={{ height: '86%', padding: '20px' }}>
            <Form method="post" onSubmit={handleFormSubmit}>
        <Uploadwidget onUploadSuccess={handleUploadSuccess} />
        
        {formData.image && <img src={formData.image} className={styles.patchproductimage} />}
        <input type="hidden" name="action" value="add"></input>
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
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <FormField
            htmlFor="sku"
            label="SKU"
            type="number"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          />
          <FormField
            htmlFor="tags"
            label="Tags"
            value={formData.tags.join(',')}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',') })}
           
          />
          <FormField
            htmlFor="patchHeight"
            label="Height"
            value={formData.height}
            onChange={(e) => setFormData({ ...formData, height: e.target.value})}
            type="number"
          />
          <FormField
            htmlFor="patchWidth"
            label="Width"
            value={formData.width}
            onChange={(e) => setFormData({ ...formData, width: e.target.value })}
            type="number"
          />
           <div className={styles.formbuttons}>
        {/* Display a spinner if loading is true, otherwise display the button */}
        {buttonloading ? (
          <Button loading>
           Submit
          </Button>
        ) : (
          <Button submit>Submit</Button>
        )}
      </div>
      

        </Form>
        </Scrollable>
          </div>
       
        </div>
      )}


      </div>


      </div>
      <Layout>
     <Layout.Section>
        
          <Card>

         <div className={styles.searchheader}>
<div className={styles.searchbar}>
<TextField
  label="Search Patches By Name"
  value={inputValue}
  onChange={handleInputChange}
  autoComplete="off"
  prefix={<Icon
    source={SearchIcon}
    tone="base"
  />} // Add the icon as a prefix
/>
</div>
        <div className={styles.searchbarButtons}>
        <Button onClick={handleSearch}>Search</Button>
          <Button onClick={clearSearch}>Clear</Button>
        </div>
          
         </div>
           
    {/* <Text as="h2" variant="bodyMd"> */}
   

      <div className={styles.allpatchesWrapper}>
      <div className={styles.patchsection}>
      <div className={styles.spinner}>
    {loading && <Spinner accessibilityLabel="Loading" size="small" />}
    </div>
        
  
    
    {showNoDataMessage && products.length === 0 && <p className="message-alert">No data found</p>}
   
  { loading || showNoDataMessage ?(
    null
  )  : (
    <>
    <table className={styles.patchestable}>
     
     <thead>
         <tr>
             <th>Product</th>
             <th>Price</th>
             <th>Dimensions</th>
             <th>Action</th>
         </tr>
         
     </thead>
      {products.length === 0 ? (
        alphabets.map((alphabet: Patches) => (
         
        
         
          
          <tbody>
          <tr key={alphabet.id} className={styles.patchparent}>
            <td>
            <div className={styles.pathimageaction}>
            <div className={styles.patchImageDiv}>
              <img src={alphabet.image} alt={alphabet.patchname} className={styles.patchImage} />
            </div>
            <p>{alphabet.patchname}</p>
          </div>
            </td>
           <td>{alphabet.price}</td>
            <td>{alphabet.width}x{alphabet.height}</td>
            <td>
            <div className={styles.actionbuttons}>
            <Button icon={EditIcon} size="micro" variant="tertiary" onClick={() => editIsModalOpen(alphabet.id, true)} />
            <Button icon={DeleteIcon} variant="tertiary" size="micro" tone="critical" onClick={() => deleteIsModalOpen (alphabet.id, true)}/>
            </div>
            </td>
            {deleteModalOpen[alphabet.id] && (
  <div className={styles.addcustomproductmodal}>
    <div className={`${styles.addcustomproductmodalcontent} ${styles.deletemodal}`}>
      <div className={`${styles.addcustomproductmodalheader} ${styles.editmodalheader}`}>
        <h2 className={styles.addcustomproductmodaltitle}>Delete Patch </h2>
        <span className="close" onClick={() => handleCloseDeleteModal(alphabet.id)}>
          <Button icon={XIcon} />
        </span>
      </div>
      <Scrollable style={{ height: '86%', padding: '20px' }}>
        <p>Are You sure to delete this Product?</p>
        <Form method="post"  onSubmit={() => handleDelteSubmit(alphabet.id)}>

          <input type="hidden" name="action" value="delete"></input>
          <input type="hidden" value={alphabet.id} name="db-id" />
          <input type="hidden" value={alphabet.product_id} name="product-id"/>
          <div className={styles.formbuttons}>
          {buttonloading ? (
          <Button loading  variant="primary" tone="critical">
           Confirm
          </Button>
        ) : (
          <Button submit variant="primary" tone="critical">Confirm</Button>
        )}
          </div>
  
        </Form>
      </Scrollable>
    </div>
  </div>
)}
            {editModalOpen[alphabet.id] && (
  <div className={styles.addcustomproductmodal}>
    <div className={styles.addcustomproductmodalcontent}>
      <div className={`${styles.addcustomproductmodalheader} ${styles.editmodalheader}`}>
        <h2 className={styles.addcustomproductmodaltitle}>Edit Patch Detail</h2>
        <span className="close" onClick={() => handleCloseModal(alphabet.id)}>
          <Button icon={XIcon} />
        </span>
      </div>
      <Scrollable style={{ height: '86%', padding: '20px' }}>
        <Form method="post"  onSubmit={() => handleEditSubmit(alphabet.id)}>
          <Uploadwidget onUploadSuccess={handleUploadSuccess} />
          {formData.image 
  ? <img src={formData.image} className={styles.patchproductimage}  />
  : <img src={alphabet.image} className={styles.patchproductimage} />
}

          <input type="hidden" name="action" value="edit"></input>
          <input type="hidden" value={alphabet.id} name="db-id" />
          <input type="hidden" value={formData.image} name="image" />
          <input type="hidden" value={alphabet.image} name="alphabet-image" />
          <input type="hidden" value={alphabet.product_id} name="product-id"/>
          {/* <img src={alphabet.image} className={styles.patchproductimage}></img> */}
          {/* Render form fields */}
          <FormField
            htmlFor="title"
            label="Title"
            value={formData.title || alphabet.patchname} 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <FormField
            htmlFor="patchHeight"
            label="Height"
            value={formData.height || alphabet.height}
            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            type="number"
          />
          <FormField
            htmlFor="patchWidth"
            label="Width"
            value={formData.width || alphabet.width}
            onChange={(e) => setFormData({ ...formData, width: e.target.value })}
            type="number"
          />
          <div className={styles.formbuttons}>
          {buttonloading ? (
          <Button loading>
           Edit
          </Button>
        ) : (
          <Button submit>Edit</Button>
        )}
          </div>
        </Form>
      </Scrollable>
    </div>
  </div>
)}

    
    
        </tr>
        </tbody>

        ))
        
      ): (
        products.map((product) => (
  
        
         
          
          <tbody>
          <tr key={product.id}>
                  <td>
            <div className={styles.pathimageaction}>
            <div className={styles.patchImageDiv}>
              <img src={product.image} alt={product.patchname} className={styles.patchImage} />
            </div>
            <p>{product.patchname}</p>
          </div>
            </td>
           <td>{product.price}</td>
            <td>{product.width}x{product.height}</td>
            <td>
            <div className={styles.actionbuttons}>
            <Button icon={EditIcon} size="micro" variant="tertiary" onClick={() => editIsModalOpen(product.id, true)} />
            <Button icon={DeleteIcon} variant="tertiary" size="micro" tone="critical" onClick={() => deleteIsModalOpen (product.id, true)}/>
            </div>
            </td>
            {deleteModalOpen[product.id] && (
  <div className={styles.addcustomproductmodal}>
    <div className={`${styles.addcustomproductmodalcontent} ${styles.deletemodal}`}>
      <div className={`${styles.addcustomproductmodalheader} ${styles.editmodalheader}`}>
        <h2 className={styles.addcustomproductmodaltitle}>Delete Patch </h2>
        <span className="close" onClick={() => handleCloseDeleteModal(product.id)}>
          <Button icon={XIcon} />
        </span>
      </div>
      <Scrollable style={{ height: '86%', padding: '20px' }}>
        <p>Are You sure to delete this Product?</p>
        <Form method="post"  onSubmit={() => handleDelteSubmitsearch(product.id)}>

          <input type="hidden" name="action" value="delete"></input>
          <input type="hidden" value={product.id} name="db-id" />
          <input type="hidden" value={product.product_id} name="product-id"/>
          <div className={styles.formbuttons}>
          {buttonloading ? (
          <Button loading  variant="primary" tone="critical">
           Confirm
          </Button>
        ) : (
          <Button submit variant="primary" tone="critical">Confirm</Button>
        )}
          </div>
        
        </Form>
      </Scrollable>
    </div>
  </div>
)}
            {editModalOpen[product.id] && (
  <div className={styles.addcustomproductmodal}>
    <div className={styles.addcustomproductmodalcontent}>
      <div className={`${styles.addcustomproductmodalheader} ${styles.editmodalheader}`}>
        <h2 className={styles.addcustomproductmodaltitle}>Edit Patch Detail</h2>
        <span className="close" onClick={() => handleCloseModal(product.id)}>
          <Button icon={XIcon} />
        </span>
      </div>
      <Scrollable style={{ height: '86%', padding: '20px' }}>
        <Form method="post"  onSubmit={() =>handleEditSubmitsearch(product.id)}>
          <Uploadwidget onUploadSuccess={handleUploadSuccess} />
          {formData.image 
  ? <img src={formData.image} className={styles.patchproductimage}  />
  : <img src={product.image} className={styles.patchproductimage} />
}

          <input type="hidden" name="action" value="edit"></input>
          <input type="hidden" value={product.id} name="db-id" />
          <input type="hidden" value={formData.image} name="image" />
          <input type="hidden" value={product.image} name="alphabet-image" />
          <input type="hidden" value={product.product_id} name="product-id"/>
          {/* <img src={alphabet.image} className={styles.patchproductimage}></img> */}
          {/* Render form fields */}
          <FormField
            htmlFor="title"
            label="Title"
            value={formData.title || product.patchname} 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <FormField
            htmlFor="patchHeight"
            label="Height"
            value={formData.height || product.height}
            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            type="number"
          />
          <FormField
            htmlFor="patchWidth"
            label="Width"
            value={formData.width || product.width}
            onChange={(e) => setFormData({ ...formData, width: e.target.value })}
            type="number"
          />
          <div className={styles.formbuttons}>
          {buttonloading ? (
          <Button loading>
           Edit
          </Button>
        ) : (
          <Button submit>Edit</Button>
        )}
          </div>
        </Form>
      </Scrollable>
    </div>
  </div>
)}

        </tr>
        </tbody>

        ))
      )}
      </table> 
    </>
  )}
    


</div>

            </div>
      {/* </Text> */}
    </Card>
      
       
        </Layout.Section>
      </Layout>
    </Page>
  );
}














































// function Code({ children }: { children: React.ReactNode }) {
//   return (
//     <Box
//       as="span"
//       padding="025"
//       paddingInlineStart="100"
//       paddingInlineEnd="100"
//       background="bg-surface-active"
//       borderWidth="025"
//       borderColor="border"
//       borderRadius="100"
//     >
//       <code>{children}</code>
//     </Box>
//   );
// }

{/* <Link to="/app/my">
<Button accessibilityLabel="Add variant" icon={PlusIcon}>
  Add Patches
</Button>

</Link> */}
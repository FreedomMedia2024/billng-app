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
  fontName: string;
  fontTitle : string;
  Category : string;
  Value: String;
  FeatureImagefont : string;
  // image: string;
  // alphabetname:  string;
  // product_id:  string;
}
interface ProductData {
  fontName: string;
  fontTitle: string;
  Category: string;
  Value: String;
  FeatureImagefont : string;
//   price: string;
//   sku: string;
//   image: string;
//   tags: string[];
//   height:string;
//   width:string;
}


export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const { shop, accessToken } = session;
  // Parse form data
  const formData = await request.formData();
  const action = formData.get('action')?.toString() ?? '';
  if(action === 'delete'){
 
    const id = formData.get('db-id')?.toString() ?? '';

    try {
      const fonts = await db.fonts.delete({
        where: { id: id }
      });
      
      return { success: true, fonts: fonts };
    } catch (error) {
        console.error("Error deleted database:", error);
        // Handle error
        return null; // Return null if an error occurs
    }
 
  }
  else{
    if (action === 'add') {
      // Add product
      console.log('add')
      const data = {
        fontName: formData.get('fontfamily')?.toString() ?? '',
        fontTitle: formData.get('fonttitle')?.toString() ?? '',
        Value: formData.get('fontcurrentvalue')?.toString() ?? '',
        Category: formData.get('fontcategory')?.toString() ?? '',
        FeatureImagefont: formData.get('fontimage')?.toString() ?? '',
        // Add other properties from your Prisma schema here
    };

    try {
        const fonts = await db.fonts.create({
            data,
            // If you have a select option, provide it here
        });
        return json({ success: true, fontsData: fonts });
    } catch (error) {
        console.error("Error saving data to database:", error);
        return json({ success: false, error: error }); // Return error message
    }
    
    
    } else if (action === 'edit') {
           // Add product
      console.log('edit')
      const id = formData.get('db-id')?.toString() ?? '';
      const data = {
        fontName: formData.get('fontStyle')?.toString() ?? '',
        fontTitle: formData.get('fonttitle')?.toString() ?? '',
        Value: formData.get('fontcurrentvalue')?.toString() ?? '',
        Category: formData.get('fontCat')?.toString() ?? '',
        FeatureImagefont: formData.get('FeatureImagefont')?.toString() ?? '',
     
        // Add other properties from your Prisma schema here
    };

    try {
        const fonts = await db.fonts.update({
          where: { id: id },
          data
        });    
        return json({ success: true, fontsData: fonts });
    } catch (error) {
        console.error("Error saving data to database:", error);
        return json({ success: false, error: error }); // Return error message
    }
    } else {
      throw new Error('Invalid action');
    }
  }
 
  
 
}

// async function delteToDatabase(formData: FormData) {
//   const id = formData.get('db-id')?.toString() ?? '';

//   try {
//     const lolaAlphabets = await db.lolaAlphabets.delete({
//       where: { id: id }
//     });
    
//     return { success: true, ImageData: lolaAlphabets };
//   } catch (error) {
//       console.error("Error deleted database:", error);
//       // Handle error
//       return null; // Return null if an error occurs
//   }
// }








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
  const fonts = await db.fonts.findMany();
  return json(fonts);
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
    setFormData(form => ({ ...form, FeatureImagefont: url }));
    
};
  // State to hold form data
  const [formData, setFormData] = useState<ProductData>({
    fontName: '',
    fontTitle: '',
    Category: '',
    Value:'',
    FeatureImagefont: '',

  });
  

  // Specify type for alphabets
  const fonts: Patches[] = useLoaderData();



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
     fontName: '',
    fontTitle: '',
    Category: '',
    Value:'',
    FeatureImagefont: '',
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
        fontName: '',
        fontTitle: '',
        Category: '',
        Value:'',
        FeatureImagefont: '',
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
        fontName: '',
        fontTitle: '',
        Category: '',
        Value:'',
        FeatureImagefont: '',
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
        fontName: '',
        fontTitle: '',
        Category: '',
        Value:'',
        FeatureImagefont: '',
      });
      setIsModalOpen(false);
      setbtnLoading(false);
    }, 8000);
    
   

  };

  const closemodal = async () => {
    setFormData({
    fontName: '',
    fontTitle: '',
    Category: '',
    Value:'',
    FeatureImagefont: '',
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
      url = `/app/alphabets-search-data?searchdata=${encodeURIComponent(inputValue)}`;
    } else {
      // If inputValue is empty, clear filters
      url = '/app/alphabets-search-data';
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
      url = `/app/alphabets-search-data?searchdata=${encodeURIComponent(inputValue)}`;
    } else {
      // If inputValue is empty, clear filters
      url = '/app/alphabets-search-data';
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
      

      <ui-title-bar title="Alphabets" />



     


      <div className={styles.mainpatchwrapper}>
            <div className={styles.mainheading}>
              <h1>Embroidery Fonts</h1>
            </div>

  <div className={styles.framerapper}>
  <Button onClick={() => setIsModalOpen(true)}>Add Font</Button>
  {isModalOpen && (
        <div className={styles.addcustomproductmodal}>
      
          <div className={styles.addcustomproductmodalcontent}>
            <div className={styles.addcustomproductmodalheader}>
              <h2 className={styles.addcustomproductmodaltitle}>Enhance your inventory: Add patches along with their comprehensive details</h2>
            <span className="close" onClick={closemodal}><Button icon={XIcon} accessibilityLabel="Add theme" /></span>
            </div>
           
            <Scrollable  style={{ height: '86%', padding: '20px' }}>
            <Form method="post" onSubmit={handleFormSubmit}>
        <Uploadwidget onUploadSuccess={handleUploadSuccess} />
        
        {formData.FeatureImagefont && <img src={formData.FeatureImagefont} className={styles.patchproductimage} />}
        <input type="hidden" name="action" value="add"></input>
        {/* value={formData.FeatureImagefont || ''} */}
        <input type="hidden"   name="fontimage" value={formData.FeatureImagefont}/>
          {/* Render form fields */}
          <FormField
            htmlFor="fonttitle"
            label="Font Title"
            value={formData.fontTitle}
            onChange={(e) => setFormData({ ...formData, fontTitle: e.target.value })}
          />
          <FormField
            htmlFor="fontfamily"
            label="Font Famiy"
            value={formData.fontName }
            onChange={(e) => setFormData({ ...formData, fontName : e.target.value })}
          />
          <FormField
            htmlFor="fontcurrentvalue"
            label="Font Current Value"
            value={formData.Value }
            onChange={(e) => setFormData({ ...formData, Value : e.target.value })}
          />
          <FormField
            htmlFor="fontcategory"
            label="Font Category"
            value={formData.Category }
            onChange={(e) => setFormData({ ...formData, Category : e.target.value })}
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
             <th>Font Title</th>
             <th>Font Style</th>
             <th>Font Current Value</th>
             <th>Font Category</th>
             <th>Font Feature Image</th>
             <th>Actions</th>
         </tr>
         
     </thead>
      {products.length === 0 ? (
        fonts.map((fonts: Patches) => (
         
        
         
          
          <tbody>
          <tr key={fonts.id} className={styles.patchparent}>
            <td>
            <div className={styles.pathimageaction}>
            <p>{fonts.fontTitle}</p>
          </div>
            </td>
            <td>{fonts.fontName }</td>
            <td>{fonts.Value }</td>
           <td>{fonts.Category }</td>
            <td>  <div className={styles.patchImageDiv}>
              <img src={fonts.FeatureImagefont}  className={styles.patchImage} />
            </div></td>
            <td>
            <div className={styles.actionbuttons}>
            <Button icon={EditIcon} size="micro" variant="tertiary" onClick={() => editIsModalOpen(fonts.id, true)} />
            <Button icon={DeleteIcon} variant="tertiary" size="micro" tone="critical" onClick={() => deleteIsModalOpen (fonts.id, true)}/>
            </div>
            </td>
            {deleteModalOpen[fonts.id] && (
  <div className={styles.addcustomproductmodal}>
    <div className={`${styles.addcustomproductmodalcontent} ${styles.deletemodal}`}>
      <div className={`${styles.addcustomproductmodalheader} ${styles.editmodalheader}`}>
        <h2 className={styles.addcustomproductmodaltitle}>Delete Patch </h2>
        <span className="close" onClick={() => handleCloseDeleteModal(fonts.id)}>
          <Button icon={XIcon} />
        </span>
      </div>
      <Scrollable style={{ height: '86%', padding: '20px' }}>
        <p>Are You sure to delete this Product?</p>
        <Form method="post"  onSubmit={() => handleDelteSubmit(fonts.id)}>

          <input type="hidden" name="action" value="delete"></input>
          <input type="hidden" value={fonts.id} name="db-id" />
          {/* <input type="hidden" value={fonts.product_id} name="product-id"/> */}
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
            {editModalOpen[fonts.id] && (
  <div className={styles.addcustomproductmodal}>
    <div className={styles.addcustomproductmodalcontent}>
      <div className={`${styles.addcustomproductmodalheader} ${styles.editmodalheader}`}>
        <h2 className={styles.addcustomproductmodaltitle}>Edit Font Detail</h2>
        <span className="close" onClick={() => handleCloseModal(fonts.id)}>
          <Button icon={XIcon} />
        </span>
      </div>
      <Scrollable style={{ height: '86%', padding: '20px' }}>
        <Form method="post"  onSubmit={() => handleEditSubmit(fonts.id)}>
          <Uploadwidget onUploadSuccess={handleUploadSuccess} />
          {formData.FeatureImagefont 
  ? <img src={formData.FeatureImagefont} className={styles.patchproductimage}  />
  : <img src={fonts.FeatureImagefont} className={styles.patchproductimage} />
}

          <input type="hidden" name="action" value="edit"></input>
          <input type="hidden" value={fonts.id} name="db-id" />
          <input type="hidden" value={formData.FeatureImagefont} name="featureImagefont" />
          <input type="hidden" value={fonts.FeatureImagefont} name="featureImagefont" />
          {/* <input type="hidden" value={fonts.product_id} name="product-id"/> */}
          {/* <img src={alphabet.image} className={styles.patchproductimage}></img> */}
          {/* Render form fields */}
          <FormField
            htmlFor="fonttitle"
            label="Font Title"
            value={formData.fontTitle  || fonts.fontTitle} 
            onChange={(e) => setFormData({ ...formData, fontTitle: e.target.value })}
          />
          <FormField
            htmlFor="fontStyle"
            label="Font Style"
            value={formData.fontName || fonts.fontName }
            onChange={(e) => setFormData({ ...formData, fontName: e.target.value })}
           
          />
          <FormField
            htmlFor="fontcurrentvalue"
            label="Font Current Value"
            value={formData.Value   || fonts.Value}
            onChange={(e) => setFormData({ ...formData, Value  : e.target.value })}
          />
          <FormField
            htmlFor="fontCat"
            label="Category"
            value={formData.Category   || fonts.Category}
            onChange={(e) => setFormData({ ...formData, Category  : e.target.value })}
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
            <p>{product.alphabetname}</p>
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
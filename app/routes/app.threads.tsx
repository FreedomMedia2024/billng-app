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
import { ColorPicker } from '@shopify/polaris';
import dropzone from 'app/routes/style/dropzone.module.css';
import { authenticate, apiVersion, MONTHLY_PLAN } from "app/shopify.server";
interface Patches {
    id: string;
    ColorName : string;
    ColorTitle : string;
}
interface ProductData {
  ColorName : string;
  ColorTitle : string;
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
      const fonts = await db.threadsColor.delete({
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
        ColorName: formData.get('variant-color')?.toString() ?? '',
        ColorTitle : formData.get('colortitle')?.toString() ?? '',
        // Add other properties from your Prisma schema here
    };

    try {
        const fonts = await db.threadsColor.create({
            data,
            // If you have a select option, provide it here
        });
        return json({ success: true, fontsData: fonts });
    } catch (error) {
        console.error("Error saving data to database:", error);
        return json({ success: false, error: error }); // Return error message
    }
    
    
    }
 else {
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
  const fonts = await db.threadsColor.findMany();
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
    setFormData(form => ({ ...form, image: url }));
    
};
  // State to hold form data
  const [formData, setFormData] = useState<ProductData>({
    ColorName: '',
    ColorTitle: '',
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
        ColorName: '',
     ColorTitle: ''
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
    ColorName: '',
     ColorTitle: ''
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
     ColorName: '',
     ColorTitle: ''
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
     ColorName: '',
     ColorTitle: ''
      });
      setIsModalOpen(false);
      setbtnLoading(false);
    }, 8000);
    
   

  };

  const closemodal = async () => {
    setFormData({
    ColorName: '',
     ColorTitle: ''
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
   const [color, setColor] = useState({
    hue: 120,
    brightness: 1,
    saturation: 1,
});
function hsbToRgb(hue: number, saturation: number, brightness: number) {
    let chroma = brightness * saturation;
    let hue1 = hue / 60;
    let x = chroma * (1 - Math.abs((hue1 % 2) - 1));
    let r1, g1, b1;

    if (hue1 >= 0 && hue1 < 1) {
        [r1, g1, b1] = [chroma, x, 0];
    } else if (hue1 >= 1 && hue1 < 2) {
        [r1, g1, b1] = [x, chroma, 0];
    } else if (hue1 >= 2 && hue1 < 3) {
        [r1, g1, b1] = [0, chroma, x];
    } else if (hue1 >= 3 && hue1 < 4) {
        [r1, g1, b1] = [0, x, chroma];
    } else if (hue1 >= 4 && hue1 < 5) {
        [r1, g1, b1] = [x, 0, chroma];
    } else {
        [r1, g1, b1] = [chroma, 0, x];
    }

    let m = brightness - chroma;
    let [r, g, b] = [r1 + m, g1 + m, b1 + m];

    // Scale RGB values to [0, 255] range
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

const [R, G, B] = hsbToRgb(color.hue, color.saturation, color.brightness);
const A = 1; // Assuming alpha value is 1, you can modify this as needed

const rgbaColor = `rgba(${R}, ${G}, ${B}, ${A})`;

// Define styles for the color preview box
const colorPreviewStyle = {
    width: '60px',
    height: '30px',
    backgroundColor: rgbaColor,
};


  return (

    
    <Page>
      

      <ui-title-bar title="Threads Color" />



     


      <div className={styles.mainpatchwrapper}>
            <div className={styles.mainheading}>
              <h1>Threads Color</h1>
            </div>

  <div className={styles.framerapper}>
  <Button onClick={() => setIsModalOpen(true)}>Add Thread Color</Button>
  {isModalOpen && (
        <div className={styles.addcustomproductmodal}>
      
          <div className={styles.addcustomproductmodalcontent}>
            <div className={styles.addcustomproductmodalheader}>
              <h2 className={styles.addcustomproductmodaltitle}>Add The Thread Colors</h2>
            <span className="close" onClick={closemodal}><Button icon={XIcon} accessibilityLabel="Add theme" /></span>
            </div>
           
            <Scrollable  style={{ height: '86%', padding: '20px' }}>
            <Form method="post" onSubmit={handleFormSubmit}>
        <input type="hidden" name="action" value="add"></input>
        {/* value={formData.FeatureImagefont || ''} */}
        <div className={`${dropzone.colorvariantscolorpicker}`}>
            <ColorPicker onChange={setColor} color={color} />
         </div>
         <div className={`${dropzone.btnlable}`}>Button Color</div>
                                    <div style={colorPreviewStyle} className={`${dropzone.colorvariantswrapper}`}></div>
                                    
    <input type="hidden" value={rgbaColor} name="variant-color" />
          {/* Render form fields */}
          <FormField
            htmlFor="colortitle"
            label="Color Title"
            value={formData.ColorTitle}
            onChange={(e) => setFormData({ ...formData, ColorTitle: e.target.value })}
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
             <th>Color Title</th>
             <th>Color Value</th>
             <th>Actions</th>
         </tr>
         
     </thead>
      {products.length === 0 ? (
        fonts.map((fonts: Patches) => (
         
        
         
          
          <tbody>
          <tr key={fonts.id} className={styles.patchparent}>
            <td>
            <div className={styles.pathimageaction}>
            <p>{fonts.ColorTitle}</p>
          </div>
            </td>
            <td>{fonts.ColorName }
            </td>
            <td>
            <div className={styles.actionbuttons}>
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
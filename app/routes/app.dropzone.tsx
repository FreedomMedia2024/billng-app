import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from "@remix-run/react";
import { useState,useEffect } from 'react';
import { Link} from "@remix-run/react";
import Uploadwidget from "app/routes/components/imageuploader";
import dropzone from 'app/routes/style/dropzone.module.css';
import { Form } from '@remix-run/react';
import type { ActionFunctionArgs } from "@remix-run/node";
import db from "app/db.server";
import { useCallback } from "react";
import { Toast,Card, Page, RangeSlider, Button, Frame,Scrollable } from "@shopify/polaris";
//import { Integer } from 'aws-sdk/clients/apigateway';
import { ColorPicker } from '@shopify/polaris';
import { DeleteIcon,EditIcon,XIcon } from '@shopify/polaris-icons';
import { Icon } from '@shopify/polaris';
import { FormField } from "app/routes/components/formfield";
import styles from 'app/routes/style/style.module.css';
import {
    ToggleOffIcon
  } from '@shopify/polaris-icons';
// Define a type for the data with optional chaining handling
interface ProductData {
    id?: string;
    title: string;
    FrontImgData: any;
    ColorVariants: any;
    SizeVariants:any;
    embImgData:any;
}

interface ImgaeData {
    id: string;
    file: string;
}
interface ColorVariants {
    productId: string;
    file: string;
    backfile:string;
}
interface ColorVariant {
    colorvariant_id: string;
    Variants: string;
    productImg: string;
    id:string;
    backImg :string;
}
interface SizeVariant {
    id:string;
    sizevariant_id: string;
    Smalll: string;
    Medium: string;
    Large:string;
    Extra_Large :string;
}
interface FrontImgDataItem {
    id: string;
    title: string;
    FproductId: string;
    FproductTitle: string;
    FProductImg: string;
    FHeight: string;
    FWidth: string;
    FTop: string;
    FLeft: string;
    Backimg:string;
    BHeight: string;
    BWidth: string;
    BTop: string;
    BLeft: string;
    // Add any other properties if necessary
}
interface embImgData {
    id: string;
    FproductId: string;
    FproductTitle: string;
    FProductImg: string;
    FHeight: string;
    FWidth: string;
    FTop: string;
    FLeft: string;
    BHeight: string;
    BWidth: string;
    BTop: string;
    BLeft: string;
    Backimg:string;
    FRAHeight:string
    FRAWidth: string
    FRATop:   string
    FRALeft:  string
    FLAHeight:string
    FLAWidth: string
    FLATop:   string
    FLALeft:  string
    BRAWidth: string
    BRATop:   string
    BRALeft:  string
    BLAHeight:string
    BLAWidth: string
    BLATop:   string
    BLALeft:  string
    // Add any other properties if necessary
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    console.log('cureent Form Data',formData)
    if (formData.get('action') === "delete") {
        console.log('delete');
        const id = formData.get('db-id')?.toString() ?? '';
        console.log(id);
        await db.colorVariants.delete({
            where: {
                colorvariant_id: id
            }
        });
        return { success: true };
    }
    else if (formData.get('action') === "editSize"){
        console.log('Edit SIZEEEE')
        console.log(formData);
        const id = formData.get('db-id')?.toString() ?? '';
        const small = formData.get('small')?.toString() ?? 'false';
        const medium= formData.get('medium')?.toString() ?? 'false';
        const large = formData.get('large')?.toString() ?? 'false';
        const extra_large = formData.get('extra_large')?.toString() ?? 'false';
        console.log(id);
        await db.sizeVariants.update({
            where: {
                sizevariant_id: id
            },
            data: {
                Smalll: small,
                Medium: medium,
                Large:large,
                Extra_Large:extra_large
}
        });
        return { success: true };
    }
    else if (formData.get('action') === "edit") {
        const id = formData.get('db-id')?.toString() ?? '';
        const colorvariants = formData.get('color-variant')?.toString() ?? '';
        console.log(id);
        await db.colorVariants.update({
            where: {
                colorvariant_id: id
            },
            data: {
                Variants: colorvariants
            }
        });
        return { success: true };
    }
    else if (formData.get('action') === "color") {
        const productId = formData.get('productId')?.toString() ?? '';
        const colorvariant = formData.get('variant-color')?.toString() ?? '';
        const VariantImg = formData.get('image')?.toString() ?? '';
        const BackImg = formData.get('backimage')?.toString() ?? '';
        const colorname = formData.get('colorname')?.toString() ?? '';
        const data = {
            id: productId,
            productImg: VariantImg,
            Variants: colorvariant,
            backImg: BackImg,
            colorname:colorname
        };

        try {
            const ColorVariants = await db.colorVariants.create({
                data
            });
            return json({ success: true, ImageData: ColorVariants });
        } catch (error) {
            console.error("Error saving data to database:", error);
            return { success: false, error: "Failed to save data" };
        }
    }
    
    else if (formData.get('action') === "embaction"){
        console.log('emb hy yeah janu');
        const id = formData.get('db-id')?.toString() ?? '';
        const FproductId = formData.get('FproductId')?.toString() ?? '';
        const FproductTitle = formData.get('FproductName')?.toString() ?? '';
        const FProductImg = formData.get('file')?.toString() ?? '';
        const FHeight = formData.get('FHeight')?.toString() ?? '';
        const FWidth = formData.get('FWidth')?.toString() ?? '';
        const FTop = formData.get('FTop')?.toString() ?? '';
        const FLeft = formData.get('FLeft')?.toString() ?? '';
        const BHeight = formData.get('BHeight')?.toString() ?? '';
        const BWidth = formData.get('BWidth')?.toString() ?? '';
        const BTop = formData.get('BTop')?.toString() ?? '';
        const BLeft = formData.get('BLeft')?.toString() ?? '';
        const BackImg = formData.get('backimage')?.toString() ?? '';


        const FRAHeight = formData.get('FRAHeight')?.toString() ?? '';
        const FRAWidth = formData.get('FRAWidth')?.toString() ?? '';
        const FRATop = formData.get('FRATop')?.toString() ?? '';
        const FRALeft = formData.get('FRALeft')?.toString() ?? '';
        const FLAHeight = formData.get('FLAHeight')?.toString() ?? '';
        const FLAWidth = formData.get('FLAWidth')?.toString() ?? '';
        const FLATop = formData.get('FLATop')?.toString() ?? '';
        const FLALeft = formData.get('FLALeft')?.toString() ?? '';

        const BRAHeight = formData.get('BRAHeight')?.toString() ?? '';
        const BRAWidth = formData.get('BRAWidth')?.toString() ?? '';
        const BRATop = formData.get('BRATop')?.toString() ?? '';
        const BRALeft = formData.get('BRALeft')?.toString() ?? '';
        const BLAHeight = formData.get('BLAHeight')?.toString() ?? '';
        const BLAWidth = formData.get('BLAWidth')?.toString() ?? '';
        const BLATop = formData.get('BLATop')?.toString() ?? '';
        const BLALeft = formData.get('BLALeft')?.toString() ?? '';
   
      
        let savedembImgData;
      
        if (id !== "") {
            console.log('id is not empty')
                  // Update existing record
                  savedembImgData = await db.embImgData.update({
                    where: {
                        id: id
                    },
                    data: {
                    FproductId: FproductId,
                    FproductTitle: FproductTitle,
                    FProductImg: FProductImg,
                    FHeight: FHeight,
                    FWidth: FWidth,
                    FTop: FTop,
                    FLeft: FLeft,
                    BHeight: BHeight,
                    BWidth: BWidth,
                    BTop: BTop,
                    BLeft: BLeft,
                    Backimg: BackImg,
                    FRAHeight:FRAHeight,
                    FRAWidth: FRAWidth,
                    FRATop:FRATop,
                    FRALeft:FRALeft,
                    FLAHeight:FLAHeight, 
                    FLAWidth: FLAWidth,
                    FLATop:FLATop,
                    FLALeft:FLALeft,
                    BRAHeight:BRAHeight, 
                    BRAWidth:BRAWidth, 
                    BRATop:BRATop,
                    BRALeft:BRALeft,
                    BLAHeight: BLAHeight,
                    BLAWidth:  BLAWidth,
                    BLATop:BLATop,
                    BLALeft: BLALeft
                    }
                });
          
        } else {
            console.log('yes')
            // Create new record
            savedembImgData = await db.embImgData.create({
                data: {
                    FproductId: FproductId,
                    FproductTitle: FproductTitle,
                    FProductImg: FProductImg,
                    FHeight: FHeight,
                    FWidth: FWidth,
                    FTop: FTop,
                    FLeft: FLeft,
                    BHeight: BHeight,
                    BWidth: BWidth,
                    BTop: BTop,
                    BLeft: BLeft,
                    Backimg: BackImg,
                    FRAHeight:FRAHeight,
                    FRAWidth: FRAWidth,
                    FRATop:FRATop,
                    FRALeft:FRALeft,
                    FLAHeight:FLAHeight, 
                    FLAWidth: FLAWidth,
                    FLATop:FLATop,
                    FLALeft:FLALeft,
                    BRAHeight:BRAHeight, 
                    BRAWidth:BRAWidth, 
                    BRATop:BRATop,
                    BRALeft:BRALeft,
                    BLAHeight: BLAHeight,
                    BLAWidth:  BLAWidth,
                    BLATop:BLATop,
                    BLALeft: BLALeft
                }
            });
      
        }
        return json({ success: true, embdatasaaved:'emb data saaved' });
    }
    else {
        console.log('img hy yeah janu');
        const id = formData.get('db-id')?.toString() ?? '';
        const FproductId = formData.get('FproductId')?.toString() ?? '';
        const FproductTitle = formData.get('FproductName')?.toString() ?? '';
        const FProductImg = formData.get('file')?.toString() ?? '';
        const FHeight = formData.get('FHeight')?.toString() ?? '';
        const FWidth = formData.get('FWidth')?.toString() ?? '';
        const FTop = formData.get('FTop')?.toString() ?? '';
        const FLeft = formData.get('FLeft')?.toString() ?? '';
        const BHeight = formData.get('BHeight')?.toString() ?? '';
        const BWidth = formData.get('BWidth')?.toString() ?? '';
        const BTop = formData.get('BTop')?.toString() ?? '';
        const BLeft = formData.get('BLeft')?.toString() ?? '';
        const colorvariant = formData.get('variant-color')?.toString() ?? '';
        const BackImg = formData.get('backimage')?.toString() ?? '';
        const small = formData.get('small')?.toString() ?? 'false';
        const medium = formData.get('medium')?.toString() ?? 'false';
        const large = formData.get('large')?.toString() ?? 'false';
        const extralarge = formData.get('extra_large')?.toString() ?? 'false';
        const colorname = formData.get('colorname')?.toString() ?? '';

        // Check if any required fields are empty
        if (!FProductImg || !FHeight || !FWidth || !FTop || !FLeft) {
            return json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        try {
            let savedImageData;
            let colorVariantData;
            let sizeVariantData;

            if (id !== "") {
                console.log('id is not empty')
                      // Update existing record
                      savedImageData = await db.frontImgData.update({
                        where: {
                            id: id
                        },
                        data: {
                            FproductTitle: FproductTitle,
                            FProductImg: FProductImg,
                            FHeight: FHeight,
                            FWidth: FWidth,
                            FTop: FTop,
                            FLeft: FLeft,
                            BHeight: BHeight,
                            BWidth: BWidth,
                            BTop: BTop,
                            BLeft: BLeft,
                            Backimg: BackImg
                        }
                    });
                    // colorVariantData = await db.colorVariants.update({
                    //     where: {
                    //         id: FproductId // Now productId can be used as it's unique
                    //     },
                    //     data: {
                    //         Variants: colorvariant,
                    //     }
                    // });
              
            } else {
                console.log('yes')
                // Create new record
                savedImageData = await db.frontImgData.create({
                    data: {
                        FproductId: FproductId,
                        FproductTitle: FproductTitle,
                        FProductImg: FProductImg,
                        FHeight: FHeight,
                        FWidth: FWidth,
                        FTop: FTop,
                        FLeft: FLeft,
                        BHeight: BHeight,
                        BWidth: BWidth,
                        BTop: BTop,
                        BLeft: BLeft,
                        Backimg: BackImg
                    }
                });
                colorVariantData = await db.colorVariants.create({
                    data: {
                        id : FproductId,
                        productImg: FProductImg,
                        Variants: colorvariant,
                        backImg: BackImg,
                        colorname:colorname
                    }
                });
                sizeVariantData = await db.sizeVariants.create({
                    data: {
                        id : FproductId,
                        Smalll : small,
                        Large: medium,
                        Medium: large,
                        Extra_Large : extralarge,
                    }
                });
            }
            console.log(savedImageData);
            return json({ success: true, ImageData: savedImageData, ColorVariant: colorVariantData });
        } catch (error) {
            console.error("Failed to save ImageDATA data:", error);
            return json({ success: false, error: "Failed to save data" }, { status: 500 });
        }
    }
}






// Define a loader function to fetch data
export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);
    const title = params.get('title');
    const id = params.get('id');


    if (!id) {
        return json({ error: "Missing ID parameter" }, { status: 400 });
    }

    try {
        // Fetch the product data
        const FrontImgData = await db.frontImgData.findMany({
            where: {
                FproductId: id
            }

        });
        const ColorVariants = await db.colorVariants.findMany({
            where: {
                id : id
            }
        });
        const SizeVariants = await db.sizeVariants.findMany({
            where: {
                id : id
            }
        })
        const embImgData = await db.embImgData.findMany({
            where: {
                FproductId: id
            }
        })
        return json({ id, title, FrontImgData, ColorVariants, SizeVariants,embImgData });
    }

    catch (error) {
        console.error("Error fetching data:", error);
        return json({ error: "Failed to fetch data" }, { status: 500 });
    }
};

// Exporting MyComponent as default
export default function MyComponent() {

    const [editModalOpen, setEditModalOpen] = useState<{ [key: string]: boolean }>({});
  const editIsModalOpen = (id: string, isOpen: boolean) => {
    setEditModalOpen({ ...editModalOpen, [id]: isOpen });
  };
  const handleCloseModal = (id: string) => {
    editIsModalOpen(id, false);
    // handleFormSubmit(); // Call handleSubmit function
  };

    const [active, setActive] = useState(false);

    const toggleActive = useCallback(() => setActive((active) => !active), []);
  
    const toastMarkup = active ? (
      <Toast content="Added" onDismiss={toggleActive} duration={4500} />
    ) : null;
    const handleUploadSuccess = (url: string) => {
        setFormState(form => ({ ...form, file: url }));

    };
    const handleBUploadSuccess = (url: string) => {

        setBFormState(form => ({ ...form, file: url }));
    };


    const embhandleUploadSuccess = (url: string) => {
        emsetFormState(form => ({ ...form, file: url }));

    };
    const embhandleBUploadSuccess = (url: string) => {

        embsetBFormState(form => ({ ...form, file: url }));
    };


    const { id, title, FrontImgData, ColorVariants,SizeVariants, embImgData } = useLoaderData<ProductData>();

   
    

    const [sizeAvailability, setSizeAvailability] = useState({
        small: 'true',
        medium: 'true',
        large: 'true',
        extra_large:'true',
        // Add more sizes as needed
    });

    const toggleSizeAvailability = (size: keyof typeof sizeAvailability) => {
        setSizeAvailability({
            ...sizeAvailability,
            [size]: sizeAvailability[size] === 'true' ? 'false' : 'true'
        });
    };

    const [sizefalseAvailability, setSizefalseAvailability] = useState({
        small: 'false',
        medium: 'false',
        large: 'false',
        extra_large:'false',
        // Add more sizes as needed
    });

    const toggleSizefalseAvailability = (size: keyof typeof sizefalseAvailability) => {
        setSizefalseAvailability({
            ...sizefalseAvailability,
            [size]: sizefalseAvailability[size] === 'true' ? 'false' : 'true'
        });
    };
    
    
    console.log('thi is')
 

    const [formColorState, setFormColorState] = useState<ColorVariants>({
        productId: id || '', // Initialize productId with an empty string
        file: '', // Initialize file with an empty string
        backfile:'',
    });

    const handleColorVariantUploadSuccess = (url: string) => {
        setFormColorState(prevState => ({ ...prevState, file: url }));
    };
    const handlebackColorVariantUploadSuccess = (url: string) => {
        setFormColorState(prevState => ({ ...prevState, backfile: url }));
    };

    //Front values
    const frontImgDataExists = FrontImgData && FrontImgData.length > 0;

    // Filter front and back items
    const frontItems: FrontImgDataItem[] = frontImgDataExists ? FrontImgData : [];
   
    

    // Get the first front item, or null if there are none
    const frontImgDataFirstItem = frontItems.length > 0 ? frontItems[0] : null;


    const [formState, setFormState] = useState<ImgaeData>({
        id: frontImgDataFirstItem?.id ?? '', // Access id property and ensure it's a string
    file: frontImgDataFirstItem ? frontImgDataFirstItem.FProductImg : ''
    });
    

    const [BformState, setBFormState] = useState<ImgaeData>({   id: frontImgDataFirstItem?.id ?? '', // or any default number value
    file: frontImgDataFirstItem ? frontImgDataFirstItem.Backimg : '', });


    //embroidery values here
        //Front values
        const embfrontImgDataExists = embImgData && embImgData.length > 0;
       
        // Filter front and back items
        const embfrontItems: embImgData[] = embfrontImgDataExists ? embImgData : []; 
       
        console.log('embfrontImgDataFirstItem ', embfrontItems )
    
        // Get the first front item, or null if there are none
        const embfrontImgDataFirstItem = embfrontItems.length > 0 ? embfrontItems[0] : null;
        console.log('embfrontImgDataFirstItem ',embfrontImgDataFirstItem )

    const [embformState, emsetFormState] = useState<ImgaeData>({
        id: embfrontImgDataFirstItem?.id ?? '', // Access id property and ensure it's a string
    file: embfrontImgDataFirstItem ? embfrontImgDataFirstItem.FProductImg : ''
    });
    

    const [embBformState, embsetBFormState] = useState<ImgaeData>({   id: embfrontImgDataFirstItem?.id ?? '', // or any default number value
    file: embfrontImgDataFirstItem ? embfrontImgDataFirstItem.Backimg : '', });


    const [rangeHeightValue, setRangeHeightValue] = useState(frontImgDataFirstItem ? parseFloat(frontImgDataFirstItem.FHeight) : 32);


    const handleRangeSliderHeightChange = useCallback(
        (value: number) => setRangeHeightValue(value),
        [],
    );

    const formatValue = (value: number) => `${(value).toFixed(1)}`;

    const formattedRangeValue = formatValue(rangeHeightValue);
    const [rangeWidthValue, setRangeWidthValue] = useState(frontImgDataFirstItem ? parseFloat(frontImgDataFirstItem.FWidth) : 32); // Initial value set to 32
    const handleRangeSliderWidthChange = useCallback(
        (value: number) => setRangeWidthValue(value),
        [],
    );

    const formatWidthValue = (value: number) => `${(value).toFixed(1)}`;

    const formattedRangeWidthValue = formatWidthValue(rangeWidthValue);
    const [rangeLeftValue, setRangeLeftValue] = useState(frontImgDataFirstItem ? parseFloat(frontImgDataFirstItem.FLeft) : 32); // Initial value set to 32
    const handleRangeSliderLeftChange = useCallback(
        (value: number) => setRangeLeftValue(value),
        [],
    );

    const formatLeftValue = (value: number) => `${(value).toFixed(1)}`;

    const formattedRangeLeftValue = formatLeftValue(rangeLeftValue);
    const [rangeTopValue, setRangeTopValue] = useState(frontImgDataFirstItem ? parseFloat(frontImgDataFirstItem.FTop) : 32); // Initial value set to 32
    const handleRangeSliderTopChange = useCallback(
        (value: number) => setRangeTopValue(value),
        [],
    );

    const formatTopValue = (value: number) => `${(value).toFixed(1)}`;

    const formattedRangeTopValue = formatTopValue(rangeTopValue);






    //back values
    const [rangeBackHeightValue, setRangeBackHeightValue] = useState(frontImgDataFirstItem ? parseFloat(frontImgDataFirstItem.BHeight) : 32); // Initial value set to 32 // Initial value set to 32

    const handleRangeSliderBackHeightChange = useCallback(
            (value: number) => setRangeBackHeightValue(value),
        [],
    );

    const formatBackValue = (value: number) => `${(value).toFixed(1)}`;

    const formattedRangeBackValue = formatBackValue(rangeBackHeightValue);
    const [rangeBackWidthValue, setRangeBackWidthValue] = useState(frontImgDataFirstItem ? parseFloat(frontImgDataFirstItem.BWidth) : 32); // Initial value set to 32
    const handleRangeSliderBackWidthChange = useCallback(
        (value: number) => setRangeBackWidthValue(value),
        [],
    );

    const formatBackWidthValue = (value: number) => `${(value).toFixed(1)}`;

    const formattedRangeBackWidthValue = formatBackWidthValue(rangeBackWidthValue);
    const [rangeBackLeftValue, setRangeBackLeftValue] = useState(frontImgDataFirstItem ? parseFloat(frontImgDataFirstItem.BLeft) : 32); // Initial value set to 32 // Initial value set to 32
    const handleRangeSliderBackLeftChange = useCallback(
        (value: number) => setRangeBackLeftValue(value),
        [],
    );

    const formatBackLeftValue = (value: number) => `${(value).toFixed(1)}`;

    const formattedRangeBackLeftValue = formatBackLeftValue(rangeBackLeftValue);
    const [rangeBackTopValue, setRangeBackTopValue] = useState(frontImgDataFirstItem ? parseFloat(frontImgDataFirstItem.BTop) : 32); // Initial value set to 32 // Initial value set to 32
    const handleRangeSliderBackTopChange = useCallback(
        (value: number) => setRangeBackTopValue(value),
        [],
    );

    const formatBackTopValue = (value: number) => `${(value).toFixed(1)}`;

    const formattedRangeBackTopValue = formatBackTopValue(rangeBackTopValue);



    //dropping area for embroidery

       const [rangeHeightembValue, setRangeHeightembValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.FHeight) : 32);


    const handleRangeSliderHeightembChange = useCallback(
        (value: number) => setRangeHeightembValue(value),
        [],
    );

    const formatembValue = (value: number) => `${(value).toFixed(1)}`;

    const formattedRangeembValue = formatembValue(rangeHeightembValue);
    const [rangeWidthembValue, setRangeWidthembValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.FWidth) : 32); // Initial value set to 32
    const handleRangeSliderWidthembChange = useCallback(
        (value: number) => setRangeWidthembValue(value),
        [],
    );

    const formatWidthembValue = (value: number) => `${(value).toFixed(1)}`;

    const formattedRangeWidthembValue = formatWidthembValue(rangeWidthembValue);
    const [rangeLeftembValue, setRangeLeftembValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.FLeft) : 32); // Initial value set to 32
    const handleRangeSliderLeftembChange = useCallback(
        (value: number) => setRangeLeftembValue(value),
        [],
    );

    const formatLeftembValue = (value: number) => `${(value).toFixed(1)}`;

    const formattedRangeLeftembValue = formatLeftembValue(rangeLeftembValue);
    const [rangeTopembValue, setRangeTopembValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.FTop) : 32); // Initial value set to 32
    const handleRangeSliderTopembChange = useCallback(
        (value: number) => setRangeTopembValue(value),
        [],
    );

    const formatTopembValue = (value: number) => `${(value).toFixed(1)}`;

    const formattedRangeTopembValue = formatTopembValue(rangeTopembValue);






    //back values
    const [rangeBackHeightembValue, setRangeBackHeightembValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.BHeight) : 32); // Initial value set to 32 // Initial value set to 32

    const handleRangeSliderBackHeightembChange = useCallback(
            (value: number) => setRangeBackHeightembValue(value),
        [],
    );

    const formatBackembValue = (value: number) => `${(value).toFixed(1)}`;

    const formattedRangeBackembValue = formatBackembValue(rangeBackHeightembValue);
    const [rangeBackWidthembValue, setRangeBackWidthembValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.BWidth) : 32); // Initial value set to 32
    const handleRangeSliderBackWidthembChange = useCallback(
        (value: number) => setRangeBackWidthembValue(value),
        [],
    );

    const formatBackWidthembValue = (value: number) => `${(value).toFixed(1)}`;

    const formattedRangeBackWidthembValue = formatBackWidthembValue(rangeBackWidthembValue);
    const [rangeBackLeftembValue, setRangeBackLeftembValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.BLeft) : 32); // Initial value set to 32 // Initial value set to 32
    const handleRangeSliderBackLeftembChange = useCallback(
        (value: number) => setRangeBackLeftembValue(value),
        [],
    );

    const formatBackLeftembValue = (value: number) => `${(value).toFixed(1)}`;

    const formattedRangeBackLeftembValue = formatBackLeftembValue(rangeBackLeftembValue);
    const [rangeBackTopembValue, setRangeBackTopembValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.BTop) : 32); // Initial value set to 32 // Initial value set to 32
    const handleRangeSliderBackTopembChange = useCallback(
        (value: number) => setRangeBackTopembValue(value),
        [],
    );

    const formatBackTopembValue = (value: number) => `${(value).toFixed(1)}`;

    const formattedRangeBackTopembValue = formatBackTopembValue(rangeBackTopembValue);

    //embroidery arm values

    const [rangeHeightembFarmRValue, setRangeHeightembFarmRValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.FRAHeight) : 32);


const handleRangeSliderHeightembFarmRChange = useCallback(
    (value: number) => setRangeHeightembFarmRValue(value),
    [],
);

const formatembFarmRValue = (value: number) => `${(value).toFixed(1)}`;
const formattedRangeembFarmRValue = formatembFarmRValue(rangeHeightembFarmRValue,);


const [rangeWidthembFarmRValue, setRangeWidthembFarmRValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.FRAWidth) : 32); // Initial value set to 32
const handleRangeSliderWidthembFarmRChange = useCallback(
    (value: number) => setRangeWidthembFarmRValue(value),
    [],
);

const formatWidthembFarmRValue = (value: number) => `${(value).toFixed(1)}`;

const formattedRangeWidthembFarmRValue = formatWidthembFarmRValue(rangeWidthembFarmRValue);

const [rangeLeftembFarmRValue, setRangeLeftembFarmRValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.FRALeft) : 32); // Initial value set to 32
const handleRangeSliderLeftembFarmRChange = useCallback(
    (value: number) => setRangeLeftembFarmRValue(value),
    [],
);

const formatLeftembFarmRValue = (value: number) => `${(value).toFixed(1)}`;

const formattedRangeLeftembFarmRValue = formatLeftembFarmRValue(rangeLeftembFarmRValue);

const [rangeTopembFarmRValue, setRangeTopembFarmRValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.FRATop) : 32); // Initial value set to 32
const handleRangeSliderTopembFarmRChange = useCallback(
    (value: number) => setRangeTopembFarmRValue(value),
    [],
);

const formatTopembFarmRValue = (value: number) => `${(value).toFixed(1)}`;

const formattedRangeTopembFarmRValue = formatTopembFarmRValue(rangeTopembFarmRValue);


//left box emb area 
    //embroidery arm values

    const [rangeHeightembFarmLValue, setRangeHeightembFarmLValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.FLAHeight ) : 32);


const handleRangeSliderHeightembFarmLChange = useCallback(
    (value: number) => setRangeHeightembFarmLValue(value),
    [],
);

const formatembFarmLValue = (value: number) => `${(value).toFixed(1)}`;
const formattedRangeembFarmLValue = formatembFarmLValue(rangeHeightembFarmLValue,);



const [rangeWidthembFarmLValue, setRangeWidthembFarmLValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.FLAWidth) : 32); // Initial value set to 32
const handleRangeSliderWidthembFarmLChange = useCallback(
    (value: number) => setRangeWidthembFarmLValue(value),
    [],
);

const formatWidthembFarmLValue = (value: number) => `${(value).toFixed(1)}`;

const formattedRangeWidthembFarmLValue = formatWidthembFarmLValue(rangeWidthembFarmLValue);


const [rangeLeftembFarmLValue, setRangeLeftembFarmLValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.FLALeft) : 32); // Initial value set to 32
const handleRangeSliderLeftembFarmLChange = useCallback(
    (value: number) => setRangeLeftembFarmLValue(value),
    [],
);

const formatLeftembFarmLValue = (value: number) => `${(value).toFixed(1)}`;

const formattedRangeLeftembFarmLValue = formatLeftembFarmLValue(rangeLeftembFarmLValue);


const [rangeTopembFarmLValue, setRangeTopembFarmLValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.FLATop) : 32); // Initial value set to 32
const handleRangeSliderTopembFarmLChange = useCallback(
    (value: number) => setRangeTopembFarmLValue(value),
    [],
);

const formatTopembFarmLValue = (value: number) => `${(value).toFixed(1)}`;

const formattedRangeTopembFarmLValue = formatTopembFarmLValue(rangeTopembFarmLValue);

//back values of embroidery area 

const [rangeHeightembBarmRValue, setRangeHeightembBarmRValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.FHeight) : 32);


const handleRangeSliderHeightembBarmRChange = useCallback(
    (value: number) => setRangeHeightembBarmRValue(value),
    [],
);

const formatembBarmRValue = (value: number) => `${(value).toFixed(1)}`;
const formattedRangeembBarmRValue = formatembBarmRValue(rangeHeightembBarmRValue,);


const [rangeWidthembBarmRValue, setRangeWidthembBarmRValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.BRAWidth) : 32); // Initial value set to 32
const handleRangeSliderWidthembBarmRChange = useCallback(
    (value: number) => setRangeWidthembBarmRValue(value),
    [],
);

const formatWidthembBarmRValue = (value: number) => `${(value).toFixed(1)}`;

const formattedRangeWidthembBarmRValue = formatWidthembBarmRValue(rangeWidthembBarmRValue);

const [rangeLeftembBarmRValue, setRangeLeftembBarmRValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.BRALeft) : 32); // Initial value set to 32
const handleRangeSliderLeftembBarmRChange = useCallback(
    (value: number) => setRangeLeftembBarmRValue(value),
    [],
);

const formatLeftembBarmRValue = (value: number) => `${(value).toFixed(1)}`;

const formattedRangeLeftembBarmRValue = formatLeftembBarmRValue(rangeLeftembBarmRValue);

const [rangeTopembBarmRValue, setRangeTopembBarmRValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.BRATop) : 32); // Initial value set to 32
const handleRangeSliderTopembBarmRChange = useCallback(
    (value: number) => setRangeTopembBarmRValue(value),
    [],
);

const formatTopembBarmRValue = (value: number) => `${(value).toFixed(1)}`;

const formattedRangeTopembBarmRValue = formatTopembBarmRValue(rangeTopembBarmRValue);


//left box emb area 
    //embroidery arm values

    const [rangeHeightembBarmLValue, setRangeHeightembBarmLValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.BLAHeight  ) : 32);


const handleRangeSliderHeightembBarmLChange = useCallback(
    (value: number) => setRangeHeightembBarmLValue(value),
    [],
);


const formatembBarmLValue = (value: number) => `${(value).toFixed(1)}`;
const formattedRangeembBarmLValue = formatembBarmLValue(rangeHeightembBarmLValue,);



const [rangeWidthembBarmLValue, setRangeWidthembBarmLValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.BLAWidth) : 32); // Initial value set to 32
const handleRangeSliderWidthembBarmLChange = useCallback(
    (value: number) => setRangeWidthembBarmLValue(value),
    [],
);

const formatWidthembBarmLValue = (value: number) => `${(value).toFixed(1)}`;

const formattedRangeWidthembBarmLValue = formatWidthembBarmLValue(rangeWidthembBarmLValue);


const [rangeLeftembBarmLValue, setRangeLeftembBarmLValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.BLALeft) : 32); // Initial value set to 32
const handleRangeSliderLeftembBarmLChange = useCallback(
    (value: number) => setRangeLeftembBarmLValue(value),
    [],
);

const formatLeftembBarmLValue = (value: number) => `${(value).toFixed(1)}`;

const formattedRangeLeftembBarmLValue = formatLeftembBarmLValue(rangeLeftembBarmLValue);


const [rangeTopembBarmLValue, setRangeTopembBarmLValue] = useState(embfrontImgDataFirstItem ? parseFloat(embfrontImgDataFirstItem.BLATop ) : 32); // Initial value set to 32
const handleRangeSliderTopembBarmLChange = useCallback(
    (value: number) => setRangeTopembBarmLValue(value),
    [],
);

const formatTopembBarmLValue = (value: number) => `${(value).toFixed(1)}`;

const formattedRangeTopembBarmLValue = formatTopembBarmLValue(rangeTopembBarmLValue);

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
    const formstatenull = async () => {
        setFormColorState({
            productId: id || '', // Initialize productId with an empty string
            file: '', // Initialize file with an empty string
            backfile: '',
        });
    };
    const handleEditSubmit = (id: string) =>{

        setTimeout(() => {
            editIsModalOpen(id, false);
        }, 5000);
    
      }
    return (
        <Page>
            <div className={`${dropzone.mainparentHeader}`}>
                <div className={`${dropzone.framwrapper}`}>
                <Frame>{toastMarkup}</Frame>
                </div>
           <div>
           <Card>
                <div>
           
                    <div className={`${dropzone.mainHeader}`}>
                        <p>{title?.toString() || 'Title not found'}</p>
                    </div>
                    <div className={`${dropzone.mainwrapper}`}>
                    <Link to="/app/new-product" className={`${dropzone.backlink}`} >Go Back</Link>
                     
                        <div className={`${dropzone.dropzonetitle}`}>Select Drop Zone</div>
                        <div className={`${dropzone.customizerWrapper}`}>

                            <div className='Front-imageWrapper'>
                            <div style={{ marginBottom: '5px' }}>Front Side</div>

                                <div className={`${dropzone.uploadimagebtn}`}>
                                <Uploadwidget onUploadSuccess={handleUploadSuccess} />
                                </div>
                             <div className={`${dropzone.imagespatcheswrapper}`}>
                              
                                    <div className={`${dropzone.imageDiv}`}>
                                        <img
                                            className={`${dropzone.sourceImage}`}
                                            src={formState.file || ''}
                                            alt="Upload Image"
                                        />
                                        <div className={`${dropzone.centerBox}`} style={{ height: `${formattedRangeValue}%`, width: `${formattedRangeWidthValue}%`, top: `${formattedRangeTopValue}%`, left: `${formattedRangeLeftValue}%` }}>

                                        </div>
                                    </div>
                                    <div className={`${dropzone.patches}`}></div>
                                </div>
                                <div className={`${dropzone.controllerWrapper}`}>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Height"
                                            value={rangeHeightValue}
                                            onChange={handleRangeSliderHeightChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Width"
                                            value={rangeWidthValue}
                                            onChange={handleRangeSliderWidthChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Left"
                                            value={rangeLeftValue}
                                            onChange={handleRangeSliderLeftChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Top"
                                            value={rangeTopValue}
                                            onChange={handleRangeSliderTopChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                  
                                </div>
                                <Form method="post" className={`${dropzone.imageform}`}>
                                   
                                    <input type="hidden" name="action" value="img" />
                                    <input type='hidden' name="db-id" value={formState.id || ''} />
                                    <input type="hidden" value={rgbaColor} name="variant-color" />
                                    <input type='hidden' name="file" value={formState.file || ''} />
                                    <input type='hidden' name="backimage" value={BformState.file || ''} />
                                    <input type="hidden" name="FproductName" value={title} />
                                    <input type="hidden" name="FproductId" value={id} />
                                    <input type="hidden" name="FHeight" value={formattedRangeValue} />
                                    <input type="hidden" name="FWidth" value={formattedRangeWidthValue} />
                                    <input type="hidden" name="FTop" value={formattedRangeTopValue} />
                                    <input type="hidden" name="FLeft" value={formattedRangeLeftValue} />
                                    <input type="hidden" name="BHeight" value={formattedRangeBackValue} />
                                    <input type="hidden" name="BWidth" value={formattedRangeBackWidthValue} />
                                    <input type="hidden" name="BTop" value={formattedRangeBackTopValue} />
                                    <input type="hidden" name="BLeft" value={formattedRangeBackLeftValue} />
                                    <input type="hidden" name="direction" value="Frontside" />
                                    <label>Variant Color Name</label>
                                    <input type="text" name="colorname"></input>
                                  
                                   
                                  
                                   {/* {!SizeVariants.some((variant: SizeVariant) => variant.id === id) && (
   
   <div className="size-toggle-container">
     <div>
        <h2 className={`${dropzone.variantsSizeheading}`}>Please Select Available Size Variants</h2></div>
        <div className={`${dropzone.checkboxes}`}>
        <label className={`${dropzone.checkboxesLabel}`}>
            Small
            </label>
            <input
                className={`${dropzone.checkboxesInput}`}
                name="small"
                type="checkbox"
                checked={sizeAvailability.small === 'true'}
                onChange={() => toggleSizeAvailability('small')}
                value={sizeAvailability.small}
            /> 
      
        </div>
      
     
    <div className={`${dropzone.checkboxes}`}>
    <label className={`${dropzone.checkboxesLabel}`}>
            Medium
            </label>
            <input
                className={`${dropzone.checkboxesInput}`}
                name="medium"
                type="checkbox"
                checked={sizeAvailability.medium === 'true'}
                onChange={() => toggleSizeAvailability('medium')}
                value={sizeAvailability.medium}
            />
    </div>

      <div className={`${dropzone.checkboxes}`}>
      <label className={`${dropzone.checkboxesLabel}`}>
            Large
            </label>
            <input
                className={`${dropzone.checkboxesInput}`}
                name="large"
                type="checkbox"
                checked={sizeAvailability.large === 'true'}
                onChange={() => toggleSizeAvailability('large')}
                value={sizeAvailability.large}
            />
      </div>
     
      <div className={`${dropzone.checkboxes}`}>
      <label className={`${dropzone.checkboxesLabel}`}>
            Extra Large
            </label>
            <input
               className={`${dropzone.checkboxesInput}`}
                name="extra_large"
                type="checkbox"
                checked={sizeAvailability.extra_large === 'true'}
                onChange={() => toggleSizeAvailability('extra_large')}
                value={sizeAvailability.extra_large}
            />
      </div>
      
      
    </div>
)} */}

                                   <div  className={`${dropzone.submitBtn}`}>
                                   <Button submit variant="primary"  onClick={toggleActive}>Add</Button>
                                   </div>
                                   
                                     
                                </Form>
                               
                                
                            </div>
                            <div className='Back-imageWrapper'>
                            <div style={{ marginBottom: '5px' }}>Back Side</div>
                            <div className={`${dropzone.uploadimagebtn}`}><Uploadwidget onUploadSuccess={handleBUploadSuccess} /></div>
                                <div className={`${dropzone.imagespatcheswrapper}`}>
                                
                                    <div className={`${dropzone.imageDiv}`}>
                                        <img
                                            className={`${dropzone.sourceImage}`}
                                            src={BformState.file || ''}
                                            alt="Upload Image"
                                        />
                                        <div className={`${dropzone.backcenterBox}`} style={{ height: `${formattedRangeBackValue}%`, width: `${formattedRangeBackWidthValue}%`, top: `${formattedRangeBackTopValue}%`, left: `${formattedRangeBackLeftValue}%` }}>
                                        </div>
                                    </div>
                                    <div className={`${dropzone.patches}`}></div>
                                </div>
                                <div className={`${dropzone.controllerWrapper}`}>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Height"
                                            value={rangeBackHeightValue}
                                            onChange={handleRangeSliderBackHeightChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Width"
                                            value={rangeBackWidthValue}
                                            onChange={handleRangeSliderBackWidthChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>

                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Top"
                                            value={rangeBackTopValue}
                                            onChange={handleRangeSliderBackTopChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Left"
                                            value={rangeBackLeftValue}
                                            onChange={handleRangeSliderBackLeftChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                </div>
                           
                            </div>
                            <div className={`${dropzone.btnColorwrapper}`}>
                                        <h2>Select Button Color</h2>
                                   
                                    <div className={`${dropzone.colorvariantscolorpicker}`}>
                                        <ColorPicker onChange={setColor} color={color} />
                                    </div>
                                    <div className={`${dropzone.btnlable}`}>Button Color</div>
                                    <div style={colorPreviewStyle} className={`${dropzone.colorvariantswrapper}`}></div>
                                    </div>
                        </div>
                    </div>
<div className={`${dropzone.patchestableWrrapper}`}>
    <div className={`${dropzone.patchestableWrrap}`}>
        <h2 className={`${dropzone.patchestableHeading}`}>Size Availability</h2>
    <table className={`${dropzone.patchestable}`}>

<thead>
    <tr> 
        <th>Small</th>
        <th>Medium</th>
        <th>Large</th>
        <th>Extra Large</th>
        <th>Action</th>
    </tr>

</thead>
<tbody>
{SizeVariants && SizeVariants.map((variant: SizeVariant, index: number) => (
    <tr key={index}>
        <td><div className={`${dropzone.colorvariantsdataImg}`}>
        {variant.Smalll === 'true' ? ('Available'):("Out of Stock")}
            </div></td>
        <td><div className={`${dropzone.colorvariantsdataImg}`}>x{variant.Medium === 'true' ? ('Available'):("Out of Stock")}</div></td>
        <td><div className={`${dropzone.colorvariantsdataImg}`}>{variant.Large === 'true' ? ('Available'):("Out of Stock")}</div></td>
        <td><div className={`${dropzone.colorvariantsdataImg}`}>{variant.Extra_Large === 'true' ? ('Available'):("Out of Stock")}</div></td>
        <td>
            <Form method='post'>
                <input type="hidden"  name="db-id" value={variant.sizevariant_id}/>
                <input type="hidden"  name="action" value='delete'/>
                <Button icon={EditIcon} size="micro" variant="tertiary" onClick={() => editIsModalOpen(variant.sizevariant_id, true)} />
            </Form>
        </td>
        {editModalOpen[variant.sizevariant_id] && (
  <div className={styles.addcustomproductmodal}>
    <div className={styles.addcustomproductmodalsizecontent}>
      <div className={`${styles.addcustomproductmodalheader} ${styles.editmodalheader}`}>
        <h2 className={styles.addcustomproductmodaltitle}>Edit Size Variants</h2>
        <span className="close" onClick={() => handleCloseModal(variant.sizevariant_id)}>
          <Button icon={XIcon} />
        </span>
      </div>
      <Scrollable style={{ height: '86%', padding: '20px' }}>
        <Form method="post" onSubmit={() => handleEditSubmit(variant.sizevariant_id)}  >
            
        <div className={`${dropzone.checkboxes}`}>
        <label className={`${dropzone.checkboxesLabel}`}>
            Small
            </label>
            {variant.Smalll === 'true' ? (    <input
                className={`${dropzone.checkboxesInput}`}
                name="small"
                type="checkbox"
                value={sizeAvailability.small}
                checked={sizeAvailability.small === variant.Smalll}
                onChange={() => toggleSizeAvailability('small')}
               
            />):(<input
                className={`${dropzone.checkboxesInput}`}
                name="small"
                type="checkbox"
                checked={sizefalseAvailability.small === 'true'}
                onChange={() => toggleSizefalseAvailability('small')}
                value={sizefalseAvailability.small}
            />  )}
        
                  
        </div>
      
     
    <div className={`${dropzone.checkboxes}`}>
    <label className={`${dropzone.checkboxesLabel}`}>
            Medium
            </label>
            {variant.Medium === 'true' ? (  <input
                className={`${dropzone.checkboxesInput}`}
                name="medium"
                type="checkbox"
                value="false"
                 checked={sizeAvailability.medium === variant.Medium}
                onChange={() => toggleSizeAvailability('medium')}
                
            />):( <input
                className={`${dropzone.checkboxesInput}`}
                name="medium"
                type="checkbox"
                checked={sizefalseAvailability.medium === 'true'}
                onChange={() => toggleSizefalseAvailability('medium')}
                value={sizefalseAvailability.medium}
            />)}
          
                   
    </div>

      <div className={`${dropzone.checkboxes}`}>
      <label className={`${dropzone.checkboxesLabel}`}>
            Large
            </label>
            {variant.Large === 'true' ? ( <input
                className={`${dropzone.checkboxesInput}`}
                name="large"
                type="checkbox"
                value={sizeAvailability.large}
                checked={sizeAvailability.large === variant.Large}
                onChange={() => toggleSizeAvailability('large')}
              
            />):(    <input
                className={`${dropzone.checkboxesInput}`}
                name="large"
                type="checkbox"
                checked={sizefalseAvailability.large === 'true'}
                onChange={() => toggleSizefalseAvailability('large')}
                value={sizefalseAvailability.large}
            />)}
         
                
      </div>
     
      <div className={`${dropzone.checkboxes}`}>
      <label className={`${dropzone.checkboxesLabel}`}>
            Extra Large
            </label>
            {variant.Extra_Large === 'true' ? (
    <input
        className={`${dropzone.checkboxesInput}`}
        name="extra_large"
        type="checkbox"
        value={sizeAvailability.extra_large}
        checked={sizeAvailability.extra_large === variant.Extra_Large}
        onChange={() => toggleSizeAvailability('extra_large')}
    />
) : (
    <input
        className={`${dropzone.checkboxesInput}`}
        name="extra_large"
        type="checkbox"
        checked={sizefalseAvailability.extra_large === 'true'}
        onChange={() => toggleSizefalseAvailability('extra_large')}
        value={sizefalseAvailability.extra_large}
    />
)}

           
               
      </div>

          <input type="hidden" name="action" value="editSize"></input>
          <input type="hidden" value={variant.sizevariant_id} name="db-id" />
         
   
          <div className={styles.formbuttons}>
          
          <Button submit>Edit</Button>
       
          </div>
        </Form>
      </Scrollable>
    </div>
  </div>
)}
    </tr>
))}
    </tbody>

    </table>
    </div>


  
</div>
                    <div className={`${dropzone.colorvariantsmainwrapper}`} >
                        <div className={`${dropzone.colorvariantsdata}`}>
                            <table className={`${dropzone.patchestable}`}>

                                <thead>
                                    <tr> 
                                        <th>Front Image</th>
                                        <th>Back Image</th>
                                        <th>Button Color</th>
                                        <th>Action</th>
                                    </tr>

                                </thead>
                                <tbody>
                                {ColorVariants && ColorVariants.map((variant: ColorVariant, index: number) => (
    <tr key={index}>
        <td><div className={`${dropzone.colorvariantsdataImg}`}><img src={variant.productImg} alt="" /></div></td>
        <td><div className={`${dropzone.colorvariantsdataImg}`}><img src={variant.backImg} alt="" /></div></td>
        <td><div style={{ backgroundColor: variant.Variants, height: '20px', width: '40px' }}></div></td>
        <td>
            <Form method='post'>
                <input type="hidden"  name="db-id" value={variant.colorvariant_id}/>
                <input type="hidden"  name="action" value='delete'/>
                <Button icon={DeleteIcon} variant="tertiary" size="micro" tone="critical" submit />
                <Button icon={EditIcon} size="micro" variant="tertiary" onClick={() => editIsModalOpen(variant.colorvariant_id, true)} />
            </Form>
        </td>
        {editModalOpen[variant.colorvariant_id] && (
  <div className={styles.addcustomproductmodal}>
    <div className={styles.addcustomproductmodalcontent}>
      <div className={`${styles.addcustomproductmodalheader} ${styles.editmodalheader}`}>
        <h2 className={styles.addcustomproductmodaltitle}>Edit Color button Detail</h2>
        <span className="close" onClick={() => handleCloseModal(variant.colorvariant_id)}>
          <Button icon={XIcon} />
        </span>
      </div>
      <Scrollable style={{ height: '86%', padding: '20px' }}>
        <Form method="post" onSubmit={() => handleEditSubmit(variant.colorvariant_id)}  >
        <div className={`${dropzone.imageswrapper}`}>
            <div className={`${dropzone.images}`}>
            <img src={variant.productImg} alt="" />
            </div>
           <div className={`${dropzone.images}`}>
           <img src={variant.backImg} alt="" />
           </div>
              
        </div>

          <input type="hidden" name="action" value="edit"></input>
          <input type="hidden" value={variant.colorvariant_id} name="db-id" />
          <input type="hidden" value={rgbaColor} name="color-variant" />
          <div className={`${dropzone.colorvariantscolorpicker}`}>
                                        <ColorPicker onChange={setColor} color={color} />
                                    </div>
                                    <div className={`${dropzone.colorvariantsbtn}`}>
                                        <h2 className={`${dropzone.colorvariantsbtnlabel}`}>Button Color</h2>
                                        <div style={colorPreviewStyle} className={`${dropzone.colorvariantswrapper}`}></div>
                                        </div>
     
          <div className={styles.formbuttons}>
          
          <Button submit>Edit</Button>
       
          </div>
        </Form>
      </Scrollable>
    </div>
  </div>
)}
    </tr>
))}

                                </tbody>
                            </table>
                        </div>

                        <div className={`${dropzone.colorvariants}`}>
                            <div className={`${dropzone.colortitle}`}>Enter More Color Variants</div>

                            <div className={`${dropzone.colorvariantform}`}>
                                <Form method="post" onSubmit={formstatenull}>
                                    <div className={`${dropzone.imageuploadbtn}`}>
                                    <span>Select Front Image</span>
                                        <Uploadwidget onUploadSuccess={handleColorVariantUploadSuccess} />
                                    </div>
                                    {formColorState.file && <img src={formColorState.file} alt="Upload Variant Images" className={`${dropzone.colorvariantsimg}`} />}
                                    <div className={`${dropzone.imageuploadbtn}`}>
                                        <span>Select Back Image</span>
                                        <Uploadwidget onUploadSuccess={handlebackColorVariantUploadSuccess} />
                                    </div>

                                
                                    {formColorState.backfile && <img src={formColorState.backfile} alt="Upload Variant Images" className={`${dropzone.colorvariantsimg}`} />}
                                    <input type="hidden" value={formColorState.backfile} name="backimage"></input>
                                    <input type="hidden" value={formColorState.file} name="image" />
                                    <input type="hidden" name="action" value="color" />
                                    <input type="text" name="colorname" />
                                    <input type="hidden" value={formColorState.productId} name='productId' />
                                    <div className={`${dropzone.colorvariantscolorpicker}`}>
                                        <ColorPicker onChange={setColor} color={color} />
                                    </div>
                                    
                                    <input type="hidden" value={rgbaColor} name="variant-color" />
                                    <div className={`${dropzone.colorvariantsbtn}`}>
                                        <h2 className={`${dropzone.colorvariantsbtnlabel}`}>Button Color</h2>
                                        <div style={colorPreviewStyle} className={`${dropzone.colorvariantswrapper}`}></div>
                                    </div>

                                    <Button submit variant="primary"  onClick={toggleActive}>Add</Button>

                                </Form>
                            </div>

                        </div>
                    </div>

                </div>


                <div className={`${dropzone.dropzonetitle}`}>Select Embroidery Area</div>
                        <div className={`${dropzone.customizerWrapper}`}>

                            <div className='Front-imageWrapper'>
                            <div style={{ marginBottom: '5px' }}>Front Side</div>

                                <div className={`${dropzone.uploadimagebtn}`}>
                                <Uploadwidget onUploadSuccess={embhandleUploadSuccess} />
                                </div>
                             <div className={`${dropzone.imagespatcheswrapper}`}>
                              
                                    <div className={`${dropzone.imageDiv}`}>
                                        <img
                                            className={`${dropzone.sourceImage}`}
                                            src={embformState.file || ''}
                                            alt="Upload Image"
                                        />
                                        <div className={`${dropzone.centerBox}`} style={{ height: `${formattedRangeembValue}%`, width: `${formattedRangeWidthembValue}%`, top: `${formattedRangeTopembValue}%`, left: `${formattedRangeLeftembValue}%` }}>

                                        </div>
                                    </div>
                                    <div className={`${dropzone.patches}`}></div>
                                </div>
                                <div className={`${dropzone.controllerWrapper}`}>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Height"
                                            value={rangeHeightembValue}
                                            onChange={handleRangeSliderHeightembChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Width"
                                            value={rangeWidthembValue}
                                            onChange={handleRangeSliderWidthembChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Left"
                                            value={rangeLeftembValue}
                                            onChange={handleRangeSliderLeftembChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Top"
                                            value={rangeTopembValue}
                                            onChange={handleRangeSliderTopembChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                  
                                </div>
                                <Form method="post" className={`${dropzone.imageform}`}>
                                    <input type="hidden" name="action" value="embaction" />
                                    <input type="hidden" name="FproductName" value={title} />
                                    <input type='hidden' name="db-id" value={embformState.id || ''} />
                                    <input type='hidden' name="file" value={embformState.file || ''} />
                                    <input type='hidden' name="backimage" value={embBformState.file || ''} />
                                    <input type="hidden" name="FproductId" value={id} />
                                    <input type="hidden" name="FHeight" value={formattedRangeembValue} />
                                    <input type="hidden" name="FWidth" value={formattedRangeWidthembValue} />
                                    <input type="hidden" name="FTop" value={formattedRangeTopembValue} />
                                    <input type="hidden" name="FLeft" value={formattedRangeLeftembValue} />
                                    <input type="hidden" name="BHeight" value={formattedRangeBackembValue} />
                                    <input type="hidden" name="BWidth" value={formattedRangeBackWidthembValue} />
                                    <input type="hidden" name="BTop" value={formattedRangeBackTopembValue} />
                                    <input type="hidden" name="BLeft" value={formattedRangeBackLeftembValue} />
                                    <input type="hidden" name="FRAHeight" value={formattedRangeembFarmRValue} />
                                    <input type="hidden" name="FRAWidth" value={formattedRangeWidthembFarmRValue} />
                                    <input type="hidden" name="FRATop" value={formattedRangeTopembFarmRValue} />
                                    <input type="hidden" name="FRALeft" value={formattedRangeLeftembFarmRValue} />
                                    <input type="hidden" name="FLAHeight" value={formattedRangeembFarmLValue} />
                                    <input type="hidden" name="FLAWidth" value={formattedRangeWidthembFarmLValue} />
                                    <input type="hidden" name="FLATop" value={formattedRangeTopembFarmLValue} />
                                    <input type="hidden" name="FLALeft" value={formattedRangeLeftembFarmLValue} />

                                    <input type="hidden" name="BRAHeight" value={formattedRangeembBarmRValue} />
                                    <input type="hidden" name="BRAWidth" value={formattedRangeWidthembBarmRValue} />
                                    <input type="hidden" name="BRATop" value={formattedRangeTopembBarmRValue} />
                                    <input type="hidden" name="BRALeft" value={formattedRangeLeftembBarmRValue} />
                                    <input type="hidden" name="BLAHeight" value={formattedRangeembBarmLValue} />
                                    <input type="hidden" name="BLAWidth" value={formattedRangeWidthembBarmLValue} />
                                    <input type="hidden" name="BLATop" value={formattedRangeTopembBarmLValue} />
                                    <input type="hidden" name="BLALeft" value={formattedRangeLeftembBarmLValue} />
                                  
                                   <div  className={`${dropzone.submitBtn}`}>
                                   <Button submit variant="primary"  onClick={toggleActive}>Add</Button>
                                   </div>
                                   
                                     
                                </Form>
                               
                                
                            </div>
                            <div className='Back-imageWrapper'>
                            <div style={{ marginBottom: '5px' }}>Back Side</div>
                            <div className={`${dropzone.uploadimagebtn}`}><Uploadwidget onUploadSuccess={embhandleBUploadSuccess} /></div>
                                <div className={`${dropzone.imagespatcheswrapper}`}>
                                
                                    <div className={`${dropzone.imageDiv}`}>
                                        <img
                                            className={`${dropzone.sourceImage}`}
                                            src={embBformState.file || ''}
                                            alt="Upload Image"
                                        />
                                        <div className={`${dropzone.backcenterBox}`} style={{ height: `${formattedRangeBackembValue}%`, width: `${formattedRangeBackWidthembValue}%`, top: `${formattedRangeBackTopembValue}%`, left: `${formattedRangeBackLeftembValue}%` }}>
                                        </div>
                                    </div>
                                    <div className={`${dropzone.patches}`}></div>
                                </div>
                                <div className={`${dropzone.controllerWrapper}`}>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Height"
                                            value={rangeBackHeightembValue}
                                            onChange={handleRangeSliderBackHeightembChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Width"
                                            value={rangeBackWidthembValue}
                                            onChange={handleRangeSliderBackWidthembChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>

                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Top"
                                            value={rangeBackTopembValue}
                                            onChange={handleRangeSliderBackTopembChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Left"
                                            value={rangeBackLeftembValue}
                                            onChange={handleRangeSliderBackLeftembChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                </div>
                           
                            </div>
                        </div>


                        <div className={`${dropzone.dropzonetitle}`}>Select Embroidery Arms Area</div>
                        <div className={`${dropzone.customizerWrapper}`}>

                            <div className='Front-imageWrapper'>
                            <div style={{ marginBottom: '5px' }}>Front Side</div>

                                <div className={`${dropzone.uploadimagebtn}`}>
                                <Uploadwidget onUploadSuccess={embhandleUploadSuccess} />
                                </div>
                             <div className={`${dropzone.imagespatcheswrapper}`}>
                              
                                    <div className={`${dropzone.imageDiv}`}>
                                        <img
                                            className={`${dropzone.sourceImage}`}
                                            src={embformState.file || ''}
                                            alt="Upload Image"
                                        />
                                        <div className={`${dropzone.centerBox}`} style={{ height: `${formattedRangeembFarmRValue}%`, width: `${formattedRangeWidthembFarmRValue}%`, top: `${formattedRangeTopembFarmRValue}%`, left: `${formattedRangeLeftembFarmRValue}%` }}>
                                             </div>
                                             <div className={`${dropzone.centerBox}`} style={{ height: `${formattedRangeembFarmLValue}%`, width: `${formattedRangeWidthembFarmLValue}%`, top: `${formattedRangeTopembFarmLValue}%`, left: `${formattedRangeLeftembFarmLValue}%` }}></div>
                                    </div>
                                    <div className={`${dropzone.patches}`}></div>
                                </div>
                                <div className={`${dropzone.controllerWrapper}`}>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Height"
                                            value={rangeHeightembFarmRValue}
                                            onChange={handleRangeSliderHeightembFarmRChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Width"
                                            value={rangeWidthembFarmRValue}
                                            onChange={handleRangeSliderWidthembFarmRChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Left"
                                            value={rangeLeftembFarmRValue}
                                            onChange={handleRangeSliderLeftembFarmRChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Top"
                                            value={rangeTopembFarmRValue}
                                            onChange={handleRangeSliderTopembFarmRChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>

                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Height"
                                            value={rangeHeightembFarmLValue}
                                            onChange={handleRangeSliderHeightembFarmLChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Width"
                                            value={rangeWidthembFarmLValue}
                                            onChange={handleRangeSliderWidthembFarmLChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Left"
                                            value={rangeLeftembFarmLValue}
                                            onChange={handleRangeSliderLeftembFarmLChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Top"
                                            value={rangeTopembFarmLValue}
                                            onChange={handleRangeSliderTopembFarmLChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                  
                                </div>
                                {/* <Form method="post" className={`${dropzone.imageform}`}>
                                    <input type="hidden" name="action" value="embaction" />
                                    <input type="hidden" name="FproductName" value={title} />
                                    <input type='hidden' name="db-id" value={embformState.id || ''} />
                                    <input type='hidden' name="file" value={embformState.file || ''} />
                                    <input type='hidden' name="backimage" value={embBformState.file || ''} />
                                    <input type="hidden" name="FproductId" value={id} />
                                    <input type="hidden" name="FHeight" value={formattedRangeembValue} />
                                    <input type="hidden" name="FWidth" value={formattedRangeWidthembValue} />
                                    <input type="hidden" name="FTop" value={formattedRangeTopembValue} />
                                    <input type="hidden" name="FLeft" value={formattedRangeLeftembValue} />
                                    <input type="hidden" name="BHeight" value={formattedRangeBackembValue} />
                                    <input type="hidden" name="BWidth" value={formattedRangeBackWidthembValue} />
                                    <input type="hidden" name="BTop" value={formattedRangeBackTopembValue} />
                                    <input type="hidden" name="BLeft" value={formattedRangeBackLeftembValue} />
                                    
                                  
                                   <div  className={`${dropzone.submitBtn}`}>
                                   <Button submit variant="primary"  onClick={toggleActive}>Add</Button>
                                   </div>
                                   
                                     
                                </Form> */}
                               
                                
                            </div>
                            <div className='Back-imageWrapper'>
                            <div style={{ marginBottom: '5px' }}>Back Side</div>
                            <div className={`${dropzone.uploadimagebtn}`}><Uploadwidget onUploadSuccess={embhandleBUploadSuccess} /></div>
                                <div className={`${dropzone.imagespatcheswrapper}`}>
                                
                                    <div className={`${dropzone.imageDiv}`}>
                                        <img
                                            className={`${dropzone.sourceImage}`}
                                            src={embBformState.file || ''}
                                            alt="Upload Image"
                                        />
                                        <div className={`${dropzone.backcenterBox}`} style={{ height: `${formattedRangeembBarmRValue}%`, width: `${formattedRangeWidthembBarmRValue}%`, top: `${formattedRangeTopembBarmRValue}%`, left: `${formattedRangeLeftembBarmRValue}%` }}>
                                        </div>
                                        <div className={`${dropzone.backcenterBox}`} style={{ height: `${formattedRangeembBarmLValue}%`, width: `${formattedRangeWidthembBarmLValue}%`, top: `${formattedRangeTopembBarmLValue}%`, left: `${formattedRangeLeftembBarmLValue}%` }}></div>
                                    </div>
                                    <div className={`${dropzone.patches}`}></div>
                                </div>
                                <div className={`${dropzone.controllerWrapper}`}>
                                <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Height"
                                            value={rangeHeightembBarmRValue}
                                            onChange={handleRangeSliderHeightembBarmRChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Width"
                                            value={rangeWidthembBarmRValue}
                                            onChange={handleRangeSliderWidthembBarmRChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Left"
                                            value={rangeLeftembBarmRValue}
                                            onChange={handleRangeSliderLeftembBarmRChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Top"
                                            value={rangeTopembBarmRValue}
                                            onChange={handleRangeSliderTopembBarmRChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>

                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Height"
                                            value={rangeHeightembBarmLValue}
                                            onChange={handleRangeSliderHeightembBarmLChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Width"
                                            value={rangeWidthembBarmLValue}
                                            onChange={handleRangeSliderWidthembBarmLChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Left"
                                            value={rangeLeftembBarmLValue}
                                            onChange={handleRangeSliderLeftembBarmLChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                    <div className={`${dropzone.controller}`}>
                                        <RangeSlider
                                            label="Top"
                                            value={rangeTopembBarmLValue}
                                            onChange={handleRangeSliderTopembBarmLChange}
                                            output
                                            min={0}
                                            max={100}
                                            step={0.1} // Step of 1, but displayed value will be divided by 10

                                        />
                                    </div>
                                </div>
                           
                            </div>
                        </div>
            </Card>
           </div>
          
            </div>
        
        </Page>
    );          

}

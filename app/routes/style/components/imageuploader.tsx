import { useMatches } from '@remix-run/react';
import { useRef, useEffect, useState } from 'react';

 import {DropZone, Thumbnail, Text,Icon,Button} from '@shopify/polaris';
import {
  UploadIcon
} from '@shopify/polaris-icons';
import styles from 'app/routes/style/style.module.css';
interface Env {
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_UPLOAD_PRESET: string;
  // Add other properties here if necessary
}

declare global {
  interface Window {
    cloudinary: any; // Adjust the type if possible
  }
}


function Uploadwidget({ onUploadSuccess }: { onUploadSuccess: (url: string) => void }) {
  const matches = useMatches();
  const { ENV }: { ENV?: Env } = matches.find((route) => route.id === 'root')?.data || {};

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  function createWidget() {
    console.log('upload widjet clicked');
    console.log(window.cloudinary)
    // console.log('CLOUDINARY_CLOUD_NAME',CLOUDINARY_CLOUD_NAME)
    if (window.cloudinary) {
      console.log('under cloudinary');
      return window.cloudinary.createUploadWidget(
        {
          cloudName: ENV?.CLOUDINARY_CLOUD_NAME || '',
          uploadPreset: ENV?.CLOUDINARY_UPLOAD_PRESET || '',
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            // If upload is successful, extract the URL and set it
            setUploadedImageUrl(result.info.secure_url);
            onUploadSuccess(result.info.secure_url);
          }
          console.log(error, result);
        }
      );
    }
  }

  const widget = useRef<any>(); // Adjust type if necessary

  useEffect(() => {
    function onIdle() {
      if (!widget.current) {
        widget.current = createWidget();
      }
    }
    if ('requestIdleCallback' in window) {
      requestIdleCallback(onIdle);
    } else {
      setTimeout(onIdle, 0);
    }
  }, []);

  function open() {
    if (widget.current) {
      widget.current.open();      
    }
  }

  return (
    <div>
      
      <Button onClick={open}>Upload Image</Button>
      {/* {uploadedImageUrl && (
        <div>
          <p>Uploaded Image URL:</p>
       
            <img src={uploadedImageUrl} alt="" />
          
        </div>
      )} */}

   {/* <DropZone onClick={open} >
   <Icon
  source={UploadIcon}
  tone="base"
/>
    </DropZone> */}

    </div>
  );
}

export default Uploadwidget;
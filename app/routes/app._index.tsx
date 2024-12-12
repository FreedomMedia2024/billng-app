import { useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  InlineStack,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("Database URL: ", process.env.DATABASE_URL);
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
          variants: [{ price: Math.random() * 100 }],
        },
      },
    },
  );
  const responseJson = await response.json();

  return json({
    product: responseJson.data?.productCreate?.product,
  });
};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();
  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";
  const productId = actionData?.product?.id.replace(
    "gid://shopify/Product/",
    "",
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId]);
  const generateProduct = () => submit({}, { replace: true, method: "POST" });
  const openproducts =() =>{
    window.location.href = '/app/new-product';
  }

  return (
    <Page>
      <ui-title-bar title="Patch customizer">
      </ui-title-bar>
      <BlockStack gap="500">
        <Layout >
          <Layout.Section >
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                <Text as="h2" variant="headingMd">
  Welcome to the Patch customizer App 🎉 - Elevate Your Income with Customizable Apparel Solutions
</Text>
<Text as="p">
  Unlock the potential to boost your monthly earnings with our innovative app, designed to offer unparalleled customization options for shirts. This app empowers you to add personalized patches and alphabets to your apparel, allowing your customers to tailor their shirts to their unique preferences. Provide a flexible and creative solution that meets the individual needs of your customers, enhancing their shopping experience and driving your sales growth.
</Text>
<Text as="h2" variant="headingMd">
                    Next steps
                  </Text>
                  <List>
  <List.Item>
    Start by adding a DropZone to the products you want to customize. <Link to="/app/new-product">Dropzone</Link>
  </List.Item>
  <List.Item>
    Add the desired patches to the shirts for a unique touch. <Link to="/app/patches">Patches</Link>
  </List.Item>
  <List.Item>
    Incorporate the alphabets you wish to add to the shirts for personalized customization. <Link to="/app/alphabets">Alphabets</Link>
  </List.Item>
</List>


                  
                  
                </BlockStack>
         
           
                {actionData?.product && (
                  <Box
                    padding="400"
                    background="bg-surface-active"
                    borderWidth="025"
                    borderRadius="200"
                    borderColor="border"
                    overflowX="scroll"
                  >
                    <pre style={{ margin: 0 }}>
                      <code>{JSON.stringify(actionData.product, null, 2)}</code>
                    </pre>
                  </Box>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>
       
        </Layout>
      </BlockStack>
    </Page>
  );
}

import {
    Page,
    Box,
    Card,
    CalloutCard,
    Text,
    Grid,
    Divider,
    BlockStack,
    ExceptionList
  } from "@shopify/polaris";
  import { json  } from "@remix-run/node"; // Ensure correct import
  import { useLoaderData } from "@remix-run/react";
  import { LoaderFunction , ActionFunctionArgs  } from '@remix-run/node';
  import { authenticate, MONTHLY_PLAN } from "../shopify.server";
  import dropzone from 'app/routes/style/dropzone.module.css';


  interface Plan {
    name: string;
    id: string;
    title: string;
    description: string;
    price: string;
    features: string[];
    url: string;
    action: string;
  }
  
  const planData: Plan[] = [
    {
      name: "Monthly subscription",
      id: "monthly",
      title: "Monthly Plan",
      description: "Best for monthly subscribers",
      price: "750",
      features: ["Allow to add unlimmited Patches", "Allow to add unlimmited Alphabets", "Allow to edit Dropzone of unlimmited shirts"],
      url: "/app/alphabets",
      action:"upgrade",
    }
    // Add more plans as needed
  ];
  
export const loader: LoaderFunction = async ({ request }: { request: Request }) => {
    const { billing } = await authenticate.admin(request);
  
    try {
      // Attempt to check if the shop has an active payment for any plan
      const billingCheck = await billing.require({
        plans: [MONTHLY_PLAN],
        isTest: true,
        // Instead of redirecting on failure, just catch the error
        onFailure: () => {
          throw new Error('No active plan');
        },
      });
  
      // If the shop has an active subscription, log and return the details
      const subscription = billingCheck.appSubscriptions[0];
      console.log(`Shop is on ${subscription.name} (id ${subscription.id})`);
      return json({ billing, plan: subscription });
  
    } catch (error) {
      if (error instanceof Error && error.message === 'No active plan') {
        console.log('Shop does not have any active plans.');
        return json({ billing, plan: { name: "Free" } });
      }
      // If there is another error, rethrow it
      throw error;
    }
  };
  

  
  export default function PricingPage() {
    const loaderData = useLoaderData<{ plan: Plan | null }>(); // Adjust the type based on your loader's return type
    const plan = loaderData?.plan || planData[0]; // Fallback to the first plan if no plan is loaded
  
    console.log('plan name', plan);
    console.log(dropzone);
    return (
      <Page>
        <ui-title-bar title="Pricing" />

        {plan.name === "Monthly subscription" ? (
           <CalloutCard
           title="Cancel your plan"
           illustration="https://cdn.shopify.com/s/files/1/0583/6465/7734/files/tag.png?v=1705280535"
           primaryAction={{
             content: 'Cancel Plan',
             url: '/app/cancel',
           }}
         >
             <p>
               You're currently on pro plan. All features are unlocked.
             </p>
          
         </CalloutCard>
          ) : (

            
            <CalloutCard
            title="Free plan"
            illustration="https://cdn.shopify.com/s/files/1/0583/6465/7734/files/tag.png?v=1705280535"
            primaryAction={{
              content: 'Upgrade Plan',
              url: '/app/upgrade',
            }}
          >
              <p>
                You're currently on free plan. All features are locked.
              </p>
              {planData.map((plan_item, index) => ( 
               

               <div  className={`${dropzone.upgradewrappdiv}`}  style={{ 
                display: 'flex', 
                flexDirection: 'column',  // Use camelCase here
                margin: '20px 0', 
                gap: '9px' 
              }}  >
               <Text as="h3" variant="headingMd">
                 {plan_item.title}
                
               </Text> 
               <Text as="p" variant="headingLg" fontWeight="bold"> {plan_item.price === "0" ? "" : "$" + plan_item.price}</Text>
               <BlockStack >
                    {plan_item.features.map((feature, index) => (
                      <ExceptionList
                        key={index}
                        items={[
                          {
                            description: feature,
                          },
                        ]}
                      />
                    ))}
                  </BlockStack>
               </div>
              ))}
          </CalloutCard>
          
          )}
       
      </Page>
    );
  }
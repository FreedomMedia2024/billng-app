import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { authenticate, MONTHLY_PLAN } from "../shopify.server";
import { json  } from "@remix-run/node"; // Ensure correct import

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { billing, session } = await authenticate.admin(request);
  let { shop } = session;
  let  myShop  = shop.replace(".myshopify.com","");
  console.log("shop")
  console.log("myShop",myShop)
  await billing.require({
    plans: [MONTHLY_PLAN],
    onFailure: async () => billing.request({
      plan: MONTHLY_PLAN,
      isTest: true,
      returnUrl: `https://admin.shopify.com/store/${myShop}/apps/patch-customizer/app/price`,
    }),
  });
 
  return redirect('/app/price');
  // App logic
};

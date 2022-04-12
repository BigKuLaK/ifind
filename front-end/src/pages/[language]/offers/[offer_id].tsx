import OffersPage from "@pages/Offers";
import { BaseContext } from "next/dist/shared/lib/utils";

export const getStaticPaths = async () => {
  return {
    paths: [
      {
        params: {
          language: "en",
          offer_id: "merchant",
        },
      },
    ],
    fallback: true, // false or 'blocking'
  };
};

export const getStaticProps = async (route: BaseContext) => {
  // Sanitize data so as to replace undefined values with null
  const sanitizedRouteData = Object.entries(route).reduce(
    (data, [key, value]: [string, any]) => {
      data[key] = typeof value === "undefined" ? null : value;
      return data;
    },
    {}
  );

  return {
    props: sanitizedRouteData,
  };
};

export default OffersPage;

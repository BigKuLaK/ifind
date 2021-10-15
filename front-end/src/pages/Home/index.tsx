// import { useState, useEffect } from "react";
import {
  useProductsByDeals,
  ProductsByDealsContextProvider,
} from "@contexts/productsByDealsContext";
import GeneralTemplate from "@templates/GeneralTemplate";
import ProductDealsGrid from "@components/ProductDealsGrid";
import React from "react";

const Home: React.FunctionComponent = () => {
  const { productsByDeals } = useProductsByDeals();

  return (
    <GeneralTemplate>
      <div className="home">
        <div className="container" style={{ paddingLeft: "280px" }}>
          {(productsByDeals || []).map((productsByDeal => (
            <ProductDealsGrid key={productsByDeal.deal_type.name} {...productsByDeal}/>
          )))}
        </div>
      </div>
    </GeneralTemplate>
  );
};

const HomePageWrapped: NamedComponent = ({ children }) => (
  <ProductsByDealsContextProvider>
    <Home>{children}</Home>
  </ProductsByDealsContextProvider>
);

HomePageWrapped.componentName = 'HomePage';

export default HomePageWrapped;

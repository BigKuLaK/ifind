import ProductDealItem from "./item";

import "./styles.scss";

const ProductDealsGrid: ProductDealsGridComponent = ({
  products,
  deal_type,
}) => {
  return (
    <div className="product-deals-grid">
      <div className="product-deals-grid__heading">{deal_type.label}</div>
      {products.length ? (
        <div className="product-deals-grid__items">
          {products.map((product) => (
            <ProductDealItem key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <p className="product-deals-grid__empty">No products yet.</p>
      )}
    </div>
  );
};

export default ProductDealsGrid;

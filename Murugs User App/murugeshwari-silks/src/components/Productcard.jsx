import { Link } from "react-router-dom";
import "./Productcard.css";

function ProductCard({ product }) {
  console.log(product);
  return (
    <Link to={`/product/${product.id}`} className="product-card">

      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-info">

        <h3 className="product-name">{product.name}</h3>
<div className="product-price">
  {product.offerPrice && product.offerPrice < product.price ? (
    <>
      <span className="current-price">
        ₹{product.offerPrice}
      </span>

      <span className="old-price">
        ₹{product.price}
      </span>

      <span className="discount">
        {Math.round(
          ((product.price - product.offerPrice) / product.price) * 100
        )}% OFF
      </span>
    </>
  ) : (
    <span className="current-price">
      ₹{product.price}
    </span>
  )}
</div>
       
      </div>

    </Link>
  );
}

export default ProductCard;
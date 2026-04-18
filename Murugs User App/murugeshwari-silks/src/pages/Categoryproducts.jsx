import { useParams } from "react-router-dom";
import "./Categoryproducts.css";
import ProductCard from "../components/Productcard";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, where, query } from "firebase/firestore";

function CategoryProducts() {
  const { name } = useParams(); // ✅ correct usage

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const q = query(
          collection(db, "sarees"), // ✅ correct collection
          where("category", "==", name.toLowerCase())
        );

        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => {
          const d = doc.data();

          return {
            id: doc.id,
            name: d.name,
            offerPrice: d.offerPrice,
            price: d.price ,
            discount: d.discount,
            image: d.images?.[0]?.url || ""
          };
        });

        console.log("Fetched data:", data);

        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [name]); // ✅ important

  return (
    <div className="category-page">
      <div className="category-header">
        <h1 className="category-title">
          {name?.charAt(0).toUpperCase() + name?.slice(1)} 
        </h1>

        <p className="category-subtitle">
          Discover our beautiful collection
        </p>

        <div className="category-line"></div>
      </div>

      <div className="products-container">
        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>oops!....No products found</p>
        ) : (
          products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))
        )}
      </div>
    </div>
  );
}

export default CategoryProducts;
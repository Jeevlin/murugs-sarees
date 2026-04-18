import "./Inventory.css"
import { FaEdit, FaTrash } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import SareeModal from "../components/SareeModal"
import { query,limit,startAfter,doc,addDoc,getDocs,updateDoc,deleteDoc,collection,orderBy,Timestamp } from "firebase/firestore";
import { db } from "../firebase"
import { useEffect } from "react"

function Inventory(){
  const emptyForm = {
  name: "",
  brand: "",
  category: "",

  price: "",
  offerPrice: "",
  discount: "",

  stock: "",
  description: "",

  specifications: {
    productType: "",
    fabric: "",
    color: "",
    blousePiece: "no",
    length: "",
    width: ""
  },

  images: [],
  isFeatured: false
};
const [search,setSearch] = useState("")
const [showModal, setShowModal] = useState(false)
const [isEdit, setIsEdit] = useState(false)
const [editId, setEditId] = useState(null)
const [deleteId, setDeleteId] = useState(null)
const navigate = useNavigate()
const [products, setProducts] = useState([])
const [lastDoc, setLastDoc] = useState(null);
const [loading, setLoading] = useState(true);
const [loadingMore, setLoadingMore] = useState(false);

const [formData, setFormData] = useState({
  name: "",
  brand: "",
  category: "",

  price: "",
  offerPrice: "",
  discount: "",

  stock: "",

  description: "",

  specifications: {
    productType: "",
    fabric: "",
    color: "",
    blousePiece: "",
    length: "",
    width: ""
  },

  images: [],
  isFeatured: false
})

// Fetch products with pagination
const fetchProducts = async () => {
  setLoading(true);
  const q = query(
    collection(db, "sarees"),
    orderBy("createdAt", "desc"),
    limit(10)
  );

  const snapshot = await getDocs(q);

  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
 
  setProducts(data);
  setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
  setLoading(false);
};
useEffect(() => {
  fetchProducts();
}, [search]);

const fetchMoreProducts = async () => {
  if (!lastDoc) return;

  setLoadingMore(true);

  const q = query(
    collection(db, "sarees"),
    orderBy("createdAt", "desc"),
    startAfter(lastDoc),
    limit(10)
  );

  const snapshot = await getDocs(q);

  // ✅ check AFTER fetch
  if (snapshot.docs.length === 0) {
    setLastDoc(null); // stop further loading
    setLoadingMore(false);
    return;
  }

  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  setProducts(prev => [...prev, ...data]);

  setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

  setLoadingMore(false);
};



const handleAdd = async (finalData) => {
  try {
    await addDoc(collection(db, "sarees"), {
      ...finalData,
      createdAt: Timestamp.now()
    })

    alert("Saree added!")

    setShowModal(false)
    fetchProducts()

  } catch (error) {
    console.log(error)
  }
}


const handleUpdate = async (finalData) => {
  try {
    await updateDoc(doc(db, "sarees", editId), {
      ...finalData,
      createdAt: Timestamp.now()
    })

    alert("Updated successfully!")

    setShowModal(false)
    setIsEdit(false)
    setEditId(null)
    fetchProducts()

  } catch (err) {
    console.log(err)
  }
}
const handleDelete = async () => {
  try {
    await deleteDoc(doc(db, "sarees", deleteId))

    alert("Deleted!")

    setDeleteId(null)
    fetchProducts()

  } catch (error) {
    console.log(error)
  }
}
const filteredProducts = products.filter(product =>
  product.name.toLowerCase().includes(search.toLowerCase())
)

return(

<div className="inventory-container">

  <div className="inventory-header">
    <h1>Inventory</h1>
      <div className="inventory-actions">

      <input
        type="text"
        placeholder="Search product..."
        className="search-input"
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      />


    <button className="add-btn"onClick={() => {
  setFormData(emptyForm);   // 🔥 RESET
  setIsEdit(false);
  setEditId(null);
  setShowModal(true);
}}>
      Add Saree
    </button>
  </div>
</div>
  {loading ? <p>Loading products...</p> : (

<table className="inventory-table">

    <thead>
      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Price</th>
        <th>Stock</th>
        <th>Category</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>

      {filteredProducts.map(product => (

        <tr key={product.id}
          className="inventory-row"
        >

          <td>
           <img src={product.images?.[0]?.url} alt={product.name} width="60" />
          </td>

          <td>{product.name}</td>

          <td>₹{product.price}</td>
          <td>{product.stock}</td>
          <td>{product.category}</td>

         <td>
  <div className="actions">

   <button
  onClick={(e)=>{
    e.stopPropagation()

    setIsEdit(true)
    setShowModal(true)
    setEditId(product.id)

    setFormData({
 ...product, // 🔥 FULL DATA

    // 🔥 important: ensure structure
    specifications: {
      productType: product.specifications?.productType || "",
      fabric: product.specifications?.fabric || "",
      color: product.specifications?.color || "",
      blousePiece: product.specifications?.blousePiece || "no",
      length: product.specifications?.length || "",
      width: product.specifications?.width || ""
    },

    images: product.images || [],
    isFeatured: product.isFeatured || false
    })
  }}
  className="edit-btn"
>
  <FaEdit />
</button>

 <button
  onClick={(e)=>{
    e.stopPropagation()
    setDeleteId(product.id)
  }}
  className="delete-btn"
>
  <FaTrash />
</button>

  </div>
</td>

        </tr>

      ))}

    </tbody>

  </table>)}
  {lastDoc && (
  <div className="load-more-container">
    <button onClick={fetchMoreProducts} disabled={loadingMore}>
      {loadingMore ? "Loading..." : "Load More"}
    </button>
  </div>
)}
  <SareeModal
  isOpen={showModal}
  onClose={() => {
  setShowModal(false);
  setIsEdit(false);
  setEditId(null);
  setFormData(emptyForm); // 🔥 reset on close also
}}
  onSave={isEdit ? handleUpdate : handleAdd}
  formData={formData}
  setFormData={setFormData}
  isEdit={isEdit}
/>
{deleteId && (
  <div className="modal-overlay">

    <div className="modal" onClick={(e)=>e.stopPropagation()}>

      <h3>Delete Saree</h3>
      <p>Are you sure you want to delete this saree?</p>

      <div className="modal-buttons">

        <button className="delete-btn" onClick={handleDelete}>
          Yes, Delete
        </button>

        <button
          className="cancel-btn"
          onClick={() => setDeleteId(null)}
        >
          Cancel
        </button>

      </div>

    </div>

  </div>
)}
</div>

)

}

export default Inventory
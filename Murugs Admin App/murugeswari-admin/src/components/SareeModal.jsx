import { useState,useEffect } from "react"
import "./SareeModal.css"
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { addDoc,Timestamp } from "firebase/firestore";




function SareeModal({ isOpen, onClose, onSave, formData, setFormData, isEdit }) {

const [categories, setCategories] = useState([]);
 const [loading, setLoading] = useState(false)

 // Fetch price and offer price from formData to calculate discount
useEffect(() => {
  const price = Number(formData.price);
  const offer = Number(formData.offerPrice);

  if (price > 0 && offer > 0 && offer < price) {
    const discount = Math.round(((price - offer) / price) * 100);

    setFormData((prev) => ({
      ...prev,
      discount: discount
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      discount: ""
    }));
  }
}, [formData.price, formData.offerPrice]);

// Fetch categories for dropdown
 useEffect(() => {
  const fetchCategories = async () => {
    const snap = await getDocs(collection(db, "categories"));

    const list = [];
    snap.forEach(doc => {
      list.push(doc.data().name); // assuming { name: "Cotton" }
    });

    setCategories(list);
  };

  fetchCategories();
}, []);


  if (!isOpen) return null
// Helper function to upload images to Cloudinary
const uploadToCloudinary = async (files) => {
  const urls = []

  for (let file of files) {
    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: data
      }
    )

    const result = await res.json()

    urls.push({
      url: result.secure_url,
      public_id: result.public_id
    })
  }

  return urls
}
// Handle save (add or update)
const handleSave = async () => {
  try {
    setLoading(true)  // 🔥 start loading

    if (!formData.images || formData.images.length === 0) {
      alert("Please select at least one image")
      setLoading(false)
      return
    }

  let imageUrls = [];

if (formData.images[0] instanceof File) {
  // 🆕 new upload
  imageUrls = await uploadToCloudinary(formData.images);
} else {
  // ✏️ edit mode → keep old images
  imageUrls = formData.images;
}

    const finalData = {
      ...formData,
      images: imageUrls,
      category: formData.category.toLowerCase(),
      price: Number(formData.price),
      offerPrice: Number(formData.offerPrice),
      discount: Number(formData.discount),
      stock: Number(formData.stock),
        views: formData.views || 0,
  createdAt: formData.createdAt || new Date(),
  isReadyToShip: true
    }

    console.log(finalData)

    onSave(finalData)

  } catch (err) {
    console.error(err)
    alert("Upload failed 😢")
  } finally {
    setLoading(false) // 🔥 stop loading
  }
}

// Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }
// Handle specifications changes
  const handleSpecChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        [name]: value
      }
    })
  }
// Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)

    setFormData({
      ...formData,
      images: files
    })
  }



  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal large" onClick={(e) => e.stopPropagation()}>

        <h2>{isEdit ? "Edit Saree" : "Add Saree"}</h2>

        {/* BASIC */}
        <div className="section">
          <h3>Basic Info</h3>
<div className="section-content">
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
          <input name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} />
          </div>
          </div>
          <div className="section">
          <h3>Category</h3>
          <div className="section-content"> 
<select name="category" value={formData.category} onChange={handleChange}>
  <option value="">Select Category</option>

  {categories.map((cat, i) => (
    <option key={i} value={cat.toLowerCase()}>
      {cat}
    </option>
  ))}

</select>
          </div>
        </div>
        

        {/* PRICING */}
        <div className="section">
          <h3>Pricing</h3>
     <div className="section-content">
          <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} />
          <input name="offerPrice" type="number" placeholder="Offer Price" value={formData.offerPrice} onChange={handleChange} />
          <input name="discount" type="number" placeholder="Discount %" value={formData.discount} onChange={handleChange} />
        </div>
        </div>

        {/* STOCK */}
        <div className="section">
          <h3>Stock</h3>
          <div className="section-content">
           <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} />
          </div>
        </div>
          

        {/* SPEC */}
        <div className="section">
          <h3>Specifications</h3>
<div className="section-content">
          <input name="productType" value={formData.specifications?.productType||""} onChange={handleSpecChange} placeholder="Product Type"/>
          <input name="fabric" value={formData.specifications?.fabric||""} onChange={handleSpecChange} placeholder="Fabric"/>
          <input name="color" value={formData.specifications?.color||""} onChange={handleSpecChange} placeholder="Color"/>
          <select
  name="blousePiece"
  value={formData.specifications?.blousePiece || "no"}
  onChange={handleSpecChange}
>
  <option value="yes">Yes</option>
  <option value="no">No</option>
</select>
          <input name="length" value={formData.specifications?.length||""} onChange={handleSpecChange} placeholder="Length"/>
          <input name="width" value={formData.specifications?.width||""} onChange={handleSpecChange} placeholder="Width"/>
        </div>
</div>
        {/* DESCRIPTION */}
        <div className="section">
          <h3>Description</h3>
          <div className="section-content">
          <textarea name="description" value={formData.description} onChange={handleChange}/>
        </div>
        </div>

        {/* FEATURED */}
        <div className="section">
          <label>
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e)=>setFormData({...formData, isFeatured: e.target.checked})}
            />
            Featured Product
          </label>
        </div>

        {/* IMAGE UPLOAD */}
        <div className="section">
          <h3>Images</h3>
          <div className="section-content">
<label className="upload-box">
  Upload Images
  <input type="file" multiple hidden onChange={handleImageChange} />
</label>



{/* Preview */}

          <div className="preview">
            {formData.images?.map((img, i) => (
              <img
                key={i}
                src={img instanceof File
    ? URL.createObjectURL(img)
    : img.url}
                alt="preview"
                width="60"
              />
            ))}
          </div>
        </div>
</div>
        {/* BUTTONS */}
        <div className="modal-buttons">
          <button className="save-btn" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update" : "Save"}
          </button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>

      </div>
    </div>
  )
}

export default SareeModal
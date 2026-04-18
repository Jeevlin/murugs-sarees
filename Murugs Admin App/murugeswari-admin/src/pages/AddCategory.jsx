import { useState } from "react"
import { collection, addDoc } from "firebase/firestore"
import { db } from "../firebase"
import {  getDocs } from "firebase/firestore"
import { useEffect } from "react"
import { deleteDoc, doc,Timestamp } from "firebase/firestore";
import "./AddCategory.css"

function AddCategory() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState("")
  const [category, setCategory] = useState("")
  const [categories, setCategories] = useState([])

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, "categories"))

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setCategories(data)
    } catch (error) {
      console.error(error)
    }
  }

  fetchCategories()
}, [])

const uploadImage = async () => {
  const formData = new FormData()
  formData.append("file", image)
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData
    }
  )

  const data = await res.json()
  console.log("Cloudinary response:", data)

  return data.secure_url
}

  const handleAdd = async () => {
  if (!category.trim() || !image) {
    alert("Enter category and select image")
    return
  }


  try {
    const imageUrl = await uploadImage()

    const docRef = await addDoc(collection(db, "categories"), {
      name: category,
      imageUrl,
      createdAt: Timestamp.now()
    })

    // 👇 add this
    setCategories(prev => [
      ...prev,
      {
        id: docRef.id,
        name: category,
        imageUrl
      }
    ])

    alert("Category added successfully")

    setCategory("")
    setImage(null)
    setPreview("")
  } catch (error) {
    console.error(error)
  }
}

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Delete this category?");

  if (!confirmDelete) return;

  try {
    // 🔥 delete from Firestore
    await deleteDoc(doc(db, "categories", id));

    // 🔥 update UI
    setCategories(prev => prev.filter(cat => cat.id !== id));

  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="category-container">
      <h1>Manage Categories</h1>

<div className="category-input">

  {/* LEFT → IMAGE PREVIEW */}
  <div className="image-upload">

    {preview ? (
      <img src={preview} alt="preview" />
    ) : (
      <div className="image-placeholder">No Image</div>
    )}

    <label className="upload-btn">
      Change Image
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files[0];
          setImage(file);
          setPreview(URL.createObjectURL(file));
        }}
      />
    </label>

  </div>

  {/* RIGHT → INPUT + BUTTON */}
  <div className="category-form">

    <input
      type="text"
      placeholder="Enter category"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    />

    <button onClick={handleAdd}>
      Add Category
    </button>

  </div>

</div>
      <div className="category-list">
  {categories.map(cat => (
    <div key={cat.id} className="category-item">
      <img src={cat.imageUrl} width="80" />
        {/* 🔥 DELETE BUTTON */}
      
      <p>{cat.name}</p>
      <button
        className="cat-delete-btn"
        onClick={() => handleDelete(cat.id)}
      >
       x
      </button>
    </div>
  ))}
</div>
    </div>
  )
}

export default AddCategory
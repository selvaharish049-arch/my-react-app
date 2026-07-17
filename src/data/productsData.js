// Async API calls to python Flask backend

export const getAllProducts = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/products');
    if (!res.ok) throw new Error("Backend response error");
    return await res.json();
  } catch (e) {
    console.error("Failed to fetch products from Flask backend:", e);
    return []; // Return empty list on failure
  }
};

export const addCustomProduct = async (formData) => {
  try {
    const res = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      body: formData // Send as multipart/form-data for file upload
    });
    if (!res.ok) throw new Error("Failed to add product");
    return await res.json();
  } catch (e) {
    console.error("Failed to add custom product to Flask backend:", e);
    return null;
  }
};

export const deleteCustomProduct = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error("Failed to delete product");
    return await res.json();
  } catch (e) {
    console.error(`Failed to delete product ${id} from Flask backend:`, e);
    return { success: false };
  }
};

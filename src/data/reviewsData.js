// Async API calls for reviews to python Flask backend

export const getAllReviews = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/reviews');
    if (!res.ok) throw new Error("Backend reviews response error");
    return await res.json();
  } catch (e) {
    console.error("Failed to fetch reviews from Flask backend:", e);
    return [];
  }
};

export const deleteReview = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/reviews/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error("Failed to delete review");
    return await res.json();
  } catch (e) {
    console.error(`Failed to delete review ${id} from Flask backend:`, e);
    return { success: false };
  }
};

export const addReview = async (review) => {
  try {
    const res = await fetch('http://localhost:5000/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(review)
    });
    if (!res.ok) throw new Error("Failed to add review");
    return await res.json();
  } catch (e) {
    console.error("Failed to add review to Flask backend:", e);
    return null;
  }
};

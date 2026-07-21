// Fast local reviews storage with immediate fallback and non-blocking background sync

const initialReviews = [
  { id: 1, name: 'Ananya Sharma', rating: 5, comment: 'Exceptional craftsmanship! The modular kitchen was installed on time and looks stunning.', date: '2026-05-12' },
  { id: 2, name: 'Vikram Patel', rating: 5, comment: 'Custom wardrobe quality exceeded my expectations. Smooth sliding doors and luxury finish.', date: '2026-06-04' },
  { id: 3, name: 'Priya Sundaram', rating: 4, comment: 'Great living room interior consultation. Very professional team and timely delivery.', date: '2026-06-20' }
];

const LOCAL_REVIEWS_KEY = 'luxe_custom_reviews_v2';

const getStoredReviews = () => {
  try {
    const stored = localStorage.getItem(LOCAL_REVIEWS_KEY);
    return stored ? JSON.parse(stored) : initialReviews;
  } catch (e) {
    return initialReviews;
  }
};

const saveStoredReviews = (reviews) => {
  try {
    localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error("Error saving reviews to localStorage:", e);
  }
};

export const getAllReviews = async () => {
  const localReviews = getStoredReviews();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const res = await fetch('https://selvaharish-interior-back.onrender.com/api/reviews', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const serverReviews = await res.json();
      if (Array.isArray(serverReviews) && serverReviews.length > 0) {
        return serverReviews;
      }
    }
  } catch (e) {
    // Fast local fallback
  }
  return localReviews;
};

export const deleteReview = async (id) => {
  const current = getStoredReviews();
  const updated = current.filter(r => r.id.toString() !== id.toString());
  saveStoredReviews(updated);

  fetch(`https://selvaharish-interior-back.onrender.com/api/reviews/${id}`, {
    method: 'DELETE'
  }).catch(() => {});

  return { success: true };
};

export const addReview = async (review) => {
  const current = getStoredReviews();
  const newRev = { ...review, id: Date.now(), date: new Date().toISOString().split('T')[0] };
  const updated = [newRev, ...current];
  saveStoredReviews(updated);

  fetch('https://selvaharish-interior-back.onrender.com/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review)
  }).catch(() => {});

  return newRev;
};

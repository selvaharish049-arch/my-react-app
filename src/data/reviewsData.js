// Fast local reviews storage with immediate fallback and non-blocking background sync

const initialReviews = [
  { id: 1, name: 'Ananya Sharma', rating: 5, comment: 'Exceptional craftsmanship! The modular kitchen was installed on time and looks stunning.', date: '2026-05-12' },
  { id: 2, name: 'Vikram Patel', rating: 5, comment: 'Custom wardrobe quality exceeded my expectations. Smooth sliding doors and luxury finish.', date: '2026-06-04' },
  { id: 3, name: 'Priya Sundaram', rating: 4, comment: 'Great living room interior consultation. Very professional team and timely delivery.', date: '2026-06-20' }
];

const LOCAL_REVIEWS_KEY = 'luxe_custom_reviews_v2';
const DELETED_REVIEWS_KEY = 'luxe_deleted_reviews_v2';

const getStoredReviews = () => {
  try {
    const stored = localStorage.getItem(LOCAL_REVIEWS_KEY);
    return stored ? JSON.parse(stored) : initialReviews;
  } catch (e) {
    return initialReviews;
  }
};

const getDeletedReviewIds = () => {
  try {
    const stored = localStorage.getItem(DELETED_REVIEWS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.map(id => String(id)) : [];
  } catch (e) {
    return [];
  }
};

const saveStoredReviews = (reviews) => {
  try {
    localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.error("Error saving reviews to localStorage:", e);
  }
};

const saveDeletedReviewIds = (deletedIds) => {
  try {
    localStorage.setItem(DELETED_REVIEWS_KEY, JSON.stringify(deletedIds));
  } catch (e) {
    console.error("Error saving deleted reviews to localStorage:", e);
  }
};

export const getAllReviews = async () => {
  const localReviews = getStoredReviews();
  const deletedIds = getDeletedReviewIds();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseUrl = isLocalhost ? 'http://localhost:5000' : 'https://selvaharish-interior-back.onrender.com';

    const [reviewsRes, deletedRes] = await Promise.all([
      fetch(`${baseUrl}/api/reviews`, { signal: controller.signal }),
      fetch(`${baseUrl}/api/deleted-reviews`, { signal: controller.signal }).catch(() => null)
    ]);
    clearTimeout(timeoutId);

    if (reviewsRes.ok) {
      const serverReviews = await reviewsRes.json();
      let serverDeletedIds = [];
      if (deletedRes && deletedRes.ok) {
        serverDeletedIds = await deletedRes.json();
      }

      const combinedDeletedIds = Array.from(new Set([...deletedIds, ...serverDeletedIds]));

      if (Array.isArray(serverReviews) && serverReviews.length > 0) {
        return serverReviews.filter(r => r && r.id !== undefined && r.id !== null && !combinedDeletedIds.includes(String(r.id)));
      }
    }
  } catch (e) {
    // Fast local fallback
  }

  // Filter local reviews
  const filteredLocal = localReviews.filter(r => r && r.id !== undefined && r.id !== null && !deletedIds.includes(String(r.id)));
  return filteredLocal;
};

export const deleteReview = async (id) => {
  try {
    const idStr = id !== undefined && id !== null ? String(id) : '';
    if (!idStr) {
      return { success: false };
    }

    // Track deletion locally
    const deletedIds = getDeletedReviewIds();
    if (!deletedIds.includes(idStr)) {
      deletedIds.push(idStr);
      saveDeletedReviewIds(deletedIds);
    }

    const current = getStoredReviews();
    const updated = current.filter(r => r && r.id !== undefined && r.id !== null && String(r.id) !== idStr);
    saveStoredReviews(updated);

    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseUrl = isLocalhost ? 'http://localhost:5000' : 'https://selvaharish-interior-back.onrender.com';

    try {
      await fetch(`${baseUrl}/api/reviews/${idStr}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.log("Background server delete sync failed, removed locally.");
    }

    return { success: true };
  } catch (e) {
    console.error(`Failed to delete review ${id}:`, e);
    return { success: false };
  }
};

export const addReview = async (review) => {
  const current = getStoredReviews();
  const newRev = { ...review, id: Date.now(), date: new Date().toISOString().split('T')[0] };
  const updated = [newRev, ...current];
  saveStoredReviews(updated);

  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const baseUrl = isLocalhost ? 'http://localhost:5000' : 'https://selvaharish-interior-back.onrender.com';

  fetch(`${baseUrl}/api/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newRev)
  }).catch(() => {});

  return newRev;
};

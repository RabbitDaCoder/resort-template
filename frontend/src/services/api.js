import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token logic — retry once on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken") &&
      !originalRequest.url?.includes("/admin/refresh") &&
      !originalRequest.url?.includes("/admin/login")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(`${API_URL}/api/admin/refresh`, {
          refreshToken,
        });
        const { token, refreshToken: newRefreshToken } = res.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", newRefreshToken);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        processQueue(null, token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        if (
          window.location.pathname.startsWith("/owner") &&
          !window.location.pathname.includes("/login")
        ) {
          window.location.href = "/owner/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      if (
        window.location.pathname.startsWith("/owner") &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/owner/login";
      }
    }
    return Promise.reject(error);
  },
);

// Rooms
export const getRooms = (params) => api.get("/rooms", { params });
export const getPromos = () => api.get("/rooms/promos");
export const getRoomBySlug = (slug) => api.get(`/rooms/${slug}`);
export const createRoom = (formData) =>
  api.post("/rooms", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateRoom = (id, formData) =>
  api.put(`/rooms/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateRoomPrice = (id, data) =>
  api.patch(`/rooms/${id}/price`, data);
export const deleteRoom = (id) => api.delete(`/rooms/${id}`);

// Bookings
export const createBooking = (data) =>
  api.post("/bookings", data, {
    headers: { "Idempotency-Key": crypto.randomUUID() },
  });
export const checkAvailability = (params) =>
  api.get("/bookings/availability", { params });
export const getBookedDates = (params) =>
  api.get("/bookings/booked-dates", { params });
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const getBookings = (params) => api.get("/bookings", { params });
export const updateBookingStatus = (id, status) =>
  api.patch(`/bookings/${id}/status`, { status });
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);
export const downloadReceipt = (id) =>
  api.get(`/bookings/${id}/receipt`, { responseType: "blob" });
export const sendReceipt = (bookingId) =>
  api.post("/bookings/send-receipt", { bookingId });

// Payments
export const getPaymentDetails = () => api.get("/payments/details");
export const updatePaymentDetails = (data) =>
  api.put("/payments/details", data);
export const uploadPaymentProof = (id, formData) =>
  api.patch(`/payments/${id}/proof`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Admin / Auth
export const loginAdmin = (data) => api.post("/admin/login", data);
export const refreshToken = (refreshToken) =>
  api.post("/admin/refresh", { refreshToken });
export const logoutAdmin = (refreshToken) =>
  api.post("/admin/logout", { refreshToken });
export const checkAuth = () => api.get("/admin/me");
export const getDashboard = () => api.get("/admin/dashboard");
export const seedAdmin = () => api.post("/admin/seed");

// Settings
export const getSettings = () => api.get("/settings/payment");
export const updateSettings = (data) => api.put("/settings/payment", data);

// Discounts
export const getDiscounts = () => api.get("/discounts");
export const createDiscount = (data) => api.post("/discounts", data);
export const updateDiscount = (id, data) => api.put(`/discounts/${id}`, data);
export const deleteDiscount = (id) => api.delete(`/discounts/${id}`);
export const toggleDiscount = (id) => api.patch(`/discounts/${id}/toggle`);
export const getActiveDiscountForRoom = (roomId, params) =>
  api.get(`/discounts/active-for-room/${roomId}`, { params });

// Installments
export const confirmInstallment = (bookingId, installmentNumber) =>
  api.patch(`/bookings/${bookingId}/confirm-installment`, {
    installmentNumber,
  });
export const sendInstallmentReminder = (bookingId) =>
  api.patch(`/bookings/${bookingId}/send-reminder`);
export const generatePaymentLink = (bookingId, sendEmail = false) =>
  api.post(`/bookings/${bookingId}/generate-payment-link`, { sendEmail });
export const getContinuationBooking = (token) =>
  api.get(`/bookings/continue/${token}`);

// Social & Contact
export const getSocialLinks = () => api.get("/social/links");
export const updateSocialLinks = (data) =>
  api.put("/social/links/update", data);

export default api;

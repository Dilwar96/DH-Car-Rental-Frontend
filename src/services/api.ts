import axios from "axios";

const API_URL = "http://localhost:5003/api";

export interface Car {
  _id: string;
  name: string;
  brand: string;
  modelName: string;
  year: number;
  price: number;
  transmission: string;
  fuelType: string;
  seats: number;
  mileage: string;
  image: string;
  available: boolean;
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Booking {
  _id: string;
  userId: string;
  carId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  message?: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  car?: {
    name: string;
    brand: string;
    modelName: string;
    price: number;
  };
}

interface CarService {
  getAll: () => Promise<Car[]>;
  getById: (id: string) => Promise<Car>;
  create: (carData: Omit<Car, "_id">) => Promise<Car>;
  update: (id: string, carData: Partial<Car>) => Promise<Car>;
  delete: (id: string) => Promise<void>;
}

interface MessageService {
  getAll: () => Promise<Message[]>;
  create: (
    data: Omit<Message, "_id" | "read" | "createdAt">
  ) => Promise<Message>;
  markAsRead: (id: string) => Promise<Message>;
}

export interface BookingService {
  getAll: () => Promise<Booking[]>;
  getMyBookings: () => Promise<Booking[]>;
  create: (data: {
    carId: string;
    startDate: Date;
    endDate: Date;
    message?: string;
  }) => Promise<Booking>;
  cancel: (id: string) => Promise<void>;
  updateStatus: (
    id: string,
    status: "pending" | "confirmed" | "cancelled"
  ) => Promise<Booking>;
  delete: (id: string) => Promise<void>;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post("/auth/register", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
  },
  updateProfile: async (formData: FormData) => {
    const response = await api.put("/auth/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // Update the userInfo in localStorage with the new data
    if (response.data.user) {
      const currentUserInfo = JSON.parse(
        localStorage.getItem("userInfo") || "{}"
      );
      const updatedUserInfo = { ...currentUserInfo, ...response.data.user };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
    }
    return response.data;
  },
};

export const cars: CarService = {
  getAll: async () => {
    const response = await api.get("/cars");
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  },
  create: async (carData: Omit<Car, "_id">) => {
    const response = await api.post("/cars", carData);
    return response.data;
  },
  update: async (id: string, carData: Partial<Car>) => {
    const response = await api.put(`/cars/${id}`, carData);
    return response.data;
  },
  delete: async (id: string) => {
    try {
      console.error("Attempting to delete car with ID:", id);
      const token = localStorage.getItem("token");
      console.error("Token available:", token ? "Yes" : "No");
      const response = await api.delete(`/cars/${id}`);
      console.error("Delete response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting car:", error);
      throw error;
    }
  },
};

export const messages: MessageService = {
  getAll: async () => {
    const response = await api.get("/messages");
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/messages", data);
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await api.put(`/messages/${id}`);
    return response.data;
  },
};

export const bookings: BookingService = {
  getAll: async () => {
    const response = await api.get("/bookings");
    return response.data;
  },
  getMyBookings: async () => {
    const response = await api.get("/bookings/my-bookings");
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/bookings", data);
    return response.data;
  },
  cancel: async (id) => {
    await api.post(`/bookings/${id}/cancel`);
  },
  updateStatus: async (id, status) => {
    const response = await api.put(`/bookings/${id}`, { status });
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/bookings/${id}`);
  },
};

export default api;

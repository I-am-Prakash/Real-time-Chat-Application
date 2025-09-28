import { create } from "zustand";
import { axiosObj } from "../utils/axios.js";
import toast from "react-hot-toast";

const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  //   When we reload we need to check weather the user is already Authenticated - we show loading spinner in middle of screen.
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosObj.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error while checking auth", error);
      toast.error(error.response.data);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (formData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosObj.post("auth/signup", formData);
      toast.success("Account created Successfully, Please login now");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error sent by server - bad request", error);
      toast.error(error.response.data);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosObj.post("/auth/login", formData);
      set({ authUser: res.data });
      toast.success("Logged In Successfully");
      get().connectSocket();
    } catch (error) {
      console.log("Error sent by server - bad request", error);
      toast.error(error.response.data);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
      get().disconnectSocket();
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  logout: async () => {
    try {
      await axiosObj.post("/auth/logout");
      toast.success("Logged Out Successfully");
      set({ authUser: null });
    } catch (error) {
      console.log("Error while logging out - bad request", error);
      toast.error(error.response.data);
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));

export default useAuthStore;

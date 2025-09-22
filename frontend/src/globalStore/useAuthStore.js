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

  checkAuth: async () => {
    try {
      const res = await axiosObj.get("/auth/check");

      set({ authUser: res.data });
    } catch (error) {
      console.log("Error while checking auth", error.message);
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
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
}));

export default useAuthStore;

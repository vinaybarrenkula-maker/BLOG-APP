import { useForm } from "react-hook-form";
import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  linkClass,
  loadingClass,
} from "../styles/common";
import { NavLink, useNavigate, Navigate } from "react-router";
import { useAuth } from "../store/authStore";
import { useEffect, useRef } from "react";
import {toast} from 'react-hot-toast'

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const hasRedirected = useRef(false);
  //get state from auth store
  const { login, currentUser, loading, error, isAuthenticated } = useAuth((state) => state);

  //on user login
  const onUserLogin = (userCredObj) => {
    //call login() of auth store
    hasRedirected.current = false;
    login(userCredObj);
  };

  useEffect(() => {
    //navigation logic
    if (isAuthenticated && currentUser && !hasRedirected.current) {
      hasRedirected.current = true;
      const role = currentUser.role?.toUpperCase() || "";
      if (role === "USER") {
        toast.success("Login successful! Redirecting to profile",{duration:2000});
        navigate("/user-profile");
      } else if (role === "AUTHOR") {
        toast.success("Login successful! Redirecting to profile",{duration:2000});
        navigate("/author-profile");
      } else if (role === "ADMIN") {
        toast.success("Login successful! Redirecting to dashboard",{duration:2000});
        navigate("/admin-profile");
      } else {
        toast.success("Login successful",{duration:2000});
        navigate("/");
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  //deal with loading
  // if (loading) {
  //   return <p className={loadingClass}>Loading....</p>;
  // }

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        {/* Title */}
        <h2 className={formTitle}>Sign In</h2>

        {/* API error */}
        {/* API error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onUserLogin)}>
          {/* Email */}
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              {...register("email", {
                required: "Email is required",

                validate: (value) => value.trim().length > 0 || "Email cannot be empty",
              })}
            />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className={inputClass}
              {...register("password", {
                required: "Password is required",
                validate: (value) => value.trim().length > 0 || "Password cannot be empty",
              })}
            />
            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} className={`${submitBtn} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/browse")}
          className="w-full mt-4 px-4 py-3 rounded-full border border-[#0066cc] text-[#0066cc] font-medium hover:bg-[#eff6ff] transition"
        >
          Continue as Guest
        </button>

        {/* Footer */}
        <p className={`${mutedText} text-center mt-5`}>
          Don't have an account?{" "}
          <NavLink to="/register" className={linkClass}>
            Create one
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;
import {
  divider,
  errorClass,
  formCard,
  formGroup,
  formTitle,
  inputClass,
  labelClass,
  pageBackground,
  submitBtn,
  mutedText,
} from "../styles/common";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate, Navigate } from "react-router";
import { useState } from "react";
import api from '../api/axiosInstance'
import { useAuth } from "../store/authStore";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate=useNavigate()
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);

  // #27: Redirect if already logged in
  if (isAuthenticated && currentUser) {
    const role = currentUser.role?.toUpperCase();
    if (role === "AUTHOR") return <Navigate to="/author-profile" replace />;
    if (role === "ADMIN") return <Navigate to="/admin-profile" replace />;
    return <Navigate to="/user-profile" replace />;
  }

  //When user registration submitted
  const onUserRegister = async (userObj) => {
    // create form data object
    const formData = new FormData();
    //add all user properties and file to the formdata object
    formData.append("firstName", userObj.firstName);
    formData.append("lastName", userObj.lastName);
    formData.append("email", userObj.email);
    formData.append("password", userObj.password);
    formData.append("role", userObj.role);
    // append if image exists
    if (userObj.profileImageUrl?.[0]) {
      formData.append("profileImageUrl", userObj.profileImageUrl?.[0]);
    }
    try {
      //Start loading
      setLoading(true)
      //Make HTTP POST request to create user in backend
      let res=await api.post("/auth/users",formData)
      if(res.status===201){
        navigate("/login")
      }
      //Navigate to login
    } catch (err) {
      setApiError(err.response?.data?.message || err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  // if(loading){
  //   return <p className="text-3xl text-center">Loading...</p>
  // }
  // if(apiError){
  //   return <p className="text-red-500">{apiError}</p>
  // }

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        <h2 className={formTitle}>Create an Account</h2>

        {/* API Error */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md">
            <p className="text-red-700 text-sm font-medium">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onUserRegister)}>
          {/* ROLE */}
          <div className="mb-5">
            <p className={labelClass}>Register as</p>

            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="USER"
                  {...register("role", {
                    required: "Please select a role",
                  })}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-sm">User</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="AUTHOR"
                  {...register("role", {
                    required: "Please select a role",
                  })}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-sm">Author</span>
              </label>
            </div>

            {errors.role && <p className={errorClass}>{errors.role.message}</p>}
          </div>

          <div className={divider} />

          {/* NAME */}
          <div className="sm:flex gap-4 mb-4">
            <div className="flex-1">
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                className={inputClass}
                placeholder="First name"
                {...register("firstName", {
                  required: "First name is required",
                  minLength: {
                    value: 2,
                    message: "At least 2 characters required",
                  },
                  maxLength: {
                    value: 30,
                    message: "Max 30 characters allowed",
                  },
                  validate: (v) => v.trim().length > 0 || "Cannot be empty",
                })}
              />
              {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
            </div>

            <div className="flex-1">
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                className={inputClass}
                placeholder="Last name"
                {...register("lastName", {
                  maxLength: {
                    value: 30,
                    message: "Max 30 characters allowed",
                  },
                })}
              />
              {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
            </div>
          </div>

          {/* EMAIL */}
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              className={inputClass}
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>

          {/* PASSWORD */}
          <div className={formGroup}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              className={inputClass}
              placeholder="Min. 8 characters"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
          </div>

          {/* PROFILE IMAGE */}
          <div className={formGroup}>
            <label className={labelClass}>Profile Image</label>

            <input
              type="file"
              accept="image/png, image/jpeg"
              {...(() => {
                const { onChange: rhfOnChange, ...rest } = register("profileImageUrl", {
                  validate: {
                    filetype: (files) => {
                      if (!files?.[0]) return true;
                      return (
                        ["image/png", "image/jpeg"].includes(files[0].type) ||
                        "Only png and jpeg images are allowed"
                      );
                    },
                    filesize: (files) => {
                      if (!files?.[0]) return true;
                      return (
                        files[0].size <= 2 * 1024 * 1024 || "Max size is 2MB"
                      );
                    },
                  },
                });
                return {
                  ...rest,
                  onChange: (event) => {
                    rhfOnChange(event);
                    const file = event.target.files?.[0];
                    if (file) {
                      setPreview(URL.createObjectURL(file));
                    }
                  },
                };
              })()}
            />

            {preview && (
              <img
                src={preview}
                alt="Profile preview"
                className="mt-3 max-w-full h-auto rounded-md border border-slate-300"
              />
            )}

            {errors.profileImageUrl && <p className={errorClass}>{errors.profileImageUrl.message}</p>}
          </div>

          {/* SUBMIT */}
          <button type="submit" disabled={loading} className={`${submitBtn} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* FOOTER */}
        <p className={`${mutedText} text-center mt-5`}>
          Already have an account?{" "}
          <NavLink to="/login" className="text-[#0066cc] font-medium">
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;
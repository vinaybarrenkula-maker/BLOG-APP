import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import api from "../api/axiosInstance";
import { toast } from "react-hot-toast";

import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
} from "../styles/common";

function EditArticle() {
  const location = useLocation();
  const navigate = useNavigate();

  const article = location.state;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // #25: Redirect if no article state
  useEffect(() => {
    if (!article) {
      toast.error("No article selected to edit");
      navigate("/author-profile/articles", { replace: true });
      return;
    }

    // prefill form
    setValue("title", article.title);
    setValue("category", article.category);
    setValue("content", article.content);
  }, [article]);

  const updateArticle = async (modifiedArticle) => {
    try {
      //add articleId to modified article
      modifiedArticle.articleId=article._id;
      //make PUT req to update article
      let res=await api.put("/author-api/articles", modifiedArticle)
      //navigate to articleById component
      if(res.status===200){
        toast.success("Article updated successfully");
        navigate(`/article/${article._id}`,{state:res.data.payload})
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update article");
    }
  };

  if (!article) return null;

  return (
    <div className={`${formCard} mt-10`}>
      {/* #28: Back button */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-[#0066cc] hover:underline mb-4"
      >
        ← Back
      </button>

      <h2 className={formTitle}>Edit Article</h2>

      <form onSubmit={handleSubmit(updateArticle)}>
        {/* Title */}
        <div className={formGroup}>
          <label className={labelClass}>Title</label>

          <input className={inputClass} {...register("title", { required: "Title required" })} />

          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        {/* Category */}
        <div className={formGroup}>
          <label className={labelClass}>Category</label>

          <select className={inputClass} {...register("category", { required: "Category required" })}>
            <option value="">Select category</option>
            <option value="technology">Technology</option>
            <option value="programming">Programming</option>
            <option value="ai">AI</option>
            <option value="web-development">Web Development</option>
          </select>

          {errors.category && <p className={errorClass}>{errors.category.message}</p>}
        </div>

        {/* Content */}
        <div className={formGroup}>
          <label className={labelClass}>Content</label>

          <textarea rows="14" className={inputClass} {...register("content", { required: "Content required" })} />

          {errors.content && <p className={errorClass}>{errors.content.message}</p>}
        </div>

        <button className={submitBtn}>Update Article</button>
      </form>
    </div>
  );
}

export default EditArticle;
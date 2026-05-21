import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../api/axiosInstance";
import {
  articleGrid,
  articleCardClass,
  articleTitle,
  ghostBtn,
  loadingClass,
  errorClass,
  timestampClass,
} from "../styles/common";

function GuestArticles() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      try {
        const res = await api.get("/user-api/articles");
        setArticles(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.error || err.response?.data?.message || "Unable to load articles.");
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, []);

  const formatDateIST = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const navigateToArticle = (articleObj) => {
    navigate(`/article/${articleObj._id}`, { state: articleObj });
  };

  if (loading) {
    return <p className={loadingClass}>Loading articles...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1d1d1f] mb-2">Read Articles as a Guest</h1>
        <p className="text-sm text-[#71717a]">Explore all active articles without logging in. Guests can read full articles and browse comments.</p>
      </div>

      {error && <p className={errorClass}>{error}</p>}

      {articles.length === 0 ? (
        <p className="text-[#a1a1a6] text-sm text-center py-10">No articles available yet.</p>
      ) : (
        <div className={articleGrid}>
          {articles.map((articleObj) => (
            <div className={articleCardClass} key={articleObj._id}>
              <div className="flex flex-col h-full">
                <div>
                  <p className={articleTitle}>{articleObj.title}</p>
                  <p className="text-sm text-[#6e6e73] mt-1">{articleObj.content.slice(0, 80)}...</p>
                  <p className={`${timestampClass} mt-2`}>{formatDateIST(articleObj.createdAt)}</p>
                </div>
                <button className={`${ghostBtn} mt-auto pt-4`} onClick={() => navigateToArticle(articleObj)}>
                  Read Article →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GuestArticles;

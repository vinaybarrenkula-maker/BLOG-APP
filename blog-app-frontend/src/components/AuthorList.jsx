import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { loadingClass, errorClass, emptyStateClass, articleCardClass } from "../styles/common";
import {toast} from "react-hot-toast";

function AuthorList() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin-api/authors");
        setAuthors(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch authors");
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors();
  }, []);

  const toggleAuthorStatus = async (author) => {
    try {
      const res = await api.patch(
        "/admin-api/users",
        { userId: author._id, isUserActive: !author.isUserActive }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        setAuthors(authors.map((u) => (u._id === author._id ? res.data.payload : u)));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  if (loading) return <p className={loadingClass}>Loading authors...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (authors.length === 0) return <div className={emptyStateClass}>No authors found.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {authors.map((author) => (
        <div key={author._id} className={`${articleCardClass} relative flex flex-col`}>
          <div className="flex items-center gap-4 mb-4">
            {author.profileImageUrl ? (
              <img src={author.profileImageUrl} className="w-12 h-12 rounded-full object-cover" alt="Author" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-gray-500">
                {author.firstName?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="font-semibold truncate">{author.firstName} {author.lastName}</p>
              <p className="text-xs text-gray-500 truncate">{author.email}</p>
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
             <span className={`text-xs font-bold px-2 py-1 rounded-md ${author.isUserActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {author.isUserActive ? "ACTIVE" : "INACTIVE"}
             </span>
             <button
               onClick={() => toggleAuthorStatus(author)}
               className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors duration-200 ${
                 author.isUserActive 
                   ? "bg-red-50 text-red-600 hover:bg-red-100" 
                   : "bg-green-50 text-green-600 hover:bg-green-100"
               }`}
             >
               {author.isUserActive ? "Deactivate" : "Activate"}
             </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AuthorList;
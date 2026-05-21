import { NavLink } from "react-router";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 mt-10">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Welcome to <span className="text-[#0066cc]">MyBlog</span>
        </h1>

        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Discover insightful articles, share your thoughts, and connect with a community of passionate writers and readers. Whether you're here to learn or to teach, you're in the right place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NavLink
            to="/browse"
            className="px-6 py-3 rounded-full bg-[#0066cc] text-white text-sm font-medium shadow hover:bg-[#0052a3] transition"
          >
            Explore as Guest
          </NavLink>

          <NavLink
            to="/login"
            className="px-6 py-3 rounded-full border border-[#0066cc] text-[#0066cc] text-sm font-medium hover:bg-[#eff6ff] transition"
          >
            Login
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Home;
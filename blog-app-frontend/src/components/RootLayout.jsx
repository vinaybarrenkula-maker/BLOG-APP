import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router"
import { useEffect } from "react"
import { useAuth } from "../store/authStore"

function RootLayout() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div>
        <Header/>
        <div className="min-h-screen mx-4 md:mx-16 lg:mx-32">
            <Outlet/>
        </div>
        <Footer/>
    </div>
  )
}

export default RootLayout
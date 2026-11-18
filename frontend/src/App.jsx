
import React, { useEffect } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from 'react-router-dom'

import Header from './Pages/Header'
import Footer from './Pages/Footer'
import Product from './Pages/Product'
import Services from './Pages/Services'
import RecommendedProducts from './Pages/RecommendedProducts'
import CraziestDeals from './Pages/CraziestDeals'
import ProductDetails from './Pages/ProductDetails'
import BrandProducts from './Pages/BrandProducts'
import Search from './Pages/Search'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Profile from './Pages/Profile'
import Cart from './Pages/Cart'
import Terms from './components/Terms'
import About from './components/About'
import MyOrders from './Pages/MyOrders'
import Contact from './components/Contact'
import FAQs from './components/FAQs'
import AddProduct from './Pages/AddProduct'
import AllUsers from './Admin/AllUsers'
import Shipping from './components/Shipping'
import Returns from './components/Returns'
import Checkout from './Pages/Checkout'
import Dashboard from './Admin/Dashboard'
import AdminLayout from './Admin/AdminLayout'
import AdminOrders from './Admin/AdminOrders'
import EditProfile from './Pages/EditProfile'
import SupportChat from './Pages/SupportChat'
import ChatInbox from './Admin/ChatInbox'
import LuckySpin from './Pages/LuckySpin'

import ProtectedAdminRoute from './Admin/ProtectedAdminRoute'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    })
  }, [pathname])

  return null
}

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Header />

      <div className="mt-20">
        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
                <Product />
                <RecommendedProducts />
                <CraziestDeals />
                <Services />
              </>
            }
          />

          {/* Public Routes */}
          <Route path="/mobiles" element={<Product />} />
          <Route path="/brand/:brand" element={<BrandProducts />} />
          <Route path="/search" element={<Search />} />

          <Route
            path="/recommended-mobiles"
            element={<RecommendedProducts />}
          />

          <Route path="/craziest-deals" element={<CraziestDeals />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQs />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/edit-profile" element={<EditProfile />} />

          {/* Lucky Spin */}
          <Route path="/lucky-spin" element={<LuckySpin />} />

          {/* Customer Support Chat */}
          <Route path="/chat" element={<SupportChat />} />

          {/* Admin Protected Routes */}
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/add" element={<AddProduct />} />
            <Route path="/all" element={<AllUsers />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/lay" element={<AdminLayout />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/chats" element={<ChatInbox />} />
          </Route>
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  )
}

export default App

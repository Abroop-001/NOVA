import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import FeaturedProducts from '../components/FeaturedProducts'
import DiscountBanner from '../components/DiscountBanner'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="max-w-350 mx-auto">
      <Navbar/>
      <Hero/>
      <Categories/>
         <DiscountBanner/>
      <FeaturedProducts/>
      <Footer/>
    </div>
  )
}

export default Home

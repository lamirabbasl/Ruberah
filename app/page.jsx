import Footer from '@/components/common/Footer'
import Hero from '@/components/common/Hero'
import HomePageCourses from '@/components/common/HomePageCourses'
import HomePageEvents from '@/components/common/HomePageEvents'
import Navbar from '@/components/common/Navbar'
import React from 'react'

function Home
() {
  return (
    <div className=' w-screen h-screen '>
      <Navbar/>
      <Hero />
      <HomePageCourses />
      <HomePageEvents />
      <Footer />
    </div>
  )
}

export default Home

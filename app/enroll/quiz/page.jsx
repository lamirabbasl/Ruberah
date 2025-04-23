import Navbar from '@/components/common/Navbar'
import QuizEnroll from '@/components/Enroll/QuizEnroll'
import React from 'react'

function Quiz() {
  return (
    <div className=' w-screen h-screen overflow-hidden '>
    <Navbar />
    <QuizEnroll />
    </div>
  )
}

export default Quiz
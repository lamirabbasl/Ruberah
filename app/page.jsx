'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import Hero from '@/components/common/Hero';
import HomePageCourses from '@/components/common/HomePageCourses';
import HomePageEvents from '@/components/common/HomePageEvents';
import Footer from '@/components/common/Footer';

export default function Home() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        const el = document.querySelector(hash);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth' });
          }, 100); // delay to wait for the page to load
        }
      }
    }
  }, [pathname]);

  return (
    <div className="w-screen h-screen">
      <Navbar />
      <Hero />
      <div id="courses">
        <HomePageCourses />
      </div>
      <div id="contact">
        <HomePageEvents />
      </div>
      <Footer />
    </div>
  );
}

"use client";
import React, { useState, useEffect } from 'react'
import Header from '@/components/header';
import HeroAndDemo from '@/components/hero';
import Features from '@/components/features';
import Pricing from '@/components/pricing-plan';
import FAQ from '@/components/faq-dropdown-card';
import Waitlist from '@/components/waitlist';
import Footer from '@/components/footer';

export default function Component() {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const header = document.querySelector('header'); // Adjust this selector as needed
      const headerHeight = header ? header.offsetHeight : 0;
      const top = section.offsetTop - headerHeight;
      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });
    }
  }
  

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-[#c3b3e2]"></div>

      {/* Content container */}
      <div className="relative z-10">
        <Header scrollToSection={scrollToSection} />
        <HeroAndDemo />
        <Features />
        <Pricing />
        <FAQ />
        <Waitlist />
        <Footer />
      </div>
    </div>
  )
}
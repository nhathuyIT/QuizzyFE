import React from 'react';
import Link from 'next/link';
import { TopNavBar } from '@/components/dashboard/TopNavBar';
import { HeroSection } from '@/features/dashboard/components/HeroSection';
import { CourseCard } from '@/features/dashboard/components/CourseCard';
import { DailyObjectivesWidget } from '@/features/dashboard/components/DailyObjectivesWidget';
import { LeaderboardWidget } from '@/features/dashboard/components/LeaderboardWidget';

export default function DashboardHome() {
  return (
    <>
      <TopNavBar />
      <main className="w-full max-w-max_content_width mx-auto p-lg md:p-xl flex-grow flex flex-col gap-xl overflow-y-auto custom-scrollbar">
      
      {/* Hero Section */}
      <HeroSection />

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Main Content Column */}
        <div className="lg:col-span-8 flex flex-col gap-lg">
          {/* Continue Learning */}
          <section className="flex flex-col gap-md">
            <h2 className="font-headline-md text-headline-md text-on-surface">Continue Learning</h2>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col sm:flex-row hover:border-primary/50 transition-colors group">
              <div className="w-full sm:w-1/3 h-48 sm:h-auto bg-surface-container relative overflow-hidden">
                <img 
                  alt="Coding interface" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8yM9vdNnp590-V7OB95P49eM0fVnGRrFUdWGmbf_ONAL-Z5JUL40Wv0Qz5G-UzqCot30146ZXf0cPbIQn00IDc4FG_Pk9UOUFyqXpDvrCBI2BV5q_pMyP4twCk7r2sVjOA-7OijVwLw1XLw0cE2mmpQMvl_N77a9VYEJwyR9FVYYoQG_2VDO_CYruH9MxvzN-MyjWYCiHYIJMxL1mg88dOoxxEbhrbUVR-abEdyoBCKMHA302Kua7oZXRzOdLP9npBspS2FIBpYM"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-md left-md bg-surface-container-lowest/90 backdrop-blur px-sm py-xs rounded font-label-sm text-label-sm text-on-surface flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[16px]">play_circle</span>
                  Module 4
                </div>
              </div>
              <div className="p-lg flex flex-col justify-center w-full sm:w-2/3">
                <div className="flex justify-between items-start mb-sm">
                  <span className="font-label-sm text-label-sm text-primary bg-primary/10 px-sm py-xs rounded">Advanced React Patterns</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">State Management with Context & Reducers</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg line-clamp-2">Dive deep into complex state architectures. Learn how to combine Context API with useReducer for scalable application state without external libraries.</p>
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-xs">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Progress</span>
                    <span className="font-label-sm text-label-sm text-on-surface">60%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mb-md">
                    <div className="bg-primary h-full rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <div className="flex justify-end">
                    <button className="bg-surface-container-lowest border border-primary text-primary font-label-md text-label-md px-md py-sm rounded-lg hover:bg-primary/5 transition-colors">
                      Resume Lesson
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recommended Grid */}
          <section className="flex flex-col gap-md">
            <div className="flex justify-between items-center">
              <h2 className="font-headline-md text-headline-md text-on-surface">Recommended for you</h2>
              <Link href="#" className="font-label-md text-label-md text-primary hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <CourseCard 
                category="3D Modeling"
                categoryColorClass="text-secondary"
                title="Introduction to Voxel Art Environments"
                description="Master the basics of grid-based 3D modeling to create stunning, lightweight environments for games."
                duration="4h 30m"
                imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBxNkIYV1W3JKFAsbo7RujOIdb2IpeVU10MRo7SZw6WaU4EY-4NYIVC8mtFMbMgjXUXB2-_-S7G2o8IW7HttOzW7gwe8x3o18hEWhCPW0PLUZn4i1c0Q38opRU_hGEq0QWbofkz8UxWCnYfSaGqKtqrxdAQUujXIolk7xU6WKvekvcSZfvaUewAkpkiqnMxoi7waFYegktlImlpfIe4msNC4qztSvAi0MzyMNl2G9-BgDLbvlI-6cYyZIL6G9a4orzDgIZC74CMvl8"
              />
              <CourseCard 
                category="Data Science"
                categoryColorClass="text-tertiary"
                title="Data Visualization Fundamentals"
                description="Learn to transform complex datasets into clear, actionable visual narratives using modern web tools."
                duration="6h 15m"
                imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuAHkCEAlbMtbLFpky-91kfiSPF7qPHwaKmYwxijUd6K1VYC_Neeu1sJy7o3FsHOmHH10phSbT3NFqBaUzlFc60p_OVyZi1fpkHVXtfSV7y8v6_Pu56YYlRM15l4GI1yDQt6ZANsWa3QpDgDQncQHx7Fock-0xGGHr-PbCbXuD8FUss317SdWbxsRp1B-_UQ5DSuhnZ9Di8WQFhgvw1kNVi3H0eiVrWnq3kWMiwJUHfVP4TPFqDCjkDyElswwBWUxlfvpVO9yzqug3c"
              />
            </div>
          </section>
        </div>

        {/* Sidebar Widgets Column */}
        <div className="lg:col-span-4 flex flex-col gap-lg">
          <DailyObjectivesWidget />
          <LeaderboardWidget />
        </div>
      </div>
    </main>
    </>
  );
}

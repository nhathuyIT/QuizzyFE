import React from 'react';
import Link from 'next/link';
import { TopNavBar } from '@/components/dashboard/TopNavBar';

export default function DashboardHome() {
  return (
    <>
      <TopNavBar />
      <main className="w-full max-w-max_content_width mx-auto p-lg md:p-xl flex-grow flex flex-col gap-xl overflow-y-auto custom-scrollbar">
      {/* Hero Section */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg md:p-xl flex flex-col md:flex-row justify-between items-center gap-lg relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-container/10 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="flex flex-col gap-sm z-10 w-full md:w-1/2">
          <h1 className="font-headline-lg md:font-headline-lg text-headline-lg md:text-headline-lg text-on-surface">Welcome back, Alex.</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">You're on track to hit your weekly learning goal. Keep up the momentum!</p>
          <div className="mt-sm">
            <button className="bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg hover:opacity-90 transition-opacity">
              View Study Plan
            </button>
          </div>
        </div>
        
        <div className="z-10 w-full md:w-auto flex items-center gap-md bg-surface border border-outline-variant rounded-lg p-md">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path 
                className="text-surface-container-high" 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3"
              />
              <path 
                className="text-primary" 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                fill="none" 
                stroke="currentColor" 
                strokeDasharray="75, 100" 
                strokeLinecap="round" 
                strokeWidth="3"
              />
            </svg>
            <span className="absolute font-label-md text-label-md text-on-surface">75%</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface">Weekly Goal</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">15 / 20 hours completed</span>
          </div>
        </div>
      </section>

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
              {/* Card 1 */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col hover:shadow-[0_4px_6px_-1px_rgb(0,0,0,0.05),0_2px_4px_-2px_rgb(0,0,0,0.05)] transition-shadow">
                <div className="h-32 bg-surface-container relative">
                  <img 
                    alt="3D Design" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxNkIYV1W3JKFAsbo7RujOIdb2IpeVU10MRo7SZw6WaU4EY-4NYIVC8mtFMbMgjXUXB2-_-S7G2o8IW7HttOzW7gwe8x3o18hEWhCPW0PLUZn4i1c0Q38opRU_hGEq0QWbofkz8UxWCnYfSaGqKtqrxdAQUujXIolk7xU6WKvekvcSZfvaUewAkpkiqnMxoi7waFYegktlImlpfIe4msNC4qztSvAi0MzyMNl2G9-BgDLbvlI-6cYyZIL6G9a4orzDgIZC74CMvl8"
                  />
                </div>
                <div className="p-md flex flex-col flex-grow">
                  <span className="font-label-sm text-label-sm text-secondary mb-xs">3D Modeling</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs font-semibold">Introduction to Voxel Art Environments</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-md flex-grow">Master the basics of grid-based 3D modeling to create stunning, lightweight environments for games.</p>
                  <div className="flex items-center justify-between mt-auto pt-sm border-t border-outline-variant">
                    <div className="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px]">schedule</span> 4h 30m
                    </div>
                    <button className="text-primary hover:bg-primary/10 p-xs rounded transition-colors">
                      <span className="material-symbols-outlined">bookmark_add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col hover:shadow-[0_4px_6px_-1px_rgb(0,0,0,0.05),0_2px_4px_-2px_rgb(0,0,0,0.05)] transition-shadow">
                <div className="h-32 bg-surface-container relative">
                  <img 
                    alt="Data Visualization" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHkCEAlbMtbLFpky-91kfiSPF7qPHwaKmYwxijUd6K1VYC_Neeu1sJy7o3FsHOmHH10phSbT3NFqBaUzlFc60p_OVyZi1fpkHVXtfSV7y8v6_Pu56YYlRM15l4GI1yDQt6ZANsWa3QpDgDQncQHx7Fock-0xGGHr-PbCbXuD8FUss317SdWbxsRp1B-_UQ5DSuhnZ9Di8WQFhgvw1kNVi3H0eiVrWnq3kWMiwJUHfVP4TPFqDCjkDyElswwBWUxlfvpVO9yzqug3c"
                  />
                </div>
                <div className="p-md flex flex-col flex-grow">
                  <span className="font-label-sm text-label-sm text-tertiary mb-xs">Data Science</span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs font-semibold">Data Visualization Fundamentals</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-md flex-grow">Learn to transform complex datasets into clear, actionable visual narratives using modern web tools.</p>
                  <div className="flex items-center justify-between mt-auto pt-sm border-t border-outline-variant">
                    <div className="flex items-center gap-xs text-on-surface-variant font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px]">schedule</span> 6h 15m
                    </div>
                    <button className="text-primary hover:bg-primary/10 p-xs rounded transition-colors">
                      <span className="material-symbols-outlined">bookmark_add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Widgets Column */}
        <div className="lg:col-span-4 flex flex-col gap-lg">
          {/* Daily Goals Widget */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col">
            <div className="flex items-center gap-sm mb-md pb-sm border-b border-outline-variant">
              <span className="material-symbols-outlined text-primary">task_alt</span>
              <h3 className="font-headline-md text-headline-md text-on-surface text-[18px]">Daily Objectives</h3>
            </div>
            <div className="flex flex-col gap-sm">
              <label className="flex items-start gap-sm cursor-pointer group">
                <input defaultChecked className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-lowest" type="checkbox" />
                <div className="flex flex-col">
                  <span className="font-body-sm text-body-sm text-on-surface line-through opacity-70">Complete 1 lesson</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant opacity-70">50 XP</span>
                </div>
              </label>
              <label className="flex items-start gap-sm cursor-pointer group">
                <input className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-lowest" type="checkbox" />
                <div className="flex flex-col">
                  <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">Review Flashcards</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">20 XP</span>
                </div>
              </label>
              <label className="flex items-start gap-sm cursor-pointer group">
                <input className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary bg-surface-container-lowest" type="checkbox" />
                <div className="flex flex-col">
                  <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">Contribute to Forum</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">30 XP</span>
                </div>
              </label>
            </div>
          </div>

          {/* Leaderboard Widget */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-md pb-sm border-b border-outline-variant">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-tertiary">emoji_events</span>
                <h3 className="font-headline-md text-headline-md text-on-surface text-[18px]">Leaderboard</h3>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">This Week</span>
            </div>
            
            <div className="flex flex-col gap-sm">
              {/* Rank 1 */}
              <div className="flex items-center justify-between p-sm rounded bg-surface-container-low border border-outline-variant/50">
                <div className="flex items-center gap-md">
                  <span className="font-label-md text-label-md text-on-surface-variant w-4 text-center">1</span>
                  <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden">
                    <img 
                      alt="User" 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1HRsliW-1abU5nuJ9cTnf0vqwA49sdCStRuttRPeK40CSVeVOaTaRWk5gYOVKGsOKL49AUu_p_29nhLD9zZ2ix7lB_jROLfvRwLDyODcdvFplDu9Q8C-D6s67kEao2lp0Ddazi4WUCczhmxILav5aUqZ7owlpqtU9QHZCuCjnGWgXYCZoqSfs2FuUVmF9E16Z-IjmAWWPNXVidqR_YzoQwJQZWZDn-MKj_HEoSAIWv453wluyINypqe8rhi1ZVcl878HcddEkOCo"
                    />
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface font-medium">Sarah J.</span>
                </div>
                <span className="font-label-sm text-label-sm text-primary font-bold">2,450</span>
              </div>
              
              {/* Rank 2 */}
              <div className="flex items-center justify-between p-sm rounded hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-md">
                  <span className="font-label-md text-label-md text-on-surface-variant w-4 text-center">2</span>
                  <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden">
                    <img 
                      alt="User" 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdiS8yuh0u832YPBtKa1x5_M8K8uFrmo9evM4h9rFCLUVeQzmlMjtgBSggepHBXsCIj2HHVLCT-Kk3ESLEXxdSNWvVSpB-yYcwRPhYxjxAQXK3azJ_O39x2GlDxWVnhH-dvmMTURLHjYwhBcOYkIHDfc3arlsG5X5p9KpZtUeyuMjVKKwWVxmULkfo9TFXrOcqp219XC1Qii-295zgmIVYXuSptKvX4Cnr_wH9kPG1q4jBIOhH_v8OvZrYUWYrVaHwxfiHUbUk6Dk"
                    />
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface">David M.</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">2,120</span>
              </div>
              
              {/* Rank 3 (Current User) */}
              <div className="flex items-center justify-between p-sm rounded bg-primary/5 border border-primary/20 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-primary rounded-r"></div>
                <div className="flex items-center gap-md pl-xs">
                  <span className="font-label-md text-label-md text-primary w-4 text-center">3</span>
                  <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden">
                    <img 
                      alt="You" 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvThICA--7iVCBmaYWvyi3GbIEBk08UDpzBPrQuIP7HtQopV2geMpgAnxm1jiZQON0dNdHzdRmNMS9K4y-JTZnce2FDbAo4qyBjqu4Q3_HgNOeMFh-E6u5nkOTmfVgQGXphCn93aY9IvNUXgYACpeMSrO30rY9RcxKw4S5mn4Ld_qYfW-qpGNDeX8FC-GtJcCmCRUajN9AYZGUV5MiqWiIQGLtJkNQcsNS44iq3YlFi-0463dNTjoQCLjj_OaVLJjpuMr3DmquBFQ"
                    />
                  </div>
                  <span className="font-body-sm text-body-sm text-primary font-medium">You</span>
                </div>
                <span className="font-label-sm text-label-sm text-primary font-bold">1,890</span>
              </div>
            </div>
            
            <button className="mt-auto pt-md text-primary font-label-sm text-label-sm hover:underline self-center">
              View Full Standings
            </button>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}

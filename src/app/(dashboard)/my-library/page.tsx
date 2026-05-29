import React from 'react';
import Link from 'next/link';

export default function MyLibraryPage() {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-background">
      {/* TopNavBar */}
      <header className="flex justify-between items-center px-lg py-sm w-full sticky top-0 z-50 bg-surface-container-lowest border-b border-outline-variant">
        {/* Mobile Menu & Title */}
        <div className="flex items-center gap-md md:hidden">
          <button className="p-sm text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="font-headline-md text-headline-md font-bold text-primary">Creator Academy</span>
        </div>
        {/* Desktop Search (Left aligned per JSON intent, but visually centered in remaining space) */}
        <div className="hidden md:flex items-center bg-surface-container rounded-full px-md py-xs border border-outline-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary w-96 transition-all">
          <span className="material-symbols-outlined text-on-surface-variant mr-sm">search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 outline-none w-full font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant" 
            placeholder="Search your library..." 
            type="text"
          />
        </div>
        <div className="flex items-center gap-md">
          <button aria-label="Streak" className="p-xs text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors active:scale-95 duration-200">
            <span className="material-symbols-outlined text-tertiary">local_fire_department</span>
          </button>
          <button aria-label="Notifications" className="p-xs text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors active:scale-95 duration-200">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-variant border border-outline-variant overflow-hidden cursor-pointer active:scale-95 duration-200">
            <img 
              alt="User profile avatar" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp3FDyxcoB2nqmU8aufZk5bUoHwHSlxJKChfSmTKctPY5h7NkprJIkvFawTBMR0KLNwxzgpN033-URMX0UxbwqZ27H8rUx9XCRcHcjHTOHxciug3pu_JrhXdD1nG54TJaB7HUxVTNqzADqwqfzqxX2HGSGTO3nraCOMC-_vC_jyWAujVr94vlOatbpOfIwH_OCg9H5ecxZYgMf-ZBjxsghwvSPCfeq56K9lFlx7_4aQ8OM9KskAr8mJ-3U2fEYno6vwDTK7HnQtGQ"
            />
          </div>
        </div>
      </header>
      
      {/* Page Canvas */}
      <div className="p-lg md:p-xl max-w-max_content_width mx-auto w-full flex-1">
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-xl gap-md">
          <div>
            <h2 className="font-display-lg text-display-lg text-on-background mb-sm">My Library</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Pick up where you left off or dive into something new.</p>
          </div>
          <div className="flex flex-wrap gap-sm">
            <button className="px-md py-xs rounded-full bg-primary/10 text-primary font-label-sm text-label-sm border border-primary transition-colors">All Materials</button>
            <button className="px-md py-xs rounded-full bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm border border-outline-variant hover:bg-surface-container-low transition-colors">In Progress</button>
            <button className="px-md py-xs rounded-full bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm border border-outline-variant hover:bg-surface-container-low transition-colors">Completed</button>
          </div>
        </div>
        
        {/* Courses Section */}
        <section className="mb-2xl">
          <div className="flex items-center justify-between mb-lg border-b border-surface-container-highest pb-sm">
            <h3 className="font-headline-lg text-headline-lg text-on-background">Courses</h3>
            <button className="text-primary font-label-md text-label-md hover:underline flex items-center gap-xs">
              View All <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {/* Course Card 1 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-[0_4px_6px_-1px_rgb(0,0,0,0.05),0_2px_4px_-2px_rgb(0,0,0,0.05)] transition-shadow duration-300 group cursor-pointer flex flex-col">
              <div className="h-40 w-full relative overflow-hidden bg-surface-container-highest">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt="A striking digital composition showcasing modern video editing software interface elements floating above a sleek, dark desk setup. The lighting is crisp and studio-quality, emphasizing the professional tools of a digital creator. Subtle neon blue and purple accents reflect off a minimalist keyboard, creating an atmosphere of focused, high-end content production." 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMOw_Do2ut--c41Gv1xefKyFmClDfy3bzKCtoAgpeO69IlYcPtwj2V88FdY9BOXpwurmQwJznx3A99q1s079vc45Aj13Xp5pJ1TJgrzp04TbeCW6LB1SlGxnij7DQdBa8iOukzUNUCtdseLOp48rfwb_hQsLB9B9BNduwoLEuHz85xjKCXaFEe8CpiyIsNjzuxFsxr7XzDfeVb-EsN2Ev3t6Sp1ZoM_Sj0qdYmeqXbHEodiZfLXg8rYScjvycqmQKGCP6IG0OScyo"
                />
              </div>
              <div className="p-md flex flex-col flex-1">
                <div className="flex items-center justify-between mb-sm">
                  <span className="bg-secondary-container/20 text-on-secondary-container font-label-sm text-label-sm px-2 py-0.5 rounded">Video Production</span>
                  <span className="text-on-surface-variant font-label-sm text-label-sm flex items-center gap-xs"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>play_circle</span> 12 Lessons</span>
                </div>
                <h4 className="font-headline-md text-headline-md text-on-surface mb-xs">Advanced Cinematic Editing</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg flex-1">Master color grading and dynamic pacing for professional YouTube essays.</p>
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-xs">
                    <span className="font-label-sm text-label-sm text-on-surface">65% Completed</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-500 ease-in-out" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Course Card 2 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-[0_4px_6px_-1px_rgb(0,0,0,0.05),0_2px_4px_-2px_rgb(0,0,0,0.05)] transition-shadow duration-300 group cursor-pointer flex flex-col">
              <div className="h-40 w-full relative overflow-hidden bg-surface-container-highest">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt="A clean, minimalist workspace featuring a modern smartphone mounted on a sleek tripod, surrounded by soft ring-light illumination. The desk is uncluttered, constructed of light birch wood, creating a bright and airy light-mode aesthetic. The focus is on mobile content creation, conveying a sense of accessible yet professional digital broadcasting." 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbkf7uBU6g2w5s_JrK7I73iaZkMM8sqTXEVXNUzAJpjigug2ATcNxOpuDJjvbulRulcuvSebTEZXzXOvE-CrG0hmxc6_Zu3kHegjwgSqFkP76e3qMYh7MiBDlX_uxzMR0wkE6Ivo7eTqyY_y5IkIQViCQTsbDsDied_1SgDHQ2oclYVV7WqiNDdN8QIT1gEFVN2VZorFkVs1VhmhTJ19djYzhe-DPvwtyNq_Bt6pmosy-vuAS3y-PikoqO7cUJydN0EJy-F9vLnAU"
                />
              </div>
              <div className="p-md flex flex-col flex-1">
                <div className="flex items-center justify-between mb-sm">
                  <span className="bg-tertiary-container/20 text-on-tertiary-container font-label-sm text-label-sm px-2 py-0.5 rounded">Growth</span>
                  <span className="text-on-surface-variant font-label-sm text-label-sm flex items-center gap-xs"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>play_circle</span> 8 Lessons</span>
                </div>
                <h4 className="font-headline-md text-headline-md text-on-surface mb-xs">Algorithmic Reach Strategies</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg flex-1">Understand the underlying mechanics of content discovery on modern platforms.</p>
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-xs">
                    <span className="font-label-sm text-label-sm text-on-surface">12% Completed</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-500 ease-in-out" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Flashcards & Saved Documents Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
          {/* Flashcard Sets */}
          <section>
            <div className="flex items-center justify-between mb-md border-b border-surface-container-highest pb-sm">
              <h3 className="font-headline-lg text-headline-lg text-on-background">Flashcard Sets</h3>
              <button className="text-primary font-label-md text-label-md hover:underline">Manage</button>
            </div>
            <div className="flex flex-col gap-sm">
              <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-lg flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">style</span>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-body-lg text-on-surface">Camera Settings Cheatsheet</h4>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">42 Cards • Due for review</p>
                  </div>
                </div>
                <button className="w-8 h-8 flex items-center justify-center rounded-full border border-outline-variant hover:border-primary hover:text-primary transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </button>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-lg flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded bg-secondary-container/20 flex items-center justify-center text-on-secondary-container">
                    <span className="material-symbols-outlined">style</span>
                  </div>
                  <div>
                    <h4 className="font-headline-md text-body-lg text-on-surface">Audio Engineering Basics</h4>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">18 Cards • Mastered</p>
                  </div>
                </div>
                <button className="w-8 h-8 flex items-center justify-center rounded-full border border-outline-variant hover:border-primary hover:text-primary transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </button>
              </div>
            </div>
          </section>
          
          {/* Saved Documents */}
          <section>
            <div className="flex items-center justify-between mb-md border-b border-surface-container-highest pb-sm">
              <h3 className="font-headline-lg text-headline-lg text-on-background">Saved Documents</h3>
              <button className="text-primary font-label-md text-label-md hover:underline">View All</button>
            </div>
            <div className="flex flex-col gap-sm">
              <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-lg flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer">
                <div className="flex items-center gap-md">
                  <div className="text-outline-variant">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div>
                    <h4 className="font-body-md text-body-md font-medium text-on-surface">Sponsorship Outreach Template</h4>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Added 2 days ago</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors" style={{ fontSize: '20px' }}>bookmark_remove</span>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-lg flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer">
                <div className="flex items-center gap-md">
                  <div className="text-outline-variant">
                    <span className="material-symbols-outlined">picture_as_pdf</span>
                  </div>
                  <div>
                    <h4 className="font-body-md text-body-md font-medium text-on-surface">Lighting Setup Diagrams.pdf</h4>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Added 1 week ago</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors" style={{ fontSize: '20px' }}>bookmark_remove</span>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full py-md px-lg flex flex-col md:flex-row justify-between items-center max-w-max_content_width mx-auto bg-surface-container-low border-t border-outline-variant mt-auto">
        <div className="font-headline-md text-headline-md text-primary mb-sm md:mb-0">
          Creator Academy
        </div>
        <div className="font-label-sm text-label-sm text-on-surface-variant mb-sm md:mb-0">
          © 2024 Creator Academy. All rights reserved.
        </div>
        <div className="flex gap-md font-label-sm text-label-sm">
          <a className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Support</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Privacy Policy</a>
          <a className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}

import React from 'react';

export function LeaderboardWidget() {
  return (
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
  );
}

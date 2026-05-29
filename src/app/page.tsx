"use client";

import { useEffect, useRef } from 'react';
import { Menu, Play, BookCopy, MessageCircleQuestion, MonitorPlay, Quote } from 'lucide-react';

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width: number, height: number;
    let pixels: { x: number; y: number; size: number; speed: number; color: string; opacity: number }[] = [];
    const colors = ['#7c3aed', '#a78bfa']; // purples
    let animationFrameId: number;

    function resize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createPixels() {
      pixels = [];
      const numPixels = Math.floor(window.innerWidth / 20); // Adjust density
      for (let i = 0; i < numPixels; i++) {
        pixels.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 8 + 4, // 4 to 12px
          speed: Math.random() * 0.5 + 0.2, // upward speed
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      
      pixels.forEach(p => {
        // Draw pixel
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        
        // Move up
        p.y -= p.speed;
        
        // Wrap around
        if (p.y + p.size < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
      });
      
      ctx.globalAlpha = 1; // reset alpha
      animationFrameId = requestAnimationFrame(animate);
    }

    const handleResize = () => {
      resize();
      createPixels();
    };

    window.addEventListener('resize', handleResize);

    // Initialize
    resize();
    createPixels();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas id="pixel-canvas" ref={canvasRef}></canvas>
      <div className="content-wrapper flex flex-col min-h-screen">
        {/* TopNavBar */}
        <nav className="bg-surface text-primary font-headline-md text-headline-md docked full-width top-0 border-b-4 border-border-dark shadow-[0px_4px_0px_0px_#5B21B6] mb-voxel-depth-md flex justify-between items-center px-margin-desktop py-4 w-full sticky z-50">
          <div className="flex items-center gap-4">
            <img 
              alt="Voxel Learn Logo" 
              className="h-12 w-12 object-contain voxel-shadow-primary border-2 border-border-dark bg-white rounded-DEFAULT" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF-KWFA3z4zxqEKa06tT7Dcj_Wp3rEgHebdnXFdz96t7zpwEVfSRR2HZPLZPCJsE4pYTT77Rcc-CjW5e5E8IbzOUpT0TjNUYxdlMECX20o7rORkWtNCplE8J0ftc0WMx7YV0qah7tmoqpd4vAbrWgxGJFhxh6sDGU2Ss7HiBskKHPqUOVd3Wu3ZumpZDpgIwjL2MugvNoE1-XWDOVyDIF77MMPuJvL_bnS18Z0sYmbtAgMT8P2YZgYxEZh9oTlzuh_M_jcOcQgZik"
            />
            <span className="font-headline-md text-headline-md font-bold tracking-tight text-primary">QUIZZY</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-body-md text-body-md">
            <a className="text-on-surface-variant hover:text-primary transition-all duration-75" href="#">Flashcards</a>
            <a className="text-on-surface-variant hover:text-primary transition-all duration-75" href="#">Quizzes</a>
            <a className="text-on-surface-variant hover:text-primary transition-all duration-75" href="#">Library</a>
          </div>
          <button className="bg-primary-container text-on-primary font-label-caps text-label-caps px-6 py-3 border-4 border-border-dark voxel-btn hidden md:block">
            Start Learning
          </button>
          <button className="md:hidden p-2 text-primary">
            <Menu className="w-8 h-8" />
          </button>
        </nav>

        {/* Hero Section */}
        <header className="relative w-full px-margin-mobile md:px-margin-desktop py-20 md:py-32 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden">
          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-16 h-16 bg-accent-yellow border-4 border-border-dark voxel-shadow animate-float z-0"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-tertiary-container border-4 border-border-dark voxel-shadow animate-float-delayed z-0 rotate-12"></div>
          <div className="absolute top-1/4 right-1/3 w-12 h-12 bg-primary-fixed-dim border-4 border-border-dark voxel-shadow animate-float z-0 rounded-full"></div>
          
          <div className="relative z-10 w-full md:w-1/2 flex flex-col items-start gap-6">
            <div className="inline-block bg-accent-yellow text-border-dark font-label-caps text-label-caps px-4 py-2 border-2 border-border-dark voxel-shadow mb-4">
              LEVEL UP YOUR BRAIN
            </div>
            <h1 className="font-headline-xl text-headline-xl md:text-[64px] font-bold text-on-background leading-tight">
              Học tập gây nghiện với <span className="text-primary-container inline-block translate-y-[-4px] drop-shadow-[4px_4px_0_#0F172A]">AI</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
              Tạo quiz và flashcards nhanh chóng từ bất kỳ tài liệu nào. Biến việc học thành một cuộc phiêu lưu đầy thú vị với đồ họa Voxel 3D.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <button className="bg-primary-container text-on-primary font-headline-md text-headline-md px-8 py-4 border-4 border-border-dark voxel-btn flex items-center justify-center">
                Bắt Đầu Ngay
              </button>
              <button className="bg-surface text-primary font-headline-md text-headline-md px-8 py-4 border-4 border-border-dark voxel-btn flex items-center justify-center gap-2">
                <Play className="w-6 h-6 fill-current" /> Xem Demo
              </button>
            </div>
          </div>
          
          <div className="relative z-10 w-full md:w-1/2 flex justify-center items-center min-h-[400px] md:min-h-[500px]">
            <div className="relative w-full h-[400px] md:h-[500px] group">
              <img 
                alt="Voxel Icon 1" 
                className="absolute top-[-30px] left-[50%] -translate-x-1/2 w-[180px] md:w-[260px] h-auto object-contain animate-float z-0 drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)] hover:scale-105 transition-transform duration-300" 
                src="/icon-3.png"
              />
              <img 
                alt="Voxel Icon 2" 
                className="absolute bottom-[20px] left-[-30px] w-[140px] md:w-[200px] h-auto object-contain animate-float z-0 drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)] hover:scale-110 transition-transform duration-300" 
                style={{ animationDelay: '1.5s', animationDuration: '7s' }}
                src="/icon-1.png"
              />
              <img 
                alt="Voxel Icon 3" 
                className="absolute bottom-[-10px] right-[-20px] w-[160px] md:w-[220px] h-auto object-contain animate-float z-0 drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)] hover:scale-105 transition-transform duration-300" 
                style={{ animationDelay: '0.8s', animationDuration: '8s' }}
                src="/icon-2.png"
              />
            </div>
          </div>
        </header>

        {/* Features Section */}
        <section className="px-margin-mobile md:px-margin-desktop py-20 bg-surface-container-high/90 backdrop-blur-md w-full border-t-4 border-border-dark">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-headline-lg text-on-background mb-4">Sức Mạnh Của AI</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">Công cụ mạnh mẽ giúp bạn tiếp thu kiến thức nhanh hơn bao giờ hết.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-surface p-8 border-4 border-border-dark voxel-shadow flex flex-col items-start gap-4 hover:translate-y-[-8px] transition-transform duration-300">
                <div className="w-16 h-16 bg-primary-container border-2 border-border-dark flex items-center justify-center voxel-shadow-primary mb-4">
                  <BookCopy className="w-8 h-8 text-on-primary" />
                </div>
                <h3 className="font-headline-md text-headline-md text-on-background">Flashcard Maker</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Tự động tạo flashcards từ văn bản, PDF hoặc hình ảnh chỉ trong vài giây. Luyện tập lặp lại ngắt quãng thông minh.</p>
              </div>
              <div className="bg-surface p-8 border-4 border-border-dark voxel-shadow flex flex-col items-start gap-4 hover:translate-y-[-8px] transition-transform duration-300 md:translate-y-8">
                <div className="w-16 h-16 bg-accent-yellow border-2 border-border-dark flex items-center justify-center voxel-shadow-accent mb-4">
                  <MessageCircleQuestion className="w-8 h-8 text-border-dark" />
                </div>
                <h3 className="font-headline-md text-headline-md text-on-background">AI Quizlet</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Hệ thống tạo câu hỏi trắc nghiệm đa dạng từ nội dung bài học. Đánh giá kiến thức ngay lập tức với giải thích chi tiết.</p>
              </div>
              <div className="bg-surface p-8 border-4 border-border-dark voxel-shadow flex flex-col items-start gap-4 hover:translate-y-[-8px] transition-transform duration-300">
                <div className="w-16 h-16 bg-tertiary-container border-2 border-border-dark flex items-center justify-center voxel-shadow mb-4">
                  <MonitorPlay className="w-8 h-8 text-on-primary" />
                </div>
                <h3 className="font-headline-md text-headline-md text-on-background">YouTube Summarizer</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Chuyển đổi video YouTube thành bài tóm tắt, flashcards và bài kiểm tra. Tiết kiệm thời gian xem video dài.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="px-margin-mobile md:px-margin-desktop py-24 bg-surface/90 backdrop-blur-md w-full border-t-4 border-border-dark overflow-hidden relative">
          <div className="max-w-5xl mx-auto relative z-10">
            <h2 className="font-headline-lg text-headline-lg text-center text-on-background mb-16">Học Viên Nói Gì?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-surface-white p-8 border-4 border-border-dark voxel-shadow-primary relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-accent-yellow border-2 border-border-dark voxel-shadow flex items-center justify-center">
                  <Quote className="w-4 h-4 text-border-dark fill-current" />
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 mt-4">
                  &quot;Nền tảng này đã thay đổi hoàn toàn cách tôi ôn thi. Việc tạo flashcard từ tài liệu PDF chưa bao giờ dễ dàng và thú vị đến thế. Đồ họa voxel làm tôi cảm thấy như đang chơi game!&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary-container border-2 border-border-dark rounded-full"></div>
                  <div>
                    <p className="font-headline-md text-[18px] text-on-background">Minh Tú</p>
                    <p className="font-body-md text-[14px] text-secondary">Sinh viên Y Khoa</p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-white p-8 border-4 border-border-dark voxel-shadow-accent relative md:translate-y-12">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary-container border-2 border-border-dark voxel-shadow flex items-center justify-center">
                  <Quote className="w-4 h-4 text-on-primary fill-current" />
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 mt-4">
                  &quot;Tính năng tóm tắt YouTube thực sự là cứu cánh. Tôi có thể nắm bắt ý chính của bài giảng dài 1 tiếng chỉ trong 5 phút và làm quiz ngay lập tức để nhớ lâu hơn.&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-tertiary-container border-2 border-border-dark rounded-full"></div>
                  <div>
                    <p className="font-headline-md text-[18px] text-on-background">Hoàng Nam</p>
                    <p className="font-body-md text-[14px] text-secondary">Học sinh THPT</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-surface-container/90 backdrop-blur-md text-secondary font-body-md text-body-md full-width mt-auto border-t-4 border-border-dark flex flex-col md:flex-row justify-between items-center px-margin-desktop py-12 w-full gap-8 relative z-10">
          <div className="flex items-center gap-2">
            <span className="font-headline-md text-headline-md text-primary font-bold">QUIZZY</span>
          </div>
          <div className="flex flex-wrap gap-6 justify-center">
            <a className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Resources</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Community</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Privacy</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Support</a>
          </div>
          <div>
            © 2024 Quizzy. Level up your brain.
          </div>
        </footer>
      </div>
    </>
  );
}

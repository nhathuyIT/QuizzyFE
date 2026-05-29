"use client";

import React, { useState } from 'react';
import { User, Lock, ArrowRight, MessageSquare, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/services/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loginMutation = useMutation({
    mutationFn: () => authAPI.login({ email, password }),
    onSuccess: (response) => {
      if (response?.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        router.push('/home');
      } else {
        setErrorMsg('Invalid response from server.');
      }
    },
    onError: (error: any) => {
      setErrorMsg(error.message || 'Login failed.');
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter email and password.');
      return;
    }
    loginMutation.mutate();
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center relative overflow-hidden pixel-bg font-body-md text-on-background">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Embers and Stars */}
        <div className="pixel-star" style={{ left: '15%', animationDuration: '15s', animationDelay: '0s' }}></div>
        <div className="pixel-ember" style={{ left: '28%', animationDuration: '12s', animationDelay: '2s' }}></div>
        <div className="pixel-star" style={{ left: '45%', animationDuration: '18s', animationDelay: '5s' }}></div>
        <div className="pixel-ember" style={{ left: '65%', animationDuration: '14s', animationDelay: '1s' }}></div>
        <div className="pixel-star" style={{ left: '82%', animationDuration: '16s', animationDelay: '3s' }}></div>
        <div className="pixel-ember" style={{ left: '92%', animationDuration: '20s', animationDelay: '7s' }}></div>
        <div className="pixel-star" style={{ left: '5%', animationDuration: '19s', animationDelay: '9s' }}></div>
        <div className="pixel-ember" style={{ left: '55%', animationDuration: '13s', animationDelay: '4s' }}></div>
        <img alt="Gamepad" className="absolute top-1/4 left-1/4 w-32 h-32 opacity-90 animate-float-gamepad drop-shadow-[8px_8px_0_rgba(91,33,182,0.3)]" src="/gamepad.png" />
        <img alt="Flame" className="absolute bottom-1/4 right-1/4 w-28 h-28 opacity-90 animate-float-flame drop-shadow-[8px_8px_0_rgba(220,38,38,0.3)]" src="/flame.png" />
        {/* Decorative Pixels */}
        <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-accent-yellow border-2 border-border-dark shadow-[4px_4px_0_0_#0F172A] animate-float"></div>
        <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-primary border-2 border-border-dark shadow-[4px_4px_0_0_#0F172A] animate-float-delayed"></div>
      </div>
      
      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md px-margin-mobile md:px-0 container-float">
        {/* Logo Area */}
        <div className="text-center mb-8">
          <h1 className="font-headline-xl text-headline-xl text-primary drop-shadow-[4px_4px_0_#5B21B6] mb-2 tracking-tighter">QUIZZY</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant font-medium">Sẵn sàng để thăng cấp kiến thức?</p>
        </div>
        
        {/* Main Card */}
        <div className="bg-surface-white border-[4px] border-border-dark shadow-[8px_8px_0_0_#5B21B6] p-8 relative">
          {/* Top decorative bar */}
          <div className="absolute top-0 left-0 w-full h-4 bg-surface-variant border-b-[4px] border-border-dark flex items-center px-2 space-x-2">
            <div className="w-2 h-2 bg-error border border-border-dark"></div>
            <div className="w-2 h-2 bg-accent-yellow border border-border-dark"></div>
            <div className="w-2 h-2 bg-tertiary-container border border-border-dark"></div>
          </div>
          
          <form className="space-y-6 mt-4" onSubmit={handleLogin}>
            {errorMsg && (
              <div className="bg-error/10 border-2 border-error text-error p-3 font-body-md font-bold mb-4">
                {errorMsg}
              </div>
            )}
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block font-label-caps text-label-caps text-on-surface uppercase" htmlFor="email">
                Email / Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-6 h-6" />
                <input 
                  className="w-full bg-surface border-[4px] border-border-dark p-3 pl-10 font-body-md text-on-surface focus:outline-none focus:border-primary voxel-input-shadow transition-colors" 
                  id="email" 
                  placeholder="player@voxel.edu" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loginMutation.isPending}
                />
              </div>
            </div>
            
            {/* Password Input */}
            <div className="space-y-2">
              <label className="block font-label-caps text-label-caps text-on-surface uppercase" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-6 h-6" />
                <input 
                  className="w-full bg-surface border-[4px] border-border-dark p-3 pl-10 font-body-md text-on-surface focus:outline-none focus:border-primary voxel-input-shadow transition-colors" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loginMutation.isPending}
                />
              </div>
            </div>
            
            {/* Submit Button & Forgot Password */}
            <div className="flex flex-col items-center gap-4">
              <button 
                className="w-full bg-primary text-on-primary font-headline-md text-headline-md py-4 px-6 border-[4px] border-border-dark shadow-[6px_6px_0_0_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_#0F172A] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center space-x-2 group disabled:opacity-70 disabled:pointer-events-none" 
                type="submit"
                disabled={loginMutation.isPending}
              >
                <span>{loginMutation.isPending ? 'CONNECTING...' : 'START GAME'}</span>
                {loginMutation.isPending ? (
                  <Loader2 className="animate-spin w-6 h-6 ml-2" />
                ) : (
                  <ArrowRight className="group-hover:translate-x-1 transition-transform w-6 h-6" />
                )}
              </button>
              <a className="font-body-md text-sm text-primary hover:underline font-bold" href="#">Forgot password?</a>
            </div>
          </form>
          
          {/* Divider */}
          <div className="my-8 flex items-center space-x-4">
            <div className="flex-1 h-[4px] bg-border-dark"></div>
            <span className="font-label-caps text-label-caps text-outline-variant px-2">OR CONNECT WITH</span>
            <div className="flex-1 h-[4px] bg-border-dark"></div>
          </div>
          
          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-surface-white border-[4px] border-border-dark p-3 shadow-[4px_4px_0_0_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#0F172A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center font-label-caps text-label-caps space-x-2 group">
              <img alt="Google" className="w-5 h-5 grayscale group-hover:grayscale-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCN4528k7kw4qgjWUFzOGclf6UC0QWYmr90BpLi8PLX1crwGgmD4YO_yIuaYbSDKCs33ss0KaBJ53n-G3P4OI7m80IiStJu8dIDYfru64kxgRmgLEJRDBFNE4qyPS0QkUK_yKaGkYKFC94io48dY4nDA68nunpmwOZCMdSB_I0WVTs3kGSQ5z1QQobo_5b08CMcHcIjBM2VRzVuJGY8_k6EsN4VG-_TDLSgcwaX1_2DbKkY4Jy6A1EFER81W7K_dDUZrCIc9TwOocI" />
              <span>GOOGLE</span>
            </button>
            <button className="bg-surface-white border-[4px] border-border-dark p-3 shadow-[4px_4px_0_0_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#0F172A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center font-label-caps text-label-caps space-x-2">
              <MessageSquare className="text-[#5865F2] w-5 h-5 fill-current" />
              <span>DISCORD</span>
            </button>
          </div>
          
          {/* Signup Link */}
          <p className="text-center mt-8 font-body-md text-on-surface-variant">
            New player? <a className="text-primary font-bold hover:underline" href="#">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
}

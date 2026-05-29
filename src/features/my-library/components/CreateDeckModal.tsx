'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { decksAPI } from '@/services/api';

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateDeckModal({ isOpen, onClose }: CreateDeckModalProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const createMutation = useMutation({
    mutationFn: () => decksAPI.create({ title, description, visibility: 'private', tags: [] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decks'] });
      setTitle('');
      setDescription('');
      onClose();
    },
    onError: (error: any) => {
      setErrorMsg(error.message || 'Failed to create deck.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Title is required');
      return;
    }
    createMutation.mutate();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface-white border-[4px] border-border-dark shadow-[8px_8px_0_0_#5B21B6] p-6 w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-outline-variant hover:text-on-surface"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <h2 className="font-display-sm text-display-sm text-primary mb-6">Create New Deck</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="bg-error/10 border-2 border-error text-error p-2 font-body-sm font-bold">
              {errorMsg}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="block font-label-caps text-label-caps text-on-surface uppercase">
              Deck Title
            </label>
            <input 
              className="w-full bg-surface border-[4px] border-border-dark p-3 font-body-md text-on-surface focus:outline-none focus:border-primary voxel-input-shadow transition-colors"
              placeholder="e.g. English Vocabulary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={createMutation.isPending}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block font-label-caps text-label-caps text-on-surface uppercase">
              Description (Optional)
            </label>
            <textarea 
              className="w-full bg-surface border-[4px] border-border-dark p-3 font-body-md text-on-surface focus:outline-none focus:border-primary voxel-input-shadow transition-colors resize-none h-24"
              placeholder="A brief description of this deck"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={createMutation.isPending}
            />
          </div>
          
          <div className="flex justify-end gap-4 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2 font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
              disabled={createMutation.isPending}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-primary text-on-primary font-headline-sm text-headline-sm py-2 px-6 border-[3px] border-border-dark shadow-[4px_4px_0_0_#0F172A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#0F172A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-70 disabled:pointer-events-none"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

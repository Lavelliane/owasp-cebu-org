'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FlagSubmissionFormProps {
  ctfId: string;
  userId: string;
}

export default function FlagSubmissionForm({ ctfId }: FlagSubmissionFormProps) {
  const router = useRouter();
  const [flag, setFlag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    message: string;
    type: 'success' | 'error' | null;
  }>({ message: '', type: null });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!flag.trim()) {
      setSubmitStatus({
        message: 'Please enter a flag',
        type: 'error'
      });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus({ message: '', type: null });
    
    try {
      const response = await fetch(`/api/ctfs/${ctfId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flag: flag.trim() })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Submission failed');
      }
      
      setSubmitStatus({
        message: data.correct 
          ? 'Congratulations! You solved the challenge!' 
          : 'Incorrect flag. Try again!',
        type: data.correct ? 'success' : 'error'
      });
      
      if (data.correct) {
        setFlag('');
        // Refresh the page after a short delay to show the success state
        setTimeout(() => {
          router.refresh();
        }, 1500);
      }
    } catch (error) {
      setSubmitStatus({
        message: error instanceof Error ? error.message : 'An error occurred',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {submitStatus.message && (
        <div 
          className={`mb-4 p-3 rounded ${
            submitStatus.type === 'success' 
              ? 'bg-green-900/30 border border-green-800 text-green-300' 
              : 'bg-red-900/30 border border-red-800 text-red-300'
          }`}
        >
          {submitStatus.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="flag">
            Flag
          </label>
          <input
            id="flag"
            type="text"
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
            placeholder="Enter flag from original submission site or as given in the challenge"
            className="w-full p-2 bg-black border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-white"
            disabled={isSubmitting}
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Flag'}
        </button>
      </form>
    </>
  );
} 
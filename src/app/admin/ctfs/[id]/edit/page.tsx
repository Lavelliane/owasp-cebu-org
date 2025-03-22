'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Form from '@radix-ui/react-form';
import * as Label from '@radix-ui/react-label';

// Define the validation schema
const ctfSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  hint: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  flag: z.string().min(1, 'Flag is required'),
  link: z.string().optional(),
  score: z.number().min(1, 'Score must be at least 1').max(1000, 'Score must be at most 1000')
});

type CTFFormData = z.infer<typeof ctfSchema>;

export default function EditCTFPage({params}: {params: Promise<{ id: string }>}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const { id } = use(params);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CTFFormData>({
    resolver: zodResolver(ctfSchema),
    defaultValues: {
      title: '',
      description: '',
      hint: '',
      category: '',
      flag: '',
      link: '',
      score: 100
    }
  });

  // Fetch existing CTF data
  useEffect(() => {
    const fetchCTF = async () => {
      try {
        setIsFetching(true);
        const response = await fetch(`/api/admin/ctfs/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Challenge not found');
          }
          throw new Error('Failed to fetch challenge');
        }
        
        const data = await response.json();
        
        // Reset the form with fetched data
        reset({
          title: data.title,
          description: data.description,
          hint: data.hint || '',
          category: data.category,
          flag: data.flag,
          link: data.link || '',
          score: data.score
        });
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsFetching(false);
      }
    };

    fetchCTF();
  }, [id, reset]);

  const onSubmit = async (data: CTFFormData) => {
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/admin/ctfs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to update challenge');
      }
      
      router.push('/admin/ctfs');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400">Loading challenge...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Edit Challenge</h1>
        <Link 
          href="/admin/ctfs" 
          className="text-sm text-gray-300 hover:text-white"
        >
          Back to Challenges
        </Link>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded text-red-300 text-sm">
          {error}
        </div>
      )}
      
      <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
        <Form.Root className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label.Root className="block text-sm font-medium" htmlFor="title">
              Title
            </Label.Root>
            <Form.Field className="space-y-1" name="title">
              <Form.Control asChild>
                <input
                  id="title"
                  className={`w-full p-2 bg-black border ${
                    errors.title ? 'border-red-500' : 'border-gray-700'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-white`}
                  type="text"
                  disabled={isLoading}
                  {...register('title')}
                />
              </Form.Control>
              {errors.title && (
                <Form.Message className="text-sm text-red-500">
                  {errors.title.message}
                </Form.Message>
              )}
            </Form.Field>
          </div>
          
          <div className="space-y-2">
            <Label.Root className="block text-sm font-medium" htmlFor="description">
              Description
            </Label.Root>
            <Form.Field className="space-y-1" name="description">
              <Form.Control asChild>
                <textarea
                  id="description"
                  className={`w-full p-2 bg-black border ${
                    errors.description ? 'border-red-500' : 'border-gray-700'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-white min-h-[100px]`}
                  disabled={isLoading}
                  {...register('description')}
                />
              </Form.Control>
              {errors.description && (
                <Form.Message className="text-sm text-red-500">
                  {errors.description.message}
                </Form.Message>
              )}
            </Form.Field>
          </div>
          
          <div className="space-y-2">
            <Label.Root className="block text-sm font-medium" htmlFor="hint">
              Hint (Optional)
            </Label.Root>
            <Form.Field className="space-y-1" name="hint">
              <Form.Control asChild>
                <input
                  id="hint"
                  className="w-full p-2 bg-black border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-white"
                  type="text"
                  disabled={isLoading}
                  {...register('hint')}
                />
              </Form.Control>
            </Form.Field>
          </div>
          
          <div className="space-y-2">
            <Label.Root className="block text-sm font-medium" htmlFor="category">
              Category
            </Label.Root>
            <Form.Field className="space-y-1" name="category">
              <Form.Control asChild>
                <input
                  id="category"
                  className={`w-full p-2 bg-black border ${
                    errors.category ? 'border-red-500' : 'border-gray-700'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-white`}
                  type="text"
                  disabled={isLoading}
                  {...register('category')}
                />
              </Form.Control>
              {errors.category && (
                <Form.Message className="text-sm text-red-500">
                  {errors.category.message}
                </Form.Message>
              )}
            </Form.Field>
          </div>
          
          <div className="space-y-2">
            <Label.Root className="block text-sm font-medium" htmlFor="flag">
              Flag
            </Label.Root>
            <Form.Field className="space-y-1" name="flag">
              <Form.Control asChild>
                <input
                  id="flag"
                  className={`w-full p-2 bg-black border ${
                    errors.flag ? 'border-red-500' : 'border-gray-700'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-white`}
                  type="text"
                  disabled={isLoading}
                  {...register('flag')}
                />
              </Form.Control>
              {errors.flag && (
                <Form.Message className="text-sm text-red-500">
                  {errors.flag.message}
                </Form.Message>
              )}
            </Form.Field>
          </div>
          
          <div className="space-y-2">
            <Label.Root className="block text-sm font-medium" htmlFor="link">
              Link (Optional)
            </Label.Root>
            <Form.Field className="space-y-1" name="link">
              <Form.Control asChild>
                <input
                  id="link"
                  className="w-full p-2 bg-black border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-white"
                  type="text"
                  disabled={isLoading}
                  {...register('link')}
                />
              </Form.Control>
            </Form.Field>
          </div>
          
          <div className="space-y-2">
            <Label.Root className="block text-sm font-medium" htmlFor="score">
              Score
            </Label.Root>
            <Form.Field className="space-y-1" name="score">
              <Form.Control asChild>
                <input
                  id="score"
                  className={`w-full p-2 bg-black border ${
                    errors.score ? 'border-red-500' : 'border-gray-700'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-white`}
                  type="number"
                  min="0"
                  max="999999"
                  disabled={isLoading}
                  {...register('score', { valueAsNumber: true })}
                />
              </Form.Control>
              {errors.score && (
                <Form.Message className="text-sm text-red-500">
                  {errors.score.message}
                </Form.Message>
              )}
            </Form.Field>
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <Link 
              href="/admin/ctfs"
              className="px-4 py-2 border border-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Cancel
            </Link>
            <Form.Submit asChild>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </Form.Submit>
          </div>
        </Form.Root>
      </div>
    </div>
  );
} 
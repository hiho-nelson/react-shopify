'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SubscribeSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
});

type SubscribeValues = z.infer<typeof SubscribeSchema>;

export default function SubscribeForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<SubscribeValues>({
    resolver: zodResolver(SubscribeSchema),
    mode: 'onSubmit',
  });

  const onSubmit = async (values: SubscribeValues) => {
    await new Promise((r) => setTimeout(r, 600));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full  mx-auto grid grid-cols-1 md:grid-cols-4 gap-3">
      <div>
        <Input placeholder="First name" className="h-11 px-4" {...register('firstName')} aria-invalid={!!errors.firstName} />
        {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
      </div>
      <div>
        <Input placeholder="Last name" className="h-11 px-4" {...register('lastName')} aria-invalid={!!errors.lastName} />
        {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
      </div>
      <div>
        <Input type="email" placeholder="Email address" className="h-11 px-4" {...register('email')} aria-invalid={!!errors.email} />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="h-11 rounded-none">
        {isSubmitting ? 'SUBMITTING…' : 'SUBSCRIBE'}
      </Button>
    </form>
  );
}



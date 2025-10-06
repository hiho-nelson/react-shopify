'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const ContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

type ContactFormValues = z.infer<typeof ContactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
    mode: 'onSubmit',
  });

  const onSubmit = async (values: ContactFormValues) => {
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    setSubmitted(true);
    reset();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

        {submitted && (
          <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4 text-green-800">
            Thanks! We have received your message.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input id="firstName" placeholder="First name" className="h-12" {...register('firstName')} aria-invalid={!!errors.firstName} />
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
            </div>
            <div>
              <Input id="lastName" placeholder="Last name" className="h-12" {...register('lastName')} aria-invalid={!!errors.lastName} />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <Input id="email" type="email" placeholder="Email" className="h-12" {...register('email')} aria-invalid={!!errors.email} />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <Input id="phone" placeholder="Phone" className="h-12" {...register('phone')} aria-invalid={!!errors.phone} />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
          </div>

          <div>
            <Textarea id="message" rows={5} placeholder="Message" {...register('message')} aria-invalid={!!errors.message} />
            {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting} className="h-12">
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </div>
    </div>
  );
}



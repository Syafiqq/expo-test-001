import { z } from 'zod';

import type { OptionType } from '@/ui';

export const priorities: OptionType[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const schema = z.object({
  title: z.string().min(10),
  description: z.string().min(120),
  dueDate: z.coerce.date(),
  dueDateDisplay: z.string(),
  completed: z.boolean().default(false),
  priority: z.enum(['low', 'medium', 'high']).default('low'),
});

export type FormType = z.infer<typeof schema>;

import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    author: z.string().default('Daniel Sinderson'),
    topic: z.enum(['mathematics', 'data science', 'poetry', 'game design', 'anthropology', 'electronics', 'misc']),
    type: z.enum(['essay', 'book review', 'project update', 'curriculum']),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };

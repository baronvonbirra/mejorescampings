import { defineCollection, z } from 'astro:content';

const guias = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default('Redacción MejoresCampings'),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().default('Imagen descriptiva de la guía'),
    relatedProvince: z.string().optional(),
  }),
});

export const collections = { guias };

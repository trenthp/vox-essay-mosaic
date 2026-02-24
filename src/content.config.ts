import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const authors = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/authors" }),
  schema: z.object({
    name: z.string(),
    number: z.string(),
    essayTitle: z.string(),
    theme: z.string(),
    bio: z.string(),
    excerpt: z.string(),
    teaser: z.string(),
    image: z.string().optional(),
    website: z.string().url().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    edition: z.string().default('edition-one'),
    published: z.boolean().default(true),
  }),
});

const essays = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/essays" }),
  schema: z.object({
    title: z.string(),
    author: z.string(), // references author id
    authorName: z.string(),
    theme: z.string(),
    wordCount: z.number(),
    readingTime: z.string(),
    edition: z.string().default('edition-one'),
    published: z.boolean().default(false),
    publishedAt: z.date().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    author: z.string().default('Wingmarks Editorial'),
    tags: z.array(z.string()).default([]),
    published: z.boolean().default(true),
    image: z.string().optional(),
  }),
});

const editions = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/editions" }),
  schema: z.object({
    title: z.string(),
    theme: z.string(),
    description: z.string(),
    launchDate: z.date(),
    status: z.enum(['upcoming', 'current', 'archived']).default('upcoming'),
    coverImage: z.string().optional(),
  }),
});

export const collections = { authors, essays, editions, blog };

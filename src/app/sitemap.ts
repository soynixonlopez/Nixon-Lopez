import type { MetadataRoute } from 'next'
import { getPublishedBlogPostsForSitemap } from '@/lib/blog'
import { getPublishedLandingsForSitemap } from '@/lib/landing-pages'
import { SITE_URL } from '@/lib/site-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${base}/cotizacion`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${base}/proyectos`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.88,
    },
    {
      url: `${base}/bootcamp`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${base}/masterclass`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${base}/politica-de-privacidad`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${base}/politica-de-cookies`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]

  const landings = await getPublishedLandingsForSitemap()
  const landingEntries: MetadataRoute.Sitemap = landings.map((landing) => ({
    url: `${base}/l/${landing.slug}`,
    lastModified: landing.updated_at ? new Date(landing.updated_at) : now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const blogPosts = await getPublishedBlogPostsForSitemap()
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.lastModified),
    changeFrequency: 'monthly',
    priority: 0.75,
  }))

  return [...staticEntries, ...landingEntries, ...blogEntries]
}

import { getPublishedBlogPosts, blogPostUrl } from '@/lib/blog'
import { SITE_NAME, SITE_URL } from '@/lib/site-config'

export const revalidate = 300

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function GET() {
  const posts = await getPublishedBlogPosts()
  const items = posts
    .map((post) => {
      const link = blogPostUrl(post.slug)
      const date = post.published_at || post.updated_at
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid>${escapeXml(link)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(date).toUTCString()}</pubDate>
    </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(`${SITE_NAME} — Blog`)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml('Artículos de desarrollo web, SEO y tecnología en Panamá.')}</description>
    <language>es-pa</language>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  })
}

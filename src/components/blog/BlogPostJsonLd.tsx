import { blogPostUrl, type BlogPostRow } from '@/lib/blog'
import { SITE_NAME, SITE_URL } from '@/lib/site-config'

type Props = { post: BlogPostRow }

export function BlogPostJsonLd({ post }: Props) {
  const url = blogPostUrl(post.slug)
  const image = post.featured_image_url || `${SITE_URL}/images/logooficial.png`
  const datePublished = post.published_at || post.created_at
  const dateModified = post.updated_at || datePublished

  const article = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seo_description || post.excerpt,
    image: [image],
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: post.author_name,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logooficial.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url,
    articleSection: post.category,
  }

  const crumbs = [
    { name: 'Inicio', item: SITE_URL },
    { name: 'Blog', item: `${SITE_URL}/blog` },
    { name: post.category, item: `${SITE_URL}/blog` },
    { name: post.title, item: url },
  ]

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </>
  )
}

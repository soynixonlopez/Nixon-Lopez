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
  }

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${SITE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: url,
      },
    ],
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

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function breadcrumbList(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.path}`,
    })),
  };
}

export function touristDestination(d: {
  name: string;
  description?: string | null;
  slug: string;
  coverImageUrl?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: d.name,
    description: d.description ?? undefined,
    url: `${baseUrl}/destinations/${d.slug}`,
    image: d.coverImageUrl ? `${baseUrl}${d.coverImageUrl}` : undefined,
  };
}

export function touristAttraction(p: {
  name: string;
  description?: string | null;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: p.name,
    description: p.description ?? undefined,
    url: `${baseUrl}/places/${p.slug}`,
  };
}

export function touristTrip(pkg: {
  name: string;
  shortDescription?: string | null;
  slug: string;
  priceFrom?: string | number | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.name,
    description: pkg.shortDescription ?? undefined,
    url: `${baseUrl}/packages/${pkg.slug}`,
    offers: pkg.priceFrom
      ? {
          "@type": "Offer",
          priceCurrency: "INR",
          price: pkg.priceFrom.toString(),
        }
      : undefined,
  };
}

export function article(post: {
  title: string;
  excerpt?: string | null;
  slug: string;
  postType: "ARTICLE" | "GUIDE";
  publishedAt?: Date | null;
  authorName?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    url: `${baseUrl}/${post.postType === "GUIDE" ? "guides" : "blog"}/${post.slug}`,
    datePublished: post.publishedAt?.toISOString(),
    author: post.authorName ? { "@type": "Person", name: post.authorName } : undefined,
  };
}

export function faqPage(faqs: { question: string; answer: string }[]) {
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

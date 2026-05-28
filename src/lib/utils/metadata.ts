export function generateMetadata(config?: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}) {
  const appName = "Quizzy";
  const defaultTitle = "Quizzy — Learn Smarter";
  const defaultDescription =
    "AI-powered flashcards and quizzes that adapt to you. Study less, remember more, and ace every exam.";
  const defaultImage = "/og-image.png";

  const title = config?.title ? `${config.title} | ${appName}` : defaultTitle;
  const description = config?.description ?? defaultDescription;
  const image = config?.image ?? defaultImage;

  return {
    metadataBase: new URL("https://quizzy.app"),
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 1200, height: 630 }],
      type: "website",
      locale: "en_US",
      siteName: appName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    ...(config?.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

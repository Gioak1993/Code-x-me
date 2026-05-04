import { useEffect } from "react";

const siteName = "CodexME";
const siteURL = "https://codexme.net";
const defaultImage = `${siteURL}/owl.svg`;

type SEOProps = {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function SEO({
  title,
  description,
  path = "/",
  type = "website",
  noIndex = false,
}: SEOProps) {
  useEffect(() => {
    const canonicalURL = new URL(path, siteURL).toString();
    const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

    document.title = fullTitle;
    setMeta("name", "description", description);
    setMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", canonicalURL);
    setMeta("property", "og:image", defaultImage);
    setMeta("name", "twitter:card", "summary");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setCanonical(canonicalURL);
  }, [description, noIndex, path, title, type]);

  return null;
}

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
}

function setCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );

  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }

  element.href = href;
}

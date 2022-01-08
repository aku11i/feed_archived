import type { Article } from "../types/articles.d.js";
import Parser from "rss-parser";
import { Feed, FeedOptions } from "feed";

const parser = new Parser();

const feedOptions: FeedOptions = {
  title: "aku11i's RSS",
  author: {
    name: "aku11i",
    link: "https://akutagawa.dev",
  },
  link: "https://akutagawa.dev",
  language: "ja",
  id: "https://akutagawa.dev",
  copyright: "",
} as const;

export const fetchArticlesFromRss = async (url: string): Promise<Article[]> => {
  const { items } = await parser.parseURL(url);
  return items.map((item) => ({
    title: item.title!,
    url: item.link!,
    publishedDate: item.pubDate!,
  }));
};

export const mergeArticles = (...articlesList: Article[][]): Article[] => {
  const articles = articlesList.flat();
  return articles.sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
};

export const generateRss = (articles: Article[]): string => {
  const feed = new Feed(feedOptions);
  articles.forEach((article) => {
    feed.addItem({
      title: article.title,
      link: article.url,
      published: new Date(article.publishedDate),
      date: new Date(article.publishedDate),
      id: article.url,
    });
  });

  return feed.rss2();
};

import {
  fetchArticlesFromRss,
  generateRss,
  mergeArticles,
} from "./lib/article.js";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import { createRequire } from "node:module";

/**
 * @see https://github.com/TypeStrong/ts-node/issues/1007#issuecomment-953464137
 * FIXME
 */
const { feeds, extraArticles }: typeof import("./feed.json") = createRequire(
  import.meta.url
)("./feed.json");

const RSS_DESTINATION = path.join(process.cwd(), "public", "articles.rss");

const articlesFromFeed = await Promise.all(
  feeds.map((feed) => fetchArticlesFromRss(feed))
);

const articles = mergeArticles(...articlesFromFeed, extraArticles);

const rss = generateRss(articles);

await fs.writeFile(RSS_DESTINATION, rss, { encoding: "utf-8" });

console.log("RSS feed was successfully exported: ", RSS_DESTINATION);

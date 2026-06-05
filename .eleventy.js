// .eleventy.js
const markdownIt = require("markdown-it");
const md = markdownIt({ html: true, linkify: true, breaks: true });

module.exports = function (eleventyConfig) {
  // Render a markdown string (the blog body) into HTML.
  eleventyConfig.addFilter("markdown", (str) => (str ? md.render(str) : ""));

  // Keep ALL your existing files exactly as they are — copy them straight through.
  eleventyConfig.addPassthroughCopy("products");      // CMS data
  eleventyConfig.addPassthroughCopy("admin");         // live CMS
  eleventyConfig.addPassthroughCopy("admin-dev");     // dev CMS
  eleventyConfig.addPassthroughCopy("admin-qa");      // qa CMS
  eleventyConfig.addPassthroughCopy("*.jpg");         // logos
  eleventyConfig.addPassthroughCopy("*.png");         // logos / favicons
  eleventyConfig.addPassthroughCopy("*.ico");
  // Include playground and other misc HTML files in the output
  eleventyConfig.addPassthroughCopy("playground.html");

  // Your storefront HTML files (the @-prefixed ones + index.html) are copied as-is.
  // We list them explicitly so Eleventy doesn't try to treat them as templates.
  eleventyConfig.addPassthroughCopy("index.html");
  eleventyConfig.addPassthroughCopy("@dailyloot.co.html");
  eleventyConfig.addPassthroughCopy("@just.one_click.co.html");
  eleventyConfig.addPassthroughCopy("@phase.blank.html");
  eleventyConfig.addPassthroughCopy("@cartedupdaily.html");

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "11ty.js"]  // only build .njk; HTML files are passthrough
  };
};

const Path = require('path');
const { DateTime } = require("luxon");
const fs = require("fs/promises");
const pluginNavigation = require("@11ty/eleventy-navigation");
const Image = require('@11ty/eleventy-img');
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItBlock = require("markdown-it-block-image");
const metagen = require('eleventy-plugin-metagen');
const criticalCss = require('eleventy-critical-css');
const htmlmin = require('html-minifier');
const {minify} = require('terser');

const DEFAULT_DOMAIN = 'localhost:8080';
process.setMaxListeners(0)
module.exports = function(eleventyConfig) {
  const pathPrefix = process.env.PATH_PREFIX || '/';

  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(criticalCss, {
    css: ['_site/css/*.css'],
  });
  eleventyConfig.addPlugin(metagen);

  eleventyConfig.setDataDeepMerge(true);

  const makeAbsolute = (url) => {
    let domain, protocol;
    if(process.env.DOMAIN) {
      domain = process.env.DOMAIN;
      protocol = 'https://';
    } else {
      domain = DEFAULT_DOMAIN;
      protocol = 'http://';
    }
    const prefixedUrl = Path.join(pathPrefix, url);
    return protocol + Path.join(domain, prefixedUrl);
  }

  eleventyConfig.addCollection('author', function(collectionApi) {
    return collectionApi.getFilteredByTag('author');
  });

  eleventyConfig.addShortcode("image", (src, alt, sizes, classes, widths) => {
    const options = {
      widths: widths ? widths.split(' ').map(s => parseInt(s, 10)) : [300],
      formats: ["webp", "svg"],
      outputDir: '_site/img',
      urlPath: pathPrefix + 'img/',
      //svgShortCircuit: true
    };

    const srcPath = Path.join('.', src)

    Image(srcPath, options);

    const metadata = Image.statsSync(srcPath, options);

    let imageAttributes = {
      alt,
      sizes: options.widths.map((width) => width + 'w'),
      loading: "lazy",
      decoding: "async",
      class: `img-fluid ${classes || ''}`
    };

    return Image.generateHTML(metadata, imageAttributes);
  })

  eleventyConfig.addPairedShortcode("social", function(content, social, share, title) {
    const url = makeAbsolute(this.page.url);
    const account = social.account;
    const sharePayload = eval('`' + social.post_url + '`')
    return `<a target="_blank" class="social" href="${ share ? sharePayload : social.url }">
        ${content}
      </a>`
  })

  eleventyConfig.addFilter('findProp', (collection, propName, target) => {
    return collection.find(item => item.data[propName] === target);
  });

  eleventyConfig.addFilter("date", (dateObj, format) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat(format);
  });

  //eleventyConfig.addFilter("slug", str => {
  //return slugify(str).toLowerCase();
  //});

  eleventyConfig.addFilter("absolute", makeAbsolute)

  eleventyConfig.addFilter("pad", number => {
    return number.toString().padStart(2, '0');
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if( n < 0 ) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addFilter('log', (elem) => {
    console.log(elem);
  });

  eleventyConfig.addFilter('selectPublished', (elem) => {
    return elem.filter((entry) => !!entry.data?.published);
  });

  eleventyConfig.addFilter('getCategories', (filters) => {
    return new Set(filters.map(f => f.data.category));
  });

  eleventyConfig.addFilter('escapejs', (str) => {
    return str.replace("'", "\\'")
  });

  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("video");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("js");
  //eleventyConfig.addPassthroughCopy("css/*.css");
  eleventyConfig.addPassthroughCopy("favicon.svg");
  eleventyConfig.addPassthroughCopy("admin/config.yml");

  /* Minify HTML */
  eleventyConfig.addTransform("htmlmin", function(content) {
    if(this.outputPath.endsWith(".html") ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  eleventyConfig.on('afterBuild', async () => {
    const code = {
      'splide.js': await fs.readFile('js/splide.js', {encoding: 'utf-8'}),
      'shuffle.min.js': await fs.readFile('js/shuffle.min.js', {encoding: 'utf-8'}),
      'isotope.js': await fs.readFile('js/isotope.pkgd.min.js', {encoding: 'utf-8'}),
      'index.js': await fs.readFile('js/index.js', {encoding: 'utf-8'}),
    };
    const result = await minify(code);
    await Promise.all([
      fs.writeFile('_site/js/index.min.js', result.code),
      fs.unlink('_site/js/index.js'),
      fs.unlink('_site/js/splide.js'),
      fs.unlink('_site/js/shuffle.min.js'),
      fs.unlink('_site/js/isotope.pkgd.min.js')
    ])
  })

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
    breaks: false,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: false,
    permalinkClass: "direct-link",
    permalinkSymbol: "#"
  }).use(markdownItBlock);
  // Remember old renderer, if overridden, or proxy to default renderer
  const defaultRender = markdownLibrary.renderer.rules.link_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  markdownLibrary.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    // If link URL is outside of this domain
    if(tokens[idx].attrGet('href').startsWith('http'))
      tokens[idx].attrPush(['target', '_blank']); // add new attribute

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self);
  };

  markdownLibrary.renderer.rules.image = function (tokens, idx, options, env, slf) {
    var token = tokens[idx]
    token.attrs[token.attrIndex('alt')][1] = slf.renderInlineAsText(token.children, options, env)
    // this is the line of code responsible for an additional 'loading' attribute
    token.attrSet('loading', 'lazy');
    return slf.renderToken(tokens, idx, options);
  }

  eleventyConfig.setLibrary("md", markdownLibrary);
  eleventyConfig.addFilter('markdown', (string, strip) => {
    return strip ?
      markdownLibrary.renderInline(string)
      : markdownLibrary.render(string);
  });

  // Browsersync Overrides
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: async function(err, browserSync) {
        const content_404 = await fs.readFile('_site/404.html');

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
    files: './_site/css/**/*.css',
    ui: false,
    ghostMode: false
  });

  return {
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid",
    ],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about those.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`
    pathPrefix: pathPrefix ? pathPrefix : "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",

    // These are all optional, defaults are shown:
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};

#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const cheerio = require('cheerio');

fs.truncateSync('./scripts/attrs.ts', 0);

https
  .get('https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes', response => {
    const attrs = [];
    let data = '';

    response.on('data', chunk => {
      data += chunk;
    });

    response.on('end', () => {
      const doc = cheerio.load(data);

      doc('.standard-table')
        .find('tbody tr td:first-child code')
        .each((i, node) => {
          const [child] = node.children;

          if (child && child.type === 'text' && !child.data.includes('*')) {
            attrs.push(`'[${child.data}]'`);
          }
        });

      fs.writeFileSync('./scripts/attrs.ts', `type HTMLAttributes = ${attrs.join(' | ')};`, {
        encoding: 'utf8',
        flag: 'a',
      });
    });
  })
  .on('error', error => {
    console.error(error.message);
  });

https
  .get('https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute', response => {
    const attrs = [];
    let data = '';

    response.on('data', chunk => {
      data += chunk;
    });

    response.on('end', () => {
      const doc = cheerio.load(data);

      doc('.index')
        .find('ul li code a')
        .each((i, node) => {
          const [child] = node.children;

          if (child && child.type === 'text' && !child.data.includes('*')) {
            attrs.push(`'[${child.data}]'`);
          }
        });

      fs.writeFileSync('./scripts/attrs.ts', `\n\ntype SVGAttributes = ${attrs.join(' | ')};`, {
        encoding: 'utf8',
        flag: 'a',
      });
    });
  })
  .on('error', error => {
    console.error(error.message);
  });

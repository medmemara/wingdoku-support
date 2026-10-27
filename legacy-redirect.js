'use strict';
// Older app versions use GitHub Pages. Keep their links working at the new host.
if (location.hostname === 'medmemara.github.io' && location.pathname.startsWith('/wingdoku-support/')) {
  const page = location.pathname.slice('/wingdoku-support/'.length);
  const known = new Set(['', 'index.html', 'index-en.html', 'privacy.html', 'privacy-en.html', 'terms.html', 'terms-en.html', 'delete-account.html', 'delete-account-en.html']);
  if (known.has(page)) location.replace('https://wingdoku.pages.dev/' + page + location.hash);
}

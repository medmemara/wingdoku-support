'use strict';
const fs = require('node:fs');
const path = require('node:path');
const site = JSON.parse(fs.readFileSync('discovery.json', 'utf8'));
const origin = 'https://wingdoku.pages.dev';
const email = 'delta-busboy-carat@duck.com';
const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
const languageCopy = {
  ko:'앱 안에서 133개 언어·표기를 지원합니다. 기기 언어를 따르며 설정에서 변경할 수 있습니다.',
  en:'The app supports 133 languages and writing variants. It follows your device language, with a manual choice in Settings.',
  ja:'アプリは133の言語・表記に対応。端末の言語に合わせて表示され、設定で変更できます。',
  de:'Die App unterstützt 133 Sprachen und Schreibvarianten. Sie folgt der Gerätesprache; eine eigene Auswahl ist in den Einstellungen möglich.',
  es:'La aplicación admite 133 idiomas y variantes de escritura. Sigue el idioma del dispositivo y permite cambiarlo en Ajustes.',
  fr:'L’application prend en charge 133 langues et variantes d’écriture. Elle suit la langue de l’appareil, avec un choix manuel dans les réglages.',
  'zh-Hans':'应用支持133种语言及书写形式。默认跟随设备语言，也可在设置中更改。'
};
const alternates = site.locales.map(l => `<link rel="alternate" hreflang="${escape(l.code)}" href="${origin}${l.path}">`).join('');
const languageLinks = current => site.locales.map(l => `<a href="${l.path}" lang="${l.code}" hreflang="${l.code}"${l.code===current?' aria-current="page"':''}>${escape(l.label)}</a>`).join('');
const paragraphs = text => text.split('\n\n').map(t => `<p>${escape(t).replace(/\n/g,'<br>')}</p>`).join('');

for (const l of site.locales) {
  if (!/^[a-z]{2}(?:-[A-Za-z]+)?$/.test(l.code) || !languageCopy[l.code]) throw Error('Unsupported locale '+l.code);
  const canonical = origin+l.path;
  const legalSuffix = l.code==='ko' ? '' : '-en';
  const graph = {'@context':'https://schema.org','@graph':[
    {'@type':'Organization','@id':origin+'/#publisher','name':'goyo works','alternateName':'고요웍스','url':origin+'/','email':email},
    {'@type':'MobileApplication','@id':origin+'/#app','name':'Wingdoku','alternateName':'윙도쿠','url':origin+'/',
      'applicationCategory':'GameApplication','genre':'Logic puzzle','operatingSystem':'iOS, Android',
      'description':l.short,'isAccessibleForFree':true,'offers':{'@type':'Offer','price':'0','priceCurrency':'USD'},
      'publisher':{'@id':origin+'/#publisher'},'image':origin+'/assets/icon.webp',
      'identifier':[{'@type':'PropertyValue','propertyID':'Apple App Store ID','value':site.appleAppId},
        {'@type':'PropertyValue','propertyID':'Android package','value':site.androidPackage}]},
    {'@type':'WebPage','@id':canonical+'#page','url':canonical,'name':l.title,'description':l.short,
      'inLanguage':l.code,'dateModified':site.updatedOn,'about':{'@id':origin+'/#app'},'publisher':{'@id':origin+'/#publisher'}}
  ]};
  const body = l.description.split('\n\n').slice(2).map(block => {
    const lines=block.split('\n');
    return lines.length>1 ? `<section><h3>${escape(lines.shift().replace(/^■\s*/,''))}</h3><p>${escape(lines.join('\n')).replace(/\n/g,'<br>')}</p></section>` : `<p>${escape(block)}</p>`;
  }).join('');
  const html = `<!doctype html>
<html lang="${l.code}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(l.title)}</title><meta name="description" content="${escape(l.short)}"><link rel="canonical" href="${canonical}">
${alternates}<link rel="alternate" hreflang="x-default" href="${origin}/en/">
<meta property="og:type" content="website"><meta property="og:site_name" content="Wingdoku"><meta property="og:title" content="${escape(l.title)}"><meta property="og:description" content="${escape(l.short)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${origin}/assets/share.png"><meta property="og:image:width" content="1024"><meta property="og:image:height" content="500"><meta property="og:image:alt" content="Wingdoku">
<meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#10152c"><meta name="apple-itunes-app" content="app-id=${site.appleAppId}">
<link rel="icon" type="image/webp" href="/assets/icon.webp"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/discovery.css"><script type="application/ld+json">${json(graph)}</script></head>
<body class="discovery"><header><a class="brand" href="${l.path}"><img src="/assets/icon.webp" width="64" height="64" alt="Wingdoku"><span><strong>WINGDOKU</strong><br>윙도쿠</span></a><a href="#support">${escape(l.support)}</a></header>
<main><nav class="languages" aria-label="Language">${languageLinks(l.code)}</nav>
<div class="hero"><div><p class="eyebrow">${escape(l.storeName)}</p><h1>${escape(l.subtitle)}</h1>${paragraphs(l.intro)}<p class="facts">${escape(l.facts)}</p><p class="release">${escape(l.release)}</p>
<div class="stores">${site.appleReleased?`<a class="button" href="https://apps.apple.com/app/id${site.appleAppId}">App Store</a>`:'<span>App Store</span>'}${site.androidReleased?`<a class="button" href="https://play.google.com/store/apps/details?id=${site.androidPackage}">Google Play</a>`:'<span>Google Play</span>'}</div></div>
<figure><img class="game-screen" src="/assets/${l.code}-game.jpg" width="690" height="1500" alt="${escape(l.screensTitle)}" fetchpriority="high"><figcaption>${escape(l.screensTitle)}</figcaption></figure></div>
<section class="details"><h2>${escape(l.detailsTitle)}</h2><p>${escape(languageCopy[l.code])}</p><div class="feature-grid">${body}</div></section>
<section class="faq"><h2>${escape(l.faqTitle)}</h2>${l.faq.map(([q,a])=>`<section><h3>${escape(q)}</h3><p>${escape(a)}</p></section>`).join('')}</section>
<section id="support" class="support"><h2>${escape(l.support)}</h2><a class="button" href="mailto:${email}">${escape(l.contact)}</a><p><a href="mailto:${email}">${email}</a></p><nav><a href="/privacy${legalSuffix}.html">${escape(l.privacy)}</a><a href="/terms${legalSuffix}.html">${escape(l.terms)}</a><a href="/delete-account${legalSuffix}.html">${escape(l.delete)}</a></nav></section></main>
<footer>goyo works (고요웍스 | 개인사업자)<br>© 2026 goyo works. <a href="mailto:${email}">${email}</a></footer></body></html>\n`;
  const file=path.join('dist',l.path==='/'?'index.html':l.path.slice(1)+'index.html');
  fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,html);
}
const xmlEscape = value => String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[ch]));
fs.writeFileSync('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'+site.locales.map(l=>`<url><loc>${origin}${l.path}</loc><lastmod>${site.updatedOn}</lastmod>${site.locales.map(a=>`<xhtml:link rel="alternate" hreflang="${a.code}" href="${xmlEscape(origin+a.path)}"/>`).join('')}<xhtml:link rel="alternate" hreflang="x-default" href="${origin}/en/"/></url>`).join('\n')+'\n</urlset>\n');
fs.writeFileSync('dist/robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
fs.writeFileSync('dist/_redirects','/index-en.html /en/ 301\n/index-en /en/ 301\n/ko / 301\n/ko/ / 301\n');
fs.writeFileSync('dist/_headers','/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n/assets/*\n  Cache-Control: public, max-age=86400\n');
fs.writeFileSync('dist/404.html','<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found · Wingdoku</title><link rel="stylesheet" href="/style.css"></head><body><main><h1>Page not found</h1><p>페이지를 찾을 수 없습니다.</p><nav>'+languageLinks('')+'</nav></main></body></html>\n');
fs.copyFileSync('discovery.css','dist/discovery.css');
fs.mkdirSync('dist/assets',{recursive:true});
for(const name of fs.readdirSync('assets')){
  if(!/^[A-Za-z0-9-]+\.(?:jpg|png|webp|svg)$/.test(name))throw Error('Unexpected public asset: '+name);
  fs.copyFileSync('assets/'+name,'dist/assets/'+name);
}
for(const name of fs.readdirSync('.')){
  if(/^google[a-f0-9]+\.html$/.test(name)||name==='indexnow.txt')fs.copyFileSync(name,'dist/'+name);
}
console.log(`Built ${site.locales.length} localized product pages, XML sitemap, robots and 404.`);

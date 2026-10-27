'use strict';
// Publish only public support assets; never include repository metadata or credentials.
const fs=require('node:fs');
const files=['index.html','index-en.html','terms.html','terms-en.html','privacy.html','privacy-en.html','delete-account.html','delete-account-en.html','style.css','icon.png','app-ads.txt'];
fs.rmSync('dist',{recursive:true,force:true});
fs.mkdirSync('dist',{recursive:true});
for(const name of files)fs.copyFileSync(name,'dist/'+name);
if(fs.existsSync('legacy-redirect.js'))fs.copyFileSync('legacy-redirect.js','dist/legacy-redirect.js');
fs.writeFileSync('dist/deployment.json',JSON.stringify({commit:process.env.CF_PAGES_COMMIT_SHA||'local',privacyVersion:'1.1',termsVersion:'1.0'},null,2)+'\n');
console.log('Built '+files.length+' public support assets.');

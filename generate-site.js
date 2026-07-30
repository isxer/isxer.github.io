#!/usr/bin/env node
/**
 * 精选账号商城 · SUS Outdoors 风格静态站生成器
 * 设计理念：温暖大地色调 · 杂志式排版 · 全屏大图 · 编辑感布局
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DIST_DIR = path.join(__dirname, 'dist');

function loadJSON(name) {
    const fp = path.join(DATA_DIR, name);
    if (!fs.existsSync(fp)) return null;
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
}
function loadRootJSON(name) {
    const fp = path.join(__dirname, name);
    if (!fs.existsSync(fp)) return null;
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
}
function esc(s) { return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fixImg(url, base) {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return base + url;
    return url;
}

const SEO = loadRootJSON('seo.json') || {};
const SITE_TITLE = SEO.title || '精选账号商城';
const SEO_TITLE_SUFFIX = SEO.titleSuffix || '';
const SEO_DESC = SEO.description || '';
const SEO_KEYWORDS = SEO.keywords || '';
const SEO_AUTHOR = SEO.author || SITE_TITLE;
const SEO_ROBOTS = SEO.robots || 'index, follow';
const SEO_CANONICAL = SEO.canonical || '';
const SEO_OG = SEO.og || {};
const SEO_TWITTER = SEO.twitter || {};
const SEO_JSON_LD = SEO.jsonLd || {};
const SEO_FAVICON = SEO.favicon || '';

const CSS = `
:root {
  --bg: #faf8f5;
  --bg-cream: #f5f0ea;
  --bg-dark: #1a1a1a;
  --bg-card: #ffffff;
  --text: #1a1a1a;
  --text-secondary: #6b6b6b;
  --text-muted: #9a9a9a;
  --text-on-dark: #faf8f5;
  --accent: #5a6b52;
  --accent-hover: #4a5a43;
  --accent-light: rgba(90,107,82,0.08);
  --warm: #c4a882;
  --warm-light: rgba(196,168,130,0.12);
  --border: #e5e0da;
  --border-light: #ece8e3;
  --shadow: 0 2px 12px rgba(0,0,0,0.06);
  --shadow-lg: 0 8px 40px rgba(0,0,0,0.08);
  --radius: 4px;
  --radius-lg: 8px;
  --max-w: 1200px;
  --font: 'Georgia', 'Noto Serif SC', 'Source Han Serif SC', serif;
  --font-sans: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', 'PingFang SC', 'Noto Sans SC', sans-serif;
  --ease: cubic-bezier(0.25, 0.1, 0.25, 1);
  --transition: 0.35s var(--ease);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font-sans);
  background: var(--bg); color: var(--text);
  line-height: 1.7; overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
a { color: var(--text); text-decoration: none; transition: color var(--transition); }
a:hover { color: var(--accent); }
img { max-width: 100%; height: auto; display: block; }
.container { max-width: var(--max-w); margin: 0 auto; padding: 0 clamp(20px, 4vw, 48px); }

/* ── Navigation ── */
.nav {
  position: sticky; top: 0; z-index: 1000;
  background: var(--bg); border-bottom: 1px solid var(--border);
  transition: background var(--transition), box-shadow var(--transition);
}
.nav.scrolled { box-shadow: 0 1px 8px rgba(0,0,0,0.04); }
.nav-inner {
  max-width: var(--max-w); margin: 0 auto; padding: 0 clamp(20px, 4vw, 48px);
  display: flex; align-items: center; justify-content: space-between; height: 64px;
}
.nav-brand { display: flex; align-items: center; gap: 12px; }
.nav-logo { height: 36px; width: auto; border-radius: 4px; flex-shrink: 0; }
.nav-name { font-size: 1rem; font-weight: 600; letter-spacing: 0.02em; color: var(--text); }
.nav-links { display: flex; align-items: center; gap: 32px; }
.nav-link {
  font-size: 0.82rem; font-weight: 400; color: var(--text-secondary);
  letter-spacing: 0.04em; text-transform: uppercase; transition: color var(--transition);
}
.nav-link:hover { color: var(--text); }
.nav-cta {
  font-size: 0.82rem; font-weight: 500; color: var(--text-on-dark);
  background: var(--text); padding: 8px 22px; border-radius: 2px;
  letter-spacing: 0.06em; text-transform: uppercase; transition: all var(--transition);
}
.nav-cta:hover { background: var(--accent); color: var(--text-on-dark); }

/* ── Hero ── */
.hero {
  position: relative; overflow: hidden;
  height: clamp(480px, 70vh, 720px);
  display: flex; align-items: center; justify-content: center;
}
.hero-bg { position: absolute; inset: 0; z-index: 0; }
.hero-bg img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.55) contrast(1.05); }
.hero-overlay { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 100%); }
.hero-content { position: relative; z-index: 2; text-align: center; padding: 0 24px; max-width: 680px; }
.hero-eyebrow {
  font-size: 0.75rem; font-weight: 500; letter-spacing: 0.2em;
  text-transform: uppercase; color: rgba(255,255,255,0.7); margin-bottom: 20px;
}
.hero h1 {
  font-family: var(--font); font-size: clamp(2.2rem, 5.5vw, 3.8rem);
  font-weight: 400; letter-spacing: 0.02em; line-height: 1.15; color: #fff; margin-bottom: 20px;
}
.hero-sub { font-size: 1.05rem; color: rgba(255,255,255,0.8); line-height: 1.7; margin-bottom: 36px; font-weight: 300; }
.hero-cta {
  display: inline-block; padding: 14px 40px; background: #fff; color: var(--text);
  font-size: 0.82rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
  border-radius: 2px; transition: all var(--transition);
}
.hero-cta:hover { background: var(--accent); color: #fff; }

/* ── Stats Bar ── */
.stats-bar { display: flex; justify-content: center; flex-wrap: wrap; border-bottom: 1px solid var(--border); }
.stat-item { flex: 1; min-width: 140px; text-align: center; padding: 28px 16px; border-right: 1px solid var(--border); }
.stat-item:last-child { border-right: none; }
.stat-num { font-family: var(--font); font-size: 1.8rem; font-weight: 400; color: var(--text); line-height: 1.2; }
.stat-num .unit { font-size: 0.9rem; color: var(--text-muted); }
.stat-label { font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }

/* ── Section Header ── */
.section-head { padding: 80px 0 40px; border-bottom: 1px solid var(--border); margin-bottom: 48px; }
.section-head .eyebrow { font-size: 0.72rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
.section-head h2 { font-family: var(--font); font-size: clamp(1.6rem, 3.5vw, 2.4rem); font-weight: 400; letter-spacing: 0.01em; line-height: 1.2; }
.section-head p { font-size: 0.95rem; color: var(--text-secondary); margin-top: 12px; max-width: 520px; line-height: 1.7; }

/* ── Category Banner ── */
.cat-banner { display: grid; grid-template-columns: 1fr 1fr; min-height: 420px; overflow: hidden; }
.cat-banner.reverse { direction: rtl; }
.cat-banner.reverse > * { direction: ltr; }
.cat-banner-img { position: relative; overflow: hidden; background: var(--bg-cream); }
.cat-banner-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s var(--ease); }
.cat-banner:hover .cat-banner-img img { transform: scale(1.03); }
.cat-banner-text {
  display: flex; flex-direction: column; justify-content: center;
  padding: clamp(32px, 5vw, 64px); background: var(--bg-cream);
}
.cat-banner-text .eyebrow { font-size: 0.72rem; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
.cat-banner-text h3 { font-family: var(--font); font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 400; line-height: 1.25; margin-bottom: 16px; }
.cat-banner-text p { font-size: 0.92rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 28px; }
.cat-banner-text .link-arrow {
  font-size: 0.82rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--text); display: inline-flex; align-items: center; gap: 8px; transition: all var(--transition);
}
.cat-banner-text .link-arrow:hover { color: var(--accent); gap: 14px; }

/* ── Product Grid ── */
.products-section { padding: 0 0 80px; }
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; }
.product-card {
  display: block; position: relative; background: var(--bg-card);
  border: 1px solid var(--border-light); border-radius: var(--radius);
  overflow: hidden; text-decoration: none; color: inherit;
  transition: all 0.4s var(--ease);
}
.product-card:hover { box-shadow: var(--shadow-lg); border-color: transparent; transform: translateY(-4px); }
.pcard-img { position: relative; overflow: hidden; aspect-ratio: 4 / 3; background: var(--bg-cream); }
.pcard-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s var(--ease); }
.product-card:hover .pcard-img img { transform: scale(1.04); }
.pcard-badge {
  position: absolute; top: 12px; left: 12px; z-index: 2;
  font-size: 0.68rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--text-on-dark); background: rgba(26,26,26,0.75); backdrop-filter: blur(6px);
  padding: 4px 12px; border-radius: 2px;
}
.pcard-body { padding: 18px 20px 20px; }
.pcard-cat { font-size: 0.68rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 6px; }
.pcard-name {
  font-size: 0.9rem; font-weight: 400; line-height: 1.55; color: var(--text);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden; min-height: 2.8em; margin-bottom: 14px;
}
.pcard-bottom { display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid var(--border-light); }
.pcard-price { font-family: var(--font); font-size: 1.1rem; font-weight: 400; color: var(--text); }
.pcard-price .prefix { font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-sans); margin-right: 1px; }
.pcard-action { font-size: 0.72rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); transition: color var(--transition); }
.product-card:hover .pcard-action { color: var(--accent); }

/* ── Features Strip ── */
.features-strip { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.feat-item { text-align: center; padding: 40px 20px; border-right: 1px solid var(--border); transition: background var(--transition); }
.feat-item:last-child { border-right: none; }
.feat-item:hover { background: var(--bg-cream); }
.feat-icon { font-size: 1.6rem; margin-bottom: 14px; display: block; }
.feat-item h4 { font-size: 0.82rem; font-weight: 600; letter-spacing: 0.04em; margin-bottom: 6px; }
.feat-item p { font-size: 0.78rem; color: var(--text-secondary); line-height: 1.55; max-width: 200px; margin: 0 auto; }

/* ── CTA ── */
.cta-section { background: var(--bg-dark); color: var(--text-on-dark); padding: 80px 24px; text-align: center; }
.cta-section h2 { font-family: var(--font); font-size: clamp(1.5rem, 3.5vw, 2.2rem); font-weight: 400; margin-bottom: 12px; }
.cta-section p { font-size: 0.95rem; color: rgba(250,248,245,0.6); margin-bottom: 32px; font-weight: 300; }
.cta-btn-dark {
  display: inline-block; padding: 14px 40px; background: #fff; color: var(--text);
  font-size: 0.82rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
  border-radius: 2px; transition: all var(--transition);
}
.cta-btn-dark:hover { background: var(--accent); color: #fff; }

/* ── Footer ── */
.footer { padding: 48px 24px 40px; border-top: 1px solid var(--border); text-align: center; }
.footer-links { margin-bottom: 16px; }
.footer-links a { font-size: 0.78rem; color: var(--text-secondary); letter-spacing: 0.06em; text-transform: uppercase; transition: color var(--transition); }
.footer-links a:hover { color: var(--text); }
.footer p { font-size: 0.72rem; color: var(--text-muted); line-height: 1.8; }
.footer a.fine { color: var(--text-muted); } .footer a.fine:hover { color: var(--text-secondary); }

/* ── Animations ── */
.reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.7s var(--ease), transform 0.7s var(--ease); }
.reveal.visible { opacity: 1; transform: translateY(0); }

/* ── Responsive ── */
@media (max-width: 900px) {
  .cat-banner { grid-template-columns: 1fr; min-height: auto; }
  .cat-banner.reverse { direction: ltr; }
  .cat-banner-img { height: 260px; }
  .features-strip { grid-template-columns: repeat(2, 1fr); }
  .feat-item:nth-child(2) { border-right: none; }
  .feat-item:nth-child(1), .feat-item:nth-child(2) { border-bottom: 1px solid var(--border); }
}
@media (max-width: 768px) {
  .hero { height: clamp(360px, 55vh, 520px); }
  .hero h1 { font-size: 1.8rem; }
  .hero-sub { font-size: 0.92rem; }
  .stats-bar { flex-wrap: wrap; }
  .stat-item { min-width: 50%; border-bottom: 1px solid var(--border); }
  .stat-item:nth-child(2) { border-right: none; }
  .section-head { padding: 56px 0 28px; margin-bottom: 32px; }
  .section-head h2 { font-size: 1.4rem; }
  .products-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .pcard-body { padding: 14px 16px 16px; }
  .pcard-name { font-size: 0.82rem; }
  .pcard-price { font-size: 1rem; }
  .nav-links { display: none; }
  .cta-section { padding: 56px 20px; }
}
@media (max-width: 480px) {
  .hero h1 { font-size: 1.5rem; }
  .products-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .pcard-badge { font-size: 0.6rem; padding: 3px 8px; }
  .features-strip { grid-template-columns: 1fr 1fr; }
  .feat-item { padding: 28px 16px; }
  .hero-cta, .cta-btn-dark { padding: 12px 28px; font-size: 0.78rem; }
}
`;

const JS = `
document.addEventListener('DOMContentLoaded', () => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 60); obs.unobserve(e.target); }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  const nav = document.querySelector('.nav');
  if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 10), { passive: true });
});
`;

function main() {
    const config = loadJSON('config.json') || {};
    const categories = loadJSON('categories.json') || [];
    const products = loadJSON('products.json') || [];
    const meta = loadJSON('meta.json') || {};

    if (!products.length) { console.error('❌ 没有商品数据'); process.exit(1); }

    const siteUrl = meta.siteUrl || process.env.SITE_URL || 'https://hltx.cc.cd';
    const siteName = SITE_TITLE;
    const GITHUB_PAGES_URL = SEO_CANONICAL || 'https://isxer.github.io';

    if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true });

    function shortCatName(name) {
        return name
            .replace(/谷歌美国电话\/?/i, '')
            .replace(/GoogleVoice\s*\/?\s*GV靓号/i, 'GV 靓号')
            .replace(/谷歌邮箱\s*\/?\s*油管\s*\/?\s*Google\s*\/?\s*Gmail/i, '谷歌邮箱')
            .replace(/苹果id\s*\/?\s*Apple\s*id\s*\/?\s*AppStore/i, 'Apple ID')
            .replace(/服务类/i, '增值服务')
            .trim() || name;
    }

    const activeCats = categories.filter(c => products.some(p => p.category_id === c.id && p.active !== 0));

    // Category banners
    const catBanners = activeCats.sort((a,b) => (a.sort||0) - (b.sort||0)).map((cat, idx) => {
        const catProducts = products.filter(p => p.category_id === cat.id && p.active !== 0);
        if (!catProducts.length) return '';
        const sampleImg = catProducts[0].image_url ? fixImg(catProducts[0].image_url, siteUrl) : '';
        const reverseClass = idx % 2 === 1 ? ' reverse' : '';
        const desc = {
            1: '优质 Google Voice 靓号，支持 AAA、AAABCCC 等多种号码类型，免税区老号、情侣号可选。',
            2: '精选 Gmail 老号与纯数字邮箱，安全稳定，即买即用。普通号、纯数字号、3AAA 靓号均可选购。',
            3: '美区、日区、韩区、港区、台区及中国区 Apple ID，纯净账号未开通 iCloud，可直接下载 APP。',
            4: '专业部署服务，一次购买永久使用，包含图床搭建、发卡网搭建等增值服务。',
        };
        return `
<div class="cat-banner${reverseClass} reveal">
    <div class="cat-banner-img">
        ${sampleImg ? `<img src="${esc(sampleImg)}" alt="${esc(shortCatName(cat.name))}" loading="lazy">` : ''}
    </div>
    <div class="cat-banner-text">
        <div class="eyebrow">${esc(shortCatName(cat.name))}</div>
        <h3>${esc(shortCatName(cat.name))}</h3>
        <p>${esc(desc[cat.id] || '精选优质数字账号，自动发货，品质保障。')}</p>
        <a href="${siteUrl}" target="_blank" rel="noopener" class="link-arrow">查看${esc(shortCatName(cat.name))} →</a>
    </div>
</div>`;
    }).join('\n');

    // Product cards
    const cards = products.filter(p => p.active !== 0).sort((a,b) => (a.sort||0) - (b.sort||0)).map(p => {
        const cat = categories.find(c => c.id === p.category_id);
        const catName = cat ? shortCatName(cat.name) : '';
        const img = p.image_url ? fixImg(p.image_url, siteUrl) : '';
        const variants = p.variants || [];
        const minPrice = variants.length ? Math.min(...variants.map(v => v.price)) : 0;
        const tags = (p.tags || '').split(',').map(t => t.trim()).filter(Boolean);
        const cleanTag = t => t.replace(/b[12]#[0-9a-fA-F]{3,6}/g, '').replace(/#[0-9a-fA-F]{3,6}$/g, '').replace(/\s+/g, ' ').trim();
        const badge = cleanTag(tags[0] || '');
        return `
            <a class="product-card reveal" href="${siteUrl}/product?id=${p.id}" target="_blank" rel="noopener">
                <div class="pcard-img">
                    ${img ? `<img src="${esc(img)}" alt="${esc(p.name)}" loading="lazy">` : ''}
                    ${badge ? `<div class="pcard-badge">${esc(badge)}</div>` : ''}
                </div>
                <div class="pcard-body">
                    <div class="pcard-cat">${esc(catName)}</div>
                    <div class="pcard-name">${esc(p.name)}</div>
                    <div class="pcard-bottom">
                        <div class="pcard-price"><span class="prefix">¥</span>${minPrice.toFixed(2)}</div>
                        <div class="pcard-action">查看详情 →</div>
                    </div>
                </div>
            </a>`;
    }).join('\n');

    const totalProducts = products.filter(p => p.active !== 0).length;
    const totalVariants = products.reduce((s, p) => s + (p.variants?.length || 0), 0);
    const ogImage = products[0]?.image_url ? fixImg(products[0].image_url, siteUrl) : '';

    const jsonLd = { "@context": "https://schema.org", "@type": "WebSite", "name": siteName, "description": SEO_DESC, "url": GITHUB_PAGES_URL, "potentialAction": { "@type": "SearchAction", "target": `${siteUrl}/product?id={search_term_string}`, "query-input": "required name=search_term_string" } };
    const itemListLd = { "@context": "https://schema.org", "@type": "ItemList", "itemListElement": products.filter(p => p.active !== 0).map((p, i) => ({ "@type": "ListItem", "position": i + 1, "item": { "@type": "Product", "name": p.name, "url": `${siteUrl}/product?id=${p.id}`, "image": p.image_url ? fixImg(p.image_url, siteUrl) : '', "offers": { "@type": "Offer", "price": p.variants?.length ? Math.min(...p.variants.map(v => v.price)) : 0, "priceCurrency": "CNY" } } })) };

    const heroImg = products[0]?.image_url ? fixImg(products[0].image_url, siteUrl) : '';

    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(siteName)}${SEO_TITLE_SUFFIX ? ' – ' + esc(SEO_TITLE_SUFFIX) : ''}</title>
    <meta name="description" content="${esc(SEO_DESC)}">
    <meta name="keywords" content="${esc(SEO_KEYWORDS)}">
    <meta name="author" content="${esc(SEO_AUTHOR)}">
    <meta name="robots" content="${esc(SEO_ROBOTS)}">
    <meta name="googlebot" content="${esc(SEO_ROBOTS)}">
    ${SEO_CANONICAL ? `<link rel="canonical" href="${esc(SEO_CANONICAL)}">` : ''}
    <meta property="og:type" content="${esc(SEO_OG.type || 'website')}">
    <meta property="og:url" content="${esc(SEO_OG.url || GITHUB_PAGES_URL)}">
    <meta property="og:title" content="${esc(siteName)}">
    <meta property="og:description" content="${esc(SEO_DESC)}">
    ${ogImage ? `<meta property="og:image" content="${esc(ogImage)}">` : ''}
    <meta property="og:locale" content="${esc(SEO_OG.locale || 'zh_CN')}">
    <meta property="og:site_name" content="${esc(SEO_OG.siteName || siteName)}">
    <meta name="twitter:card" content="${esc(SEO_TWITTER.card || 'summary_large_image')}">
    <meta name="twitter:title" content="${esc(siteName)}">
    <meta name="twitter:description" content="${esc(SEO_DESC)}">
    ${ogImage ? `<meta name="twitter:image" content="${esc(ogImage)}">` : ''}
    <script type="application/ld+json">${JSON.stringify({...SEO_JSON_LD, ...jsonLd})}</script>
    <script type="application/ld+json">${JSON.stringify(itemListLd)}</script>
    ${SEO_FAVICON ? `<link rel="icon" href="${esc(SEO_FAVICON)}">` : ''}
    <style>${CSS}</style>
</head>
<body>

<nav class="nav" id="nav">
    <div class="nav-inner">
        <div class="nav-brand">
            <img class="nav-logo" src="${esc(fixImg(meta.siteLogo || '', siteUrl))}" alt="${esc(siteName)}">
            <span class="nav-name">${esc(siteName)}</span>
        </div>
        <div class="nav-links">
            <a href="#products" class="nav-link">全部商品</a>
            <a href="#features" class="nav-link">为什么选择我们</a>
            <a href="${siteUrl}" target="_blank" rel="noopener" class="nav-cta">进入商城</a>
        </div>
    </div>
</nav>

<section class="hero">
    <div class="hero-bg">
        ${heroImg ? `<img src="${esc(heroImg)}" alt="${esc(siteName)}">` : ''}
        <div class="hero-overlay"></div>
    </div>
    <div class="hero-content">
        <div class="hero-eyebrow">全自动发货 · 即买即用 · 品质保障</div>
        <h1>精选优质数字账号资源</h1>
        <p class="hero-sub">高品质 Google Voice 靓号、Gmail 邮箱、Apple ID 等数字账号，稳定可靠，值得信赖。</p>
        <a href="${siteUrl}" target="_blank" rel="noopener" class="hero-cta">浏览全部商品</a>
    </div>
</section>

<div class="stats-bar">
    <div class="stat-item"><div class="stat-num">${activeCats.length}</div><div class="stat-label">商品分类</div></div>
    <div class="stat-item"><div class="stat-num">${totalProducts}</div><div class="stat-label">在售商品</div></div>
    <div class="stat-item"><div class="stat-num">${totalVariants}<span class="unit">+</span></div><div class="stat-label">可选规格</div></div>
    <div class="stat-item"><div class="stat-num">24<span class="unit">h</span></div><div class="stat-label">自动发货</div></div>
</div>

<div class="container">
    <div class="section-head reveal">
        <div class="eyebrow">Our Collection</div>
        <h2>精选数字账号</h2>
        <p>严选优质资源，覆盖 Google Voice、Gmail、Apple ID 等主流数字账号，满足您的多元需求。</p>
    </div>
</div>

${catBanners}

<div class="container" id="products">
    <div class="section-head reveal">
        <div class="eyebrow">All Products</div>
        <h2>全部商品</h2>
    </div>
</div>

<section class="products-section">
    <div class="container">
        <div class="products-grid">
            ${cards}
        </div>
    </div>
</section>

<div id="features">
    <div class="features-strip">
        <div class="feat-item"><span class="feat-icon">⚡</span><h4>即时自动发货</h4><p>付款后系统自动发送账号，24 小时不间断</p></div>
        <div class="feat-item"><span class="feat-icon">🛡️</span><h4>品质保证</h4><p>严格验证，质保期内免费更换</p></div>
        <div class="feat-item"><span class="feat-icon">💎</span><h4>源头直供</h4><p>一手资源，无中间商差价</p></div>
        <div class="feat-item"><span class="feat-icon">🎯</span><h4>靓号可选</h4><p>支持自选号码，精准匹配需求</p></div>
    </div>
</div>

<section class="cta-section">
    <h2>找到你需要的了吗？</h2>
    <p>全场自动发货，安全可靠，品质有保障</p>
    <a href="${siteUrl}" target="_blank" rel="noopener" class="cta-btn-dark">立即前往商城</a>
</section>

<footer class="footer">
    <div class="container">
        <div class="footer-links"><a href="${siteUrl}" target="_blank" rel="noopener">进入商城</a></div>
        <p style="margin-bottom:4px">© ${new Date().getFullYear()} ${esc(siteName)} · 所有商品均为虚拟数字商品</p>
        <p>商城地址：<a class="fine" href="${siteUrl}" target="_blank" rel="noopener">${esc(siteUrl)}</a></p>
    </div>
</footer>

<script>${JS}</script>
</body>
</html>`;

    fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html);
    console.log(`✅ dist/index.html (${(Buffer.byteLength(html)/1024).toFixed(1)}KB)`);
    console.log(`   商品: ${totalProducts} 个`);
    console.log(`   分类: ${activeCats.length} 个`);
    console.log(`   风格: SUS Outdoors · 温暖大地色 · 杂志排版`);
}

main();

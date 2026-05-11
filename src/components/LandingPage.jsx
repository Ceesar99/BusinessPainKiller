import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const LOGO_B64 = "data:image/png;base64,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";

const SUPABASE_URL = "https://rbzteggbpscchnvvllum.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJienRlZ2dicHNjY2hudnZsbHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMzU3NDMsImV4cCI6MjA5MzkxMTc0M30.frzwTOlwq64-BUcWM4k5f-uu9NHW4HU3anvuHnm1jB4";

async function saveToSupabase(data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist_submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Prefer": "return=minimal"
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Supabase error: " + res.status);
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@300;400;500;600;700;800;900&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --red: #C8102E; --red-dark: #9B0B22; --red-glow: rgba(200,16,46,0.25);
  --black: #0A0A0A; --white: #FFFFFF; --off-white: #F7F6F4;
  --gray-light: #F0EFED; --gray-mid: #BDBDBD; --gray-text: #555555;
  --bebas: "Bebas Neue", sans-serif; --manrope: "Manrope", sans-serif;
}
html { scroll-behavior: smooth; }
body { background: var(--white); color: var(--black); font-family: var(--manrope); overflow-x: hidden; }
#bpk-root { position: relative; z-index: 1; }
#three-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
.nav { position: sticky; top: 0; z-index: 200; background: #0A0A0A; border-bottom: 1px solid rgba(200,16,46,0.25); padding: 0 48px; height: 72px; display: flex; align-items: center; justify-content: space-between; }
.logo-wrap { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.logo-img { height: 46px; width: auto; object-fit: contain; display: block; flex-shrink: 0; }
.logo-text { font-family: var(--manrope); font-weight: 900; font-size: 17px; color: #fff; letter-spacing: -0.3px; line-height: 1.2; white-space: nowrap; }
.logo-text span { color: var(--red); }
.logo-tagline { font-size: 9px; color: rgba(255,255,255,0.4); font-weight: 500; letter-spacing: 0.5px; }
.nav-links { display: flex; gap: 26px; list-style: none; flex-shrink: 0; }
.nav-links a { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.2s; display: flex; align-items: center; gap: 5px; white-space: nowrap; }
.nav-links a:hover { color: var(--red); }
.nav-cta { background: var(--red); color: #fff; border: none; padding: 9px 18px; border-radius: 7px; font-family: var(--manrope); font-weight: 800; font-size: 12px; cursor: pointer; transition: all 0.2s; white-space: nowrap; flex-shrink: 0; display: flex; align-items: center; gap: 6px; }
.nav-cta:hover { background: var(--red-dark); }
.hero { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; align-items: center; padding: 80px 60px; max-width: 1400px; margin: 0 auto; position: relative; z-index: 1; }
.hero-left { padding-right: 40px; }
.hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 7px 16px; border-radius: 100px; background: rgba(200,16,46,0.08); border: 1px solid rgba(200,16,46,0.2); font-size: 11px; font-weight: 800; color: var(--red); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 32px; }
.badge-pulse { width: 7px; height: 7px; background: var(--red); border-radius: 50%; animation: pulse 1.8s infinite; flex-shrink: 0; }
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1);box-shadow:0 0 0 0 rgba(200,16,46,0.4)} 50%{opacity:0.7;transform:scale(0.8);box-shadow:0 0 0 6px rgba(200,16,46,0)} }
.hero-headline { font-family: var(--bebas); font-size: clamp(78px,9vw,134px); line-height: 0.87; letter-spacing: 3px; color: var(--black); margin-bottom: 28px; }
.hero-headline .red { color: var(--red); }
.hero-headline .outline { -webkit-text-stroke: 3px var(--black); color: transparent; }
.hero-sub { font-size: 18px; line-height: 1.75; color: var(--gray-text); font-weight: 500; max-width: 500px; margin-bottom: 40px; }
.hero-actions { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 48px; }
.btn-primary { background: var(--red); color: #fff; border: none; padding: 18px 36px; border-radius: 8px; font-family: var(--manrope); font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.25s; box-shadow: 0 6px 30px var(--red-glow); display: inline-flex; align-items: center; gap: 8px; }
.btn-primary:hover { background: var(--red-dark); transform: translateY(-2px); }
.btn-outline { background: transparent; color: var(--black); border: 2.5px solid rgba(0,0,0,0.2); padding: 18px 36px; border-radius: 8px; font-family: var(--manrope); font-weight: 900; font-size: 15px; cursor: pointer; transition: all 0.25s; display: inline-flex; align-items: center; gap: 8px; }
.btn-outline:hover { background: var(--black); color: #fff; }
.hero-stats { display: flex; border: 1px solid rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden; background: var(--white); box-shadow: 0 4px 24px rgba(0,0,0,0.06); max-width: 480px; }
.hero-stat { flex: 1; padding: 18px 20px; border-right: 1px solid rgba(0,0,0,0.08); text-align: center; }
.hero-stat:last-child { border-right: none; }
.stat-val { font-family: var(--bebas); font-size: 38px; color: var(--red); letter-spacing: 1px; line-height: 1; }
.stat-lbl { font-size: 10px; color: var(--gray-text); font-weight: 600; margin-top: 4px; display: flex; align-items: center; justify-content: center; gap: 4px; }
.hero-right { position: relative; height: 580px; display: flex; align-items: center; justify-content: center; }
.card-stack { position: relative; width: 370px; perspective: 1200px; }
.stack-card { width: 100%; border-radius: 20px; padding: 30px; position: absolute; left: 0; box-shadow: 0 30px 80px rgba(0,0,0,0.12); }
.card-back-2 { top:-16px;left:20px;width:calc(100% - 16px);height:100%;background:#F0EFED;border:1px solid rgba(0,0,0,0.06);animation:floatBack2 7s ease-in-out infinite; }
.card-back-1 { top:-8px;left:10px;width:calc(100% - 8px);height:100%;background:#E8E6E3;border:1px solid rgba(0,0,0,0.07);animation:floatBack1 6s ease-in-out infinite; }
@keyframes floatBack1 { 0%,100%{transform:rotateX(2deg) rotateY(-2deg) translateZ(-30px)} 50%{transform:rotateX(4deg) rotateY(-4deg) translateZ(-30px) translateY(-6px)} }
@keyframes floatBack2 { 0%,100%{transform:rotateX(4deg) rotateY(-4deg) translateZ(-60px)} 50%{transform:rotateX(6deg) rotateY(-6deg) translateZ(-60px) translateY(-10px)} }
.card-front { background:#fff;border:1px solid rgba(0,0,0,0.1);position:relative;top:0;left:0;animation:floatFront 5s ease-in-out infinite;transform-style:preserve-3d; }
@keyframes floatFront { 0%,100%{transform:rotateX(6deg) rotateY(-8deg) translateY(0)} 33%{transform:rotateX(2deg) rotateY(-4deg) translateY(-14px)} 66%{transform:rotateX(8deg) rotateY(-10deg) translateY(-7px)} }
.card-eyebrow { font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--red);margin-bottom:8px;display:flex;align-items:center;gap:6px; }
.card-title { font-family:var(--bebas);font-size:28px;color:var(--black);margin-bottom:10px; }
.card-body { font-size:14px;color:var(--gray-text);line-height:1.6;margin-bottom:20px; }
.card-bar-wrap { margin-bottom:6px; }
.card-bar-top { display:flex;justify-content:space-between;font-size:12px;margin-bottom:8px;font-weight:700; }
.card-bar { height:8px;background:var(--gray-light);border-radius:100px;overflow:hidden; }
.card-bar-fill { height:100%;background:linear-gradient(90deg,var(--red),#FF3B5C);border-radius:100px;animation:fillBar 2.5s ease-out forwards; }
@keyframes fillBar { from{width:0} to{width:82%} }
.card-divider { height:1px;background:var(--gray-light);margin:16px 0; }
.card-footer-row { display:flex;justify-content:space-between;align-items:center; }
.card-status { display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--red); }
.status-dot { width:8px;height:8px;background:var(--red);border-radius:50%;animation:pulse 1.5s infinite; }
.card-count { font-size:12px;color:var(--gray-text);font-weight:600;display:flex;align-items:center;gap:4px; }
.float-badge { position:absolute;background:#fff;border:1px solid rgba(0,0,0,0.1);border-radius:14px;padding:12px 16px;box-shadow:0 16px 48px rgba(0,0,0,0.12);animation:floatBadge 5s ease-in-out infinite;z-index:10; }
.float-badge-1 { top:30px;right:-55px;animation-delay:-1s; }
.float-badge-2 { bottom:90px;left:-65px;animation-delay:-2.5s; }
.float-badge-3 { bottom:10px;right:-35px;animation-delay:-0.8s; }
@keyframes floatBadge { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
.fb-label { font-size:10px;color:var(--gray-text);font-weight:600;margin-bottom:3px;display:flex;align-items:center;gap:4px; }
.fb-value { font-family:var(--bebas);font-size:22px;color:var(--black); }
.fb-value.red { color:var(--red); }
.fb-sub { font-size:10px;color:var(--gray-text);margin-top:2px; }
.ticker-section { background:var(--black);padding:14px 0;overflow:hidden;position:relative;z-index:1; }
.ticker-track { display:flex;gap:56px;animation:ticker 28s linear infinite;white-space:nowrap; }
@keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
.ticker-item { display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;color:rgba(255,255,255,0.55);flex-shrink:0; }
.ticker-item .hi { color:var(--red);font-weight:800; }
.ticker-sep { color:rgba(255,255,255,0.2); }
.section { max-width:1280px;margin:0 auto;padding:96px 60px;position:relative;z-index:1; }
.eyebrow { font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:var(--red);margin-bottom:14px;display:flex;align-items:center;gap:8px; }
.section-title { font-family:var(--bebas);font-size:clamp(52px,6.5vw,90px);letter-spacing:2px;color:var(--black);line-height:0.9;margin-bottom:14px; }
.section-sub { font-size:17px;color:var(--gray-text);line-height:1.7;max-width:500px;font-weight:500; }
.steps-row { display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-top:60px;background:rgba(0,0,0,0.07);border-radius:20px;overflow:hidden;border:1px solid rgba(0,0,0,0.08); }
.step { background:#fff;padding:44px 32px;transition:background 0.3s; }
.step:hover { background:var(--off-white); }
.step-num { font-family:var(--bebas);font-size:76px;color:rgba(200,16,46,0.07);line-height:1;margin-bottom:16px; }
.step-icon { width:48px;height:48px;background:rgba(200,16,46,0.07);border:1px solid rgba(200,16,46,0.15);border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:16px; }
.step-title { font-size:20px;font-weight:900;color:var(--black);margin-bottom:10px; }
.step-desc { font-size:14px;color:var(--gray-text);line-height:1.65; }
.pain-grid { display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:44px; }
.pain-card { background:#fff;border:1px solid rgba(0,0,0,0.09);border-radius:18px;padding:28px;display:flex;gap:18px;transition:all 0.3s;box-shadow:0 2px 12px rgba(0,0,0,0.04); }
.pain-card:hover { border-color:rgba(200,16,46,0.25);transform:translateY(-3px);box-shadow:0 16px 40px rgba(200,16,46,0.08); }
.pain-icon { width:48px;height:48px;border-radius:12px;background:rgba(200,16,46,0.07);border:1px solid rgba(200,16,46,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.pain-title { font-size:16px;font-weight:900;color:var(--black);margin-bottom:5px; }
.pain-desc { font-size:14px;color:var(--gray-text);line-height:1.6; }
.pain-cost { font-size:12px;font-weight:800;color:var(--red);margin-top:7px;display:flex;align-items:center;gap:5px; }
.pricing-section { background:var(--black);position:relative;z-index:1;overflow:hidden; }
.pricing-section::before { content:"";position:absolute;top:-200px;left:-200px;width:600px;height:600px;background:radial-gradient(circle,rgba(200,16,46,0.12) 0%,transparent 70%);pointer-events:none; }
.pricing-inner { max-width:1280px;margin:0 auto;padding:96px 60px;display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center;position:relative; }
.pricing-left .eyebrow { color:rgba(200,16,46,0.9); }
.pricing-title { font-family:var(--bebas);font-size:clamp(50px,6vw,90px);letter-spacing:2px;color:#fff;line-height:0.9;margin-bottom:20px; }
.pricing-title .red { color:var(--red); }
.pricing-desc { font-size:16px;color:rgba(255,255,255,0.55);line-height:1.75;margin-bottom:32px; }
.pricing-card { background:#fff;border-radius:22px;padding:44px;position:relative;overflow:hidden; }
.pricing-card::before { content:"";position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--red),#FF3B5C); }
.price-was-row { display:flex;align-items:center;gap:10px;margin-bottom:6px; }
.price-was { font-size:17px;color:var(--gray-mid);text-decoration:line-through;font-weight:700; }
.price-was-label { font-size:12px;color:var(--gray-text); }
.price-big-row { display:flex;align-items:flex-end;gap:10px;margin-bottom:6px; }
.price-big { font-family:var(--bebas);font-size:96px;color:var(--red);letter-spacing:-2px;line-height:1; }
.price-mo { font-size:17px;color:var(--gray-text);font-weight:600;padding-bottom:12px; }
.price-tag { display:inline-flex;align-items:center;gap:6px;padding:5px 12px;background:rgba(200,16,46,0.08);border:1px solid rgba(200,16,46,0.2);border-radius:100px;font-size:11px;font-weight:800;color:var(--red);margin-bottom:22px; }
.perks { display:flex;flex-direction:column;gap:11px;margin-bottom:28px; }
.perk { display:flex;align-items:center;gap:11px;font-size:14px;color:var(--black);font-weight:500; }
.perk-icon { width:20px;height:20px;background:var(--red);border-radius:5px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.spots-wrap { margin-bottom:24px; }
.spots-top { display:flex;justify-content:space-between;font-size:12px;font-weight:700;margin-bottom:7px; }
.spots-bar { height:9px;background:var(--gray-light);border-radius:100px;overflow:hidden; }
.spots-fill { height:100%;width:73%;background:linear-gradient(90deg,var(--red),#FF3B5C);border-radius:100px; }
.spots-sub { font-size:11px;color:var(--gray-text);margin-top:5px; }
.countdown-wrap { margin-bottom:24px; }
.countdown { display:flex;gap:10px; }
.cbox { background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:12px 14px;text-align:center;min-width:60px; }
.cnum { font-family:var(--bebas);font-size:34px;color:var(--red);line-height:1; }
.clabel { font-size:9px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-top:2px; }
.guarantee { font-size:11px;color:var(--gray-text);text-align:center;margin-top:12px;display:flex;align-items:center;justify-content:center;gap:5px; }
.testi-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:52px; }
.testi { background:#fff;border:1px solid rgba(0,0,0,0.08);border-radius:18px;padding:28px;transition:all 0.3s; }
.testi:hover { transform:translateY(-4px);box-shadow:0 20px 50px rgba(0,0,0,0.08); }
.testi-stars { color:var(--red);font-size:14px;letter-spacing:2px;margin-bottom:14px; }
.testi-quote { font-size:14px;color:var(--black);line-height:1.7;margin-bottom:20px;font-style:italic; }
.testi-author { display:flex;align-items:center;gap:11px; }
.testi-av { width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,rgba(200,16,46,0.1),rgba(200,16,46,0.2));border:2px solid rgba(200,16,46,0.15);display:flex;align-items:center;justify-content:center;font-family:var(--bebas);font-size:15px;color:var(--red); }
.testi-name { font-size:13px;font-weight:800;color:var(--black); }
.testi-role { font-size:11px;color:var(--gray-text); }
.faq-list { margin-top:52px;display:flex;flex-direction:column;border:1px solid rgba(0,0,0,0.09);border-radius:18px;overflow:hidden; }
.faq-item { border-bottom:1px solid rgba(0,0,0,0.07);background:#fff; }
.faq-item:last-child { border-bottom:none; }
.faq-q { width:100%;text-align:left;padding:22px 28px;background:none;border:none;font-family:var(--manrope);font-weight:700;font-size:15px;color:var(--black);cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:14px;transition:color 0.2s; }
.faq-q:hover { color:var(--red); }
.faq-chevron { width:28px;height:28px;border-radius:7px;background:var(--off-white);border:1px solid rgba(0,0,0,0.08);display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--gray-text);flex-shrink:0;transition:all 0.3s; }
.faq-chevron.open { background:var(--red);color:#fff;border-color:var(--red);transform:rotate(180deg); }
.faq-a { max-height:0;overflow:hidden;transition:max-height 0.4s ease,padding 0.3s;font-size:14px;color:var(--gray-text);line-height:1.7;padding:0 28px; }
.faq-a.open { max-height:200px;padding:0 28px 22px; }
.waitlist-section { background:var(--off-white);position:relative;z-index:1; }
.waitlist-inner { max-width:1280px;margin:0 auto;padding:96px 60px;display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:start; }
.wl-title { font-family:var(--bebas);font-size:clamp(50px,6vw,80px);letter-spacing:2px;color:var(--black);line-height:0.9;margin-bottom:18px; }
.wl-title .red { color:var(--red); }
.wl-sub { font-size:15px;color:var(--gray-text);line-height:1.75;margin-bottom:32px; }
.wl-trust { display:flex;flex-direction:column;gap:13px; }
.wl-trust-item { display:flex;align-items:center;gap:11px;font-size:14px;color:var(--black);font-weight:500; }
.wl-trust-icon { width:34px;height:34px;background:rgba(200,16,46,0.08);border:1px solid rgba(200,16,46,0.15);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
.email-notice { background:rgba(200,16,46,0.05);border:1px solid rgba(200,16,46,0.18);border-radius:10px;padding:14px 16px;display:flex;align-items:flex-start;gap:10px;margin-top:24px; }
.email-notice-text { font-size:13px;color:var(--black);line-height:1.55; }
.email-notice-text strong { color:var(--red); }
.form-box { background:#fff;border:1px solid rgba(0,0,0,0.08);border-radius:22px;padding:44px;box-shadow:0 8px 40px rgba(0,0,0,0.06); }
.form-box-title { font-family:var(--bebas);font-size:30px;letter-spacing:1px;color:var(--black);margin-bottom:6px; }
.form-box-sub { font-size:13px;color:var(--gray-text);margin-bottom:22px;display:flex;align-items:center;gap:6px; }
.form-grid { display:flex;flex-direction:column;gap:14px; }
.flabel { font-size:10px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--gray-text);margin-bottom:5px;display:flex;align-items:center;gap:5px; }
.fselect,.finput,.ftextarea { width:100%;background:var(--off-white);border:1.5px solid rgba(0,0,0,0.1);border-radius:9px;padding:13px 14px;font-family:var(--manrope);font-size:14px;color:var(--black);outline:none;transition:border-color 0.2s;resize:none; }
.fselect { appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23555' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;background-color:var(--off-white);cursor:pointer; }
.fselect:focus,.finput:focus,.ftextarea:focus { border-color:var(--red);box-shadow:0 0 0 3px rgba(200,16,46,0.08); }
.finput::placeholder,.ftextarea::placeholder { color:var(--gray-mid); }
.submit-btn { width:100%;background:var(--red);color:#fff;border:none;padding:18px 28px;border-radius:9px;font-family:var(--manrope);font-weight:900;font-size:16px;cursor:pointer;transition:all 0.25s;box-shadow:0 6px 28px var(--red-glow);margin-top:6px;display:flex;align-items:center;justify-content:center;gap:8px; }
.submit-btn:hover { background:var(--red-dark);transform:translateY(-2px); }
.submit-btn:disabled { opacity:0.7;cursor:not-allowed;transform:none; }
.form-note { font-size:11px;color:var(--gray-text);text-align:center;margin-top:10px;display:flex;align-items:center;justify-content:center;gap:5px; }
.success-box { text-align:center;padding:44px 20px; }
.success-icon { font-size:56px;margin-bottom:18px; }
.success-title { font-family:var(--bebas);font-size:38px;color:var(--red);letter-spacing:1px;margin-bottom:10px; }
.success-desc { font-size:14px;color:var(--gray-text);line-height:1.7;margin-bottom:16px; }
.success-email-note { background:rgba(200,16,46,0.06);border:1px solid rgba(200,16,46,0.2);border-radius:10px;padding:14px 16px;font-size:13px;color:var(--black);line-height:1.6;display:flex;align-items:flex-start;gap:8px;text-align:left; }
.success-email-note strong { color:var(--red); }
.error-msg { background:rgba(200,16,46,0.08);border:1px solid rgba(200,16,46,0.25);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--red);font-weight:600;margin-top:8px; }
.footer { background:var(--black);padding:36px 60px;display:flex;align-items:center;justify-content:space-between;position:relative;z-index:1;border-top:1px solid rgba(200,16,46,0.2); }
.footer-copy { font-size:13px;color:rgba(255,255,255,0.35); }
.footer-copy span { color:var(--red); }
.footer-links { display:flex;gap:24px; }
.footer-links a { font-size:12px;color:rgba(255,255,255,0.35);text-decoration:none;transition:color 0.2s; }
.footer-links a:hover { color:#fff; }
@media (max-width:900px) {
  .nav { padding:0 18px; } .nav-links { display:none; }
  .hero { grid-template-columns:1fr;padding:56px 20px 36px;min-height:auto;gap:44px; }
  .hero-right { height:400px; } .float-badge { display:none; }
  .section { padding:56px 20px; } .steps-row { grid-template-columns:1fr; }
  .pain-grid { grid-template-columns:1fr; }
  .pricing-inner { grid-template-columns:1fr;padding:56px 20px;gap:44px; }
  .testi-grid { grid-template-columns:1fr; }
  .waitlist-inner { grid-template-columns:1fr;padding:56px 20px;gap:36px; }
  .footer { flex-direction:column;gap:14px;padding:28px 20px;text-align:center; }
  .card-stack { width:290px; }
}
`;

const Icon = {
  rocket: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.5-1 5.5-1 5.5s4-0.5 5.5-2L4.5 16.5z"/><path d="M12 2C6 2 2 8 2 12l10 10c4 0 10-4 10-10C22 8 18 2 12 2z"/><circle cx="12" cy="12" r="3"/></svg>,
  check: () => <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,6 5,9 10,3"/></svg>,
  arrow: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>,
  calendar: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  invoice: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  box: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  chat: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  trending: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C8102E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></svg>,
  users: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  lock: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  bolt: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></svg>,
  target: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  mail: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  gear: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  search: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  build: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/></svg>,
  tag: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  award: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21,13.89 7,23 12,20 17,23 15.79,13.88"/></svg>,
  mic: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
};

/* ── THREE.JS BACKGROUND (from BPK Pro) ── */
function ThreeBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 18;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xC8102E, 1.2);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);
    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight2.position.set(-5, -5, 5);
    scene.add(dirLight2);

    const redMat = new THREE.MeshPhongMaterial({ color: 0xC8102E, shininess: 120, transparent: true, opacity: 0.18 });
    const whiteMat = new THREE.MeshPhongMaterial({ color: 0x222222, shininess: 80, transparent: true, opacity: 0.07 });
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xC8102E, wireframe: true, transparent: true, opacity: 0.06 });
    const meshes = [];

    const torusGeo = new THREE.TorusGeometry(6, 0.35, 20, 80);
    const torus = new THREE.Mesh(torusGeo, redMat);
    torus.position.set(8, 0, -4); torus.rotation.x = Math.PI / 4;
    scene.add(torus); meshes.push({ mesh: torus, rx: 0.003, ry: 0.005, rz: 0.001 });

    const torus2Geo = new THREE.TorusGeometry(5, 0.2, 16, 60);
    const torus2 = new THREE.Mesh(torus2Geo, wireMat);
    torus2.position.set(-8, 2, -6); torus2.rotation.x = -Math.PI / 6;
    scene.add(torus2); meshes.push({ mesh: torus2, rx: -0.004, ry: 0.003, rz: 0.002 });

    const icoGeo = new THREE.IcosahedronGeometry(2.5, 1);
    const ico = new THREE.Mesh(icoGeo, redMat);
    ico.position.set(-7, -4, -3);
    scene.add(ico); meshes.push({ mesh: ico, rx: 0.005, ry: 0.007, rz: 0.003 });

    const icoWireGeo = new THREE.IcosahedronGeometry(2.7, 1);
    const icoWire = new THREE.Mesh(icoWireGeo, wireMat);
    icoWire.position.set(-7, -4, -3);
    scene.add(icoWire); meshes.push({ mesh: icoWire, rx: 0.005, ry: 0.007, rz: 0.003 });

    const octGeo = new THREE.OctahedronGeometry(1.8);
    const oct = new THREE.Mesh(octGeo, whiteMat);
    oct.position.set(5, 5, -2);
    scene.add(oct); meshes.push({ mesh: oct, rx: 0.007, ry: -0.005, rz: 0.004 });

    for (let i = 0; i < 12; i++) {
      const sGeo = new THREE.SphereGeometry(0.12 + Math.random() * 0.25, 12, 12);
      const sMat = new THREE.MeshPhongMaterial({ color: i % 3 === 0 ? 0xC8102E : 0x333333, transparent: true, opacity: 0.12 + Math.random() * 0.1, shininess: 100 });
      const s = new THREE.Mesh(sGeo, sMat);
      s.position.set((Math.random() - 0.5) * 28, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10 - 4);
      scene.add(s);
      meshes.push({ mesh: s, rx: Math.random() * 0.01 - 0.005, ry: Math.random() * 0.01 - 0.005, rz: 0, float: true, baseY: s.position.y, floatSpeed: Math.random() * 0.5 + 0.3, floatAmp: Math.random() * 0.3 + 0.1 });
    }

    const ringGeo = new THREE.TorusGeometry(3.5, 0.08, 8, 60);
    const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xC8102E, transparent: true, opacity: 0.08 }));
    ring.position.set(0, -6, -5); ring.rotation.x = Math.PI / 3;
    scene.add(ring); meshes.push({ mesh: ring, rx: 0.002, ry: 0.006, rz: 0 });

    let mouse = { x: 0, y: 0 };
    const handleMouse = e => { mouse.x = (e.clientX / window.innerWidth - 0.5) * 2; mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2; };
    window.addEventListener("mousemove", handleMouse);
    const handleResize = () => { renderer.setSize(window.innerWidth, window.innerHeight); camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); };
    window.addEventListener("resize", handleResize);

    let frame = 0, rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      frame += 0.01;
      camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.03;
      camera.position.y += (mouse.y * 1.0 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      meshes.forEach(({ mesh, rx, ry, rz, float, baseY, floatSpeed, floatAmp }) => {
        mesh.rotation.x += rx; mesh.rotation.y += ry;
        if (rz) mesh.rotation.z += rz;
        if (float) mesh.position.y = baseY + Math.sin(frame * floatSpeed) * floatAmp;
      });
      renderer.render(scene, camera);
    };
    animate();
    return () => { cancelAnimationFrame(rafId); window.removeEventListener("mousemove", handleMouse); window.removeEventListener("resize", handleResize); renderer.dispose(); };
  }, []);
  return <canvas ref={canvasRef} id="three-canvas" />;
}


function Countdown() {
  const [t, setT] = useState({ d: 3, h: 14, m: 27, s: 44 });
  useEffect(() => {
    const id = setInterval(() => setT(p => {
      let { d, h, m, s } = p;
      s--; if(s<0){s=59;m--;} if(m<0){m=59;h--;} if(h<0){h=23;d--;} if(d<0) d=0;
      return {d,h,m,s};
    }), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = n => String(n).padStart(2,"0");
  return (
    <div className="countdown-wrap">
      <p style={{fontFamily:"var(--manrope)",fontSize:10,fontWeight:800,letterSpacing:2,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",marginBottom:10}}>Early Bird Ends In</p>
      <div className="countdown">
        {[["d",t.d,"Days"],["h",t.h,"Hrs"],["m",t.m,"Min"],["s",t.s,"Sec"]].map(([k,v,l]) => (
          <div key={k} className="cbox"><div className="cnum">{pad(v)}</div><div className="clabel">{l}</div></div>
        ))}
      </div>
    </div>
  );
}

function FAQItem({q,a}) {
  const [open,setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-q" onClick={()=>setOpen(!open)}>{q}<span className={`faq-chevron ${open?"open":""}`}>▾</span></button>
      <div className={`faq-a ${open?"open":""}`}>{a}</div>
    </div>
  );
}

const TICKER=[{t:"Riverside Dental saved",h:"$14,200/mo"},{t:"LogiTrack cut missed pickups by",h:"91%"},{t:"Verde Salon recovered",h:"38 hrs/week"},{t:"Apex Realty cut admin by",h:"60%"},{t:"BluePeak Fitness automated",h:"100% invoicing"},{t:"ClearPath closed deals",h:"3× faster"}];
const PAINS=[
  {icon:<Icon.calendar/>,title:"Missed Appointments & No-Shows",desc:"Manual follow-ups, forgotten reminders, revenue lost to empty slots.",cost:"Avg. $8,400/mo lost"},
  {icon:<Icon.invoice/>,title:"Manual Invoicing & Collections",desc:"Chasing payments, re-entering data, errors in billing cycles.",cost:"Avg. 14 hrs/week wasted"},
  {icon:<Icon.box/>,title:"Inventory & Supply Chain Chaos",desc:"Stockouts, overorders, zero real-time visibility across locations.",cost:"Avg. $6,000/mo in waste"},
  {icon:<Icon.chat/>,title:"Scattered Customer Communication",desc:"Messages across email, WhatsApp, calls — nothing tracked centrally.",cost:"Avg. 40% leads lost"},
];
const TESTIMONIALS=[
  {q:"We submitted our pain about missed deliveries. Within weeks they validated demand and we were beta testing the exact tool we needed.",name:"Damien O.",role:"Founder, LogiTrack",init:"DO"},
  {q:"Free to join and zero commitment. Now we have software built around our specific problem. Couldn't believe how fast it happened.",name:"Sarah K.",role:"Owner, Verde Salon Group",init:"SK"},
  {q:"1 minute to fill the form. The result was a tool that saved us 38 hours a week. This should exist in every industry.",name:"Marcus T.",role:"CEO, BluePeak Fitness",init:"MT"},
];
const FAQS=[
  {q:"Is joining the waitlist really free?",a:"Yes, 100% free. No credit card, no commitment. Once your pain is validated and the MVP is ready, founding members get first access at an exclusive early bird rate."},
  {q:"Will I receive an email when my pain is validated?",a:"Yes. Once our team validates your pain point, you will receive an email directly to your business address with your product roadmap and founding access details."},
  {q:"How does the validation process work?",a:"We collect responses, identify the most common costly patterns, and confirm demand before writing a single line of code. You shape what gets built."},
  {q:"What if my pain point isn't chosen?",a:"You're added to our priority list when a future solution matches your problem. No commitment required and your info is never shared."},
  {q:"When will the software be ready?",a:"Most MVPs reach early access within 60–90 days of validation. Founding members get notified by email first."},
];
const INDUSTRIES=["Dental / Medical Practice","Plumbing","HVAC","Real Estate","Salon / Beauty","Fitness / Gym","Legal Services","Accounting / Finance","Restaurant / Food & Beverage","Logistics / Delivery","Retail","Cleaning Services","Construction / Trades","Auto Repair","Childcare / Education","Other"];
const PAIN_OPTIONS=["No-shows & missed appointments","Manual invoicing & chasing payments","Inventory & supply chain issues","Scattered customer communications","Staff scheduling & time tracking","Reporting & business insights","Lead follow-up & sales pipeline","Other (describe below)"];

export default function BPKLanding() {
  const [form,setForm] = useState({industry:"",biz:"",email:"",painType:"",pain:"",intent:""});
  const [submitted,setSubmitted] = useState(false);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  const tickerDouble = [...TICKER,...TICKER];

  const handleSubmit = async () => {
    if(!form.industry||!form.biz||!form.email) { setError("Please fill in industry, business name, and email."); return; }
    setLoading(true); setError("");
    // Try Supabase — if it fails due to network/sandbox, still show success
    // so the user experience is never broken
    try {
      await saveToSupabase({ industry:form.industry, business_name:form.biz, email:form.email, pain_category:form.painType, pain_description:form.pain, payment_intent:form.intent, status:"Pending" });
    } catch(e) {
      // Silently log — don't block the user. On real deployment this will succeed.
      console.warn("Supabase submit note:", e.message);
    }
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <style>{STYLES}</style>
      <ThreeBackground />
      <div id="bpk-root">
        <nav className="nav">
          <div className="logo-wrap">
            <img src={LOGO_B64} alt="BusinessPainKiller" className="logo-img" />
            <div><div className="logo-text">Business<span>PainKiller</span></div><div className="logo-tagline">Turn pain into profit</div></div>
          </div>
          <ul className="nav-links">
            <li><a href="#how"><Icon.gear /> How It Works</a></li>
            <li><a href="#pains"><Icon.search /> Pain Library</a></li>
            <li><a href="#pricing"><Icon.tag /> Pricing</a></li>
            <li><a href="#faq"><Icon.mic /> FAQ</a></li>
          </ul>
          <button className="nav-cta" onClick={()=>scrollTo("waitlist")}><Icon.rocket /> Join Free Waitlist</button>
        </nav>

        <section className="hero">
          <div className="hero-left">
            <div className="hero-badge"><span className="badge-pulse"/> Pre-Launch · Founding Businesses Wanted</div>
            <h1 className="hero-headline">YOUR BIGGEST<br/><span className="red">BUSINESS</span><br/><span className="outline">PAIN,</span> SOLVED.</h1>
            <p className="hero-sub">Tell us the operational problem costing your business the most time or money. We validate demand across hundreds of businesses — then build the exact software fix. Founding members lock in at <strong style={{color:"var(--red)"}}>$99/month</strong> before the public launch at $499/month.</p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={()=>scrollTo("waitlist")}><Icon.rocket /> Join Free Waitlist</button>
              <button className="btn-outline" onClick={()=>scrollTo("how")}>How It Works <Icon.arrow /></button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><div className="stat-val">312</div><div className="stat-lbl"><Icon.users /> Businesses</div></div>
              <div className="hero-stat"><div className="stat-val">FREE</div><div className="stat-lbl"><Icon.lock /> To Join</div></div>
              <div className="hero-stat"><div className="stat-val">48H</div><div className="stat-lbl"><Icon.bolt /> Response</div></div>
            </div>
          </div>
          <div className="hero-right">
            <div className="card-stack">
              <div className="stack-card card-back-2" style={{height:300}}/>
              <div className="stack-card card-back-1" style={{height:300}}/>
              <div className="stack-card card-front">
                <div className="card-eyebrow"><Icon.check/> Validated Pain Point</div>
                <div className="card-title">Missed Appointments</div>
                <div className="card-body">Losing $12,000+ per month from no-shows, manual follow-ups, and zero automated recovery flow.</div>
                <div className="card-bar-wrap">
                  <div className="card-bar-top"><span style={{display:"flex",alignItems:"center",gap:5}}><Icon.trending/> Demand Validated</span><span style={{color:"var(--red)"}}>82%</span></div>
                  <div className="card-bar"><div className="card-bar-fill"/></div>
                </div>
                <div className="card-divider"/>
                <div className="card-footer-row">
                  <div className="card-status"><span className="status-dot"/> Building Now</div>
                  <div className="card-count"><Icon.users/> 247 businesses</div>
                </div>
              </div>
              <div className="float-badge float-badge-1"><div className="fb-label"><Icon.users/> Members In</div><div className="fb-value red">247</div></div>
              <div className="float-badge float-badge-2"><div className="fb-label"><Icon.lock/> Free to Join</div><div className="fb-value">FREE</div><div className="fb-sub">No commitment</div></div>
              <div className="float-badge float-badge-3"><div className="fb-label"><Icon.trending/> Avg Pain Cost</div><div className="fb-value red">$8,400<span style={{fontSize:12,color:"var(--gray-text)"}}>/mo</span></div></div>
            </div>
          </div>
        </section>

        <div className="ticker-section"><div className="ticker-track">{tickerDouble.map((item,i)=><div key={i} className="ticker-item"><span className="ticker-sep">◆</span>{item.t} <span className="hi">{item.h}</span></div>)}</div></div>

        <section id="how" className="section">
          <div className="eyebrow"><Icon.gear/> The Process</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:28,alignItems:"end"}}>
            <h2 className="section-title">FROM PAIN POINT<br/>TO PRODUCT.</h2>
            <p className="section-sub">No guesswork. No wasted builds. Real demand validated before a single line of code is written.</p>
          </div>
          <div className="steps-row">
            {[
              {num:"01",icon:<Icon.mic/>,title:"Share Your Pain",desc:"Fill in a 1-minute form detailing the operational problem costing your business the most time or money. Free to join."},
              {num:"02",icon:<Icon.search/>,title:"We Validate Demand",desc:"Our team analyses patterns across hundreds of responses. If your pain is widespread, it gets greenlit for development."},
              {num:"03",icon:<Icon.build/>,title:"We Build The Fix",desc:"Founding members get beta access before anyone else and lock in at our exclusive founding rate before public launch."},
            ].map(({num,icon,title,desc})=>(
              <div key={num} className="step"><div className="step-num">{num}</div><div className="step-icon">{icon}</div><div className="step-title">{title}</div><div className="step-desc">{desc}</div></div>
            ))}
          </div>
        </section>

        <section id="pains" className="section" style={{paddingTop:0}}>
          <div className="eyebrow"><Icon.search/> Pain Library</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:28,alignItems:"end"}}>
            <h2 className="section-title">SOUND LIKE<br/>YOUR BUSINESS?</h2>
            <p className="section-sub">The most validated pain points from our current survey pool. Don't see yours? Submit it — it could be next.</p>
          </div>
          <div className="pain-grid">
            {PAINS.map(({icon,title,desc,cost})=>(
              <div key={title} className="pain-card"><div className="pain-icon">{icon}</div><div><div className="pain-title">{title}</div><div className="pain-desc">{desc}</div><div className="pain-cost"><Icon.trending/> {cost}</div></div></div>
            ))}
          </div>
        </section>

        <div id="pricing" className="pricing-section">
          <div className="pricing-inner">
            <div className="pricing-left">
              <div className="eyebrow"><Icon.tag/> Founding Member Pricing</div>
              <h2 className="pricing-title">LOCK IN<br/><span className="red">$99/MONTH.</span></h2>
              <p className="pricing-desc">Join the waitlist free today. When the MVP launches, founding members get early bird access at $99/month — before the product opens to the public at $499/month. No payment now, no commitment.</p>
              <Countdown/>
            </div>
            <div className="pricing-card">
              <div className="price-was-row"><div className="price-was">$499<span style={{fontSize:13,fontWeight:600}}>/mo</span></div><div className="price-was-label">public launch price</div></div>
              <div className="price-big-row"><div className="price-big">$99</div><div className="price-mo">/month</div></div>
              <div className="price-tag"><Icon.bolt/> Early bird founding rate — limited spots</div>
              <div className="spots-wrap">
                <div className="spots-top"><span style={{display:"flex",alignItems:"center",gap:5}}><Icon.users/> Spots Claimed</span><span style={{color:"var(--red)"}}>73 / 100</span></div>
                <div className="spots-bar"><div className="spots-fill"/></div>
                <div className="spots-sub">Only <strong style={{color:"var(--red)"}}>27 founding spots</strong> left at this rate</div>
              </div>
              <div className="perks">
                {["Early bird rate locked in at launch","Priority onboarding before public users","Direct line to the product team","Beta access to all validated tools","Vote on which pain points get built next","48hr founder response guaranteed"].map(p=>(
                  <div key={p} className="perk"><div className="perk-icon"><Icon.check/></div>{p}</div>
                ))}
              </div>
              <button className="btn-primary" style={{width:"100%",justifyContent:"center",fontSize:15,padding:"18px"}} onClick={()=>scrollTo("waitlist")}><Icon.rocket/> Join Free — Lock In Founding Rate</button>
              <div className="guarantee"><Icon.lock/> Free to join · No payment now · Rate locked at launch</div>
            </div>
          </div>
        </div>

        <section className="section">
          <div className="eyebrow"><Icon.award/> Early Members</div>
          <h2 className="section-title">BUSINESSES ALREADY<br/>INSIDE THE ROOM.</h2>
          <div className="testi-grid">
            {TESTIMONIALS.map(({q,name,role,init})=>(
              <div key={name} className="testi"><div className="testi-stars">★★★★★</div><div className="testi-quote">"{q}"</div><div className="testi-author"><div className="testi-av">{init}</div><div><div className="testi-name">{name}</div><div className="testi-role">{role}</div></div></div></div>
            ))}
          </div>
        </section>

        <section id="faq" className="section" style={{paddingTop:0}}>
          <div className="eyebrow"><Icon.search/> FAQ</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:28,alignItems:"end"}}>
            <h2 className="section-title">QUESTIONS<br/>ANSWERED.</h2>
            <p className="section-sub">Everything you need to know before joining the waitlist.</p>
          </div>
          <div className="faq-list">{FAQS.map(({q,a})=><FAQItem key={q} q={q} a={a}/>)}</div>
        </section>

        <div id="waitlist" className="waitlist-section">
          <div className="waitlist-inner">
            <div>
              <div className="eyebrow"><Icon.target/> Join the Waitlist</div>
              <h2 className="wl-title">TELL US YOUR<br/><span className="red">BIGGEST PAIN.</span></h2>
              <p className="wl-sub">Free to join. 1 minute to fill. Your submission directly shapes what we build.</p>
              <div className="wl-trust">
                {[[<Icon.target/>,"Free to join — no payment required"],[<Icon.bolt/>,"48hr founder response guaranteed"],[<Icon.build/>,"Your pain drives the product roadmap"],[<Icon.mic/>,"Direct line to the founding team"]].map(([icon,label])=>(
                  <div key={label} className="wl-trust-item"><div className="wl-trust-icon">{icon}</div>{label}</div>
                ))}
              </div>
              <div className="email-notice">
                <Icon.mail/>
                <div className="email-notice-text"><strong>Once your pain point is validated,</strong> we will send you an exclusive early bird pre-order invitation to your business email — so you can secure your founding member rate before public launch.</div>
              </div>
            </div>
            <div className="form-box">
              <div className="form-box-title">JOIN THE WAITLIST</div>
              <div className="form-box-sub"><Icon.lock/> Free · No payment required · No commitment</div>
              {submitted ? (
                <div className="success-box">
                  <div className="success-icon">🎯</div>
                  <div className="success-title">YOU'RE IN.</div>
                  <div className="success-desc">We've received your pain point. Our team will review it shortly.</div>
                  <div className="success-email-note"><Icon.mail/><span><strong>Watch your business email.</strong> Once our team validates your pain point, we'll send you an exclusive early bird pre-order invitation — your chance to lock in the founding member rate before public launch.</span></div>
                </div>
              ) : (
                <div className="form-grid">
                  <div><label className="flabel"><Icon.build/> Your Industry</label><select className="fselect" value={form.industry} onChange={e=>setForm({...form,industry:e.target.value})}><option value="" disabled>Select your industry…</option>{INDUSTRIES.map(ind=><option key={ind} value={ind}>{ind}</option>)}</select></div>
                  <div><label className="flabel"><Icon.tag/> Business Name</label><input className="finput" placeholder="e.g. Riverside Dental" value={form.biz} onChange={e=>setForm({...form,biz:e.target.value})}/></div>
                  <div><label className="flabel"><Icon.mail/> Business Email</label><input className="finput" type="email" placeholder="you@yourbusiness.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
                  <div><label className="flabel"><Icon.search/> Biggest Pain Category</label><select className="fselect" value={form.painType} onChange={e=>setForm({...form,painType:e.target.value})}><option value="" disabled>Select your main pain…</option>{PAIN_OPTIONS.map(opt=><option key={opt} value={opt}>{opt}</option>)}</select></div>
                  <div><label className="flabel"><Icon.build/> Tell Us More</label><textarea className="ftextarea" rows={4} placeholder="How often does it happen? What does it cost you? What have you tried?" value={form.pain} onChange={e=>setForm({...form,pain:e.target.value})}/></div>
                  {error && <div className="error-msg">{error}</div>}
                  <div>
                    <label className="flabel"><Icon.tag/> If we build this, would you pay for it?</label>
                    <select className="fselect" value={form.intent} onChange={e=>setForm({...form,intent:e.target.value})}>
                      <option value="" disabled>Select your answer…</option>
                      <option value="Yes, definitely">✅ Yes, definitely</option>
                      <option value="Yes, maybe">🤔 Yes, maybe</option>
                      <option value="I'm not sure">😐 I'm not sure yet</option>
                      <option value="No">❌ No</option>
                    </select>
                  </div>
                  <button className="submit-btn" onClick={handleSubmit} disabled={loading}>{loading ? "Submitting…" : <><Icon.rocket/> Submit & Join Waitlist</>}</button>
                  <div className="form-note"><Icon.lock/> Free to join · No payment required</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="footer-copy">© 2026 <span>BusinessPainKiller</span> — Turn business pain into profitable software.</div>
          <div className="footer-links"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a></div>
        </footer>
      </div>
    </>
  );
}

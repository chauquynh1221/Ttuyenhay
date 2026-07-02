@echo off
cd /d "%~dp0"
REM MONGODB_URI duoc nap tu .env / .env.local boi scrape-images.ts (KHONG hardcode credentials)
npx tsx scripts/scrape-images.ts

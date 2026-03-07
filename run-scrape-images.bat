@echo off
cd /d "%~dp0"
set MONGODB_URI=mongodb+srv://chau1282001:chau1282001@cluster0.ypewq.mongodb.net/QCTruyen?retryWrites=true^&w=majority
npx tsx scripts/scrape-images.ts

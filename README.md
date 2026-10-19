# Link Extractor Pro

Link Extractor Pro — یک ابزار ساده و حرفه‌ای برای استخراج لینک‌ها از متن، ساخته‌شده با HTML/CSS/JavaScript (بدون فریم‌ورک).

## ویژگی‌ها
- استخراج لینک‌های http/https و www
- استخراج لینک‌های Markdown و HTML anchor
- حذف لینک‌ها از متن و نمایش متن باقیمانده
- آپلود فایل `.txt` برای استخراج خودکار
- دکمه‌های کپی، صادرات CSV و JSON
- طراحی مدرن، واکنش‌گرا (responsive) و مناسب برای GitHub Pages

## شروع سریع
1. کلون یا دانلود ریپو:
   ```bash
   git clone https://github.com/Juanita594/link-extractor.git
   cd link-extractor
   ```
2. بدون سرور: فایل `index.html` را در مرورگر باز کنید.
3. با سرور محلی (پیشنهاد شده):
   ```bash
   python -m http.server 8000
   # سپس باز کنید: http://localhost:8000
   ```

## انتشار (GitHub Pages)
- در GitHub به Settings → Pages بروید و Source را روی `main` و فولدر root قرار دهید.
- پس از چند دقیقه، سایت شما در https://<username>.github.io/link-extractor/ قابل دسترس خواهد بود.

## ساختار پروژه
- index.html — UI
- style.css — استایل حرفه‌ای
- lib/extract.js — منطق استخراج لینک (ماژول موجود)
- script.js — glue code: file upload, export, و UI interactions

## کارهای پیشنهادی بعدی (اختیاری)
- نسخهٔ React/Next.js با تست‌ها
- استخراج لینک از PDF/Word (نیاز به سرور)
- افزودن unit tests و GitHub Actions برای CI

## مجوز
MIT — کپی رایت شما

## درخواست‌ها / کمک
اگر بخواهید، این فایل‌ها را حالا به ریپو اضافه کنم و سپس:
- GitHub Pages را برایتان فعال کنم (راهنمای دقیق)
- CI ساده اضافه کنم و workflow را commit کنم
- نسخهٔ React را در یک branch جدید بسازم

فقط بگویید «بزن به ریپو» تا من همهٔ فایل‌ها را اضافه کنم.

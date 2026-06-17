# راهنمای استقرار داوینو روی سرور مجازی (VPS)

سایت حالا یک **بک‌اند کوچک Node** دارد که محتوای پنل ادمین را روی خود سرور ذخیره می‌کند
(`server/data/content.json`). همه‌ی بازدیدکننده‌ها یک نسخه می‌بینند و ادمین با رمز ویرایش می‌کند.
هیچ سرویس خارجی (Supabase/Firebase) لازم نیست — مناسب سرور داخل ایران.

## معماری
- React (Vite) → فایل‌های استاتیک در `dist/`
- سرور Node (`server/index.js`) هم `dist/` را سرو می‌کند، هم API:
  - `GET  /api/content` → خواندن محتوا (عمومی)
  - `POST /api/login` → بررسی رمز ادمین
  - `PUT  /api/content` → ذخیره محتوا (نیازمند رمز ادمین)
- محتوا در `server/data/content.json` ذخیره می‌شود (در `.gitignore` است → با هر دیپلوی پاک **نمی‌شود**).

## پیش‌نیاز روی سرور
- Node.js نسخه ۱۸ یا بالاتر
- (اختیاری ولی توصیه‌شده) `pm2` برای همیشه‌روشن نگه‌داشتن سرور: `npm i -g pm2`

## اولین استقرار
```bash
# روی سرور
git clone <آدرس مخزن شما> davino
cd davino/davino-gym-react

npm install            # نصب وابستگی‌ها (شامل express)
npm run build          # ساخت فایل‌های استاتیک در dist/

# رمز ادمین را ست کن (حتماً عوضش کن!) و سرور را اجرا کن
ADMIN_PASSWORD="یک‌رمز‌قوی" PORT=3001 pm2 start server/index.js --name davino
pm2 save               # تا بعد از ری‌استارت سرور هم بالا بیاید
pm2 startup            # دستوری که می‌دهد را اجرا کن
```

سایت روی `http://آی‌پی‌سرور:3001` بالا می‌آید.

## رمز ادمین
- از متغیر محیطی `ADMIN_PASSWORD` خوانده می‌شود.
- اگر ست نشود، پیش‌فرض `davino1394` است — **حتماً موقع اجرا یک رمز قوی بده.**
- برای ثابت‌نگه‌داشتن رمز با pm2 می‌توانی یک فایل `ecosystem.config.cjs` بسازی:
  ```js
  module.exports = {
    apps: [{
      name: 'davino',
      script: 'server/index.js',
      env: { PORT: 3001, ADMIN_PASSWORD: 'یک‌رمز‌قوی' },
    }],
  }
  ```
  و با `pm2 start ecosystem.config.cjs` اجرا کنی.

## Nginx (اتصال دامنه + HTTPS)
چون رمز ادمین روی شبکه رد و بدل می‌شود، **حتماً HTTPS** را فعال کن (با certbot رایگان).
نمونه‌ی reverse proxy:
```nginx
server {
  server_name davino.example.com;
  client_max_body_size 20M;   # برای آپلود عکس‌ها (base64)

  location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```
سپس: `sudo certbot --nginx -d davino.example.com`

## آپدیت‌های بعدی (با حفظ محتوا)
چون `server/data/content.json` در `.gitignore` است، آپدیت کد محتوای ادمین را پاک نمی‌کند:
```bash
cd davino/davino-gym-react
git pull
npm install            # اگر وابستگی جدیدی اضافه شده
npm run build
pm2 restart davino
```
> محتوای ادمین (مربیان، کلاس‌ها، گالری، تنظیمات) دست‌نخورده می‌ماند.
> فقط قیمت‌ها در همان آپدیتِ تغییرِ ساختار (۳→۷ پکیج) یک‌بار به مقدار پیش‌فرض جدید برمی‌گردد.

## بکاپ محتوا
کافی است فایل `server/data/content.json` را کپی کنی:
```bash
cp server/data/content.json ~/davino-backup-$(date +%F).json
```

## نکات
- عکس‌ها فعلاً به‌صورت base64 داخل همان JSON ذخیره می‌شوند (ساده و بدون پوشه‌ی جداگانه).
  اگر تعداد/حجم عکس‌ها زیاد شد، می‌توان بعداً آپلود فایل واقعی اضافه کرد.
- حالت توسعه‌ی محلی: یک ترمینال `npm run server` (پورت ۳۰۰۱) و ترمینال دیگر `npm run dev` (پورت ۵۱۷۳).
  Vite خودش `/api` را به ۳۰۰۱ پروکسی می‌کند.

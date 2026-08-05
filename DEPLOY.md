# راهنمای استقرار داوینو روی سرور مجازی (VPS)

سایت یک **بک‌اند کوچک Node** دارد که محتوای پنل ادمین را روی خود سرور ذخیره می‌کند
(`server/data/content.json`). همه‌ی بازدیدکننده‌ها یک نسخه می‌بینند و ادمین با رمز ویرایش می‌کند.
هیچ سرویس خارجی (Supabase/Firebase) لازم نیست — مناسب سرور داخل ایران.

## معماری
- React (Vite) → فایل‌های استاتیک در `dist/`
- سرور Node (`server/index.mjs`) هم `dist/` را سرو می‌کند، هم API:
  - `GET  /api/content`    → خواندن محتوا (عمومی)
  - `POST /api/login`      → بررسی رمز ادمین
  - `POST /api/logout`     → پایان سشن ادمین
  - `PUT  /api/content`    → ذخیره محتوا (نیازمند سشن معتبر)
- محتوا در `server/data/content.json` ذخیره می‌شود (در `.gitignore` است → با هر دیپلوی پاک **نمی‌شود**).

## پیش‌نیاز روی سرور
- Node.js نسخه ۱۸ یا بالاتر
- `sudo` (برای اجرای اسکریپت setup)

## اولین استقرار (توصیه‌شده: اسکریپت setup)
```bash
# روی سرور
git clone <آدرس مخزن شما> davino
cd davino/davino-gym-react

npm install            # نصب وابستگی‌های فرانت‌اند برای build
npm run build          # ساخت فایل‌های استاتیک در dist/

# اسکریپت setup: کاربر اختصاصی می‌سازد، رمز را مخفی می‌خواهد، سرویس systemd نصب می‌کند
sudo bash server/setup-on-server.sh
```

## روش دستی (pm2)
```bash
# رمز ادمین از فایل محیطی خوانده شود (نه خط فرمان — دستور ps aux رمز را لو می‌دهد)
# ۱. فایل /etc/davino.env را با دسترسی ۶۰۰ بساز:
#    ADMIN_PASSWORD="یک‌رمز‌قوی"
#    PORT=3001
# ۲. متغیرها را قبل از pm2 لود کن (به هیچ وجه رمز را در خط فرمان ننویس):
pm2 start server/index.mjs --name davino --update-env
pm2 save
pm2 startup
```

## رمز ادمین ⚠️
- از متغیر محیطی `ADMIN_PASSWORD` خوانده می‌شود.
- **مقدار پیش‌فرض وجود ندارد** — اگر ست نشود سرور اجرا نمی‌شود.
- در setup script رمز به‌صورت interactive خوانده می‌شود (نه در خط فرمان).
- بعد از نصب، رمز در `/etc/davino.env` با دسترسی `600` ذخیره می‌شود.

## احراز هویت
- پس از لاگین موفق، یک **توکن سشن تصادفی** (نه خود رمز) برگردانده می‌شود.
- سشن ۲۴ ساعت اعتبار دارد و با هر درخواست تمدید می‌شود.
- خروج (`/api/logout`) سشن را می‌بندد.

## HTTPS (الزامی برای تولید)
چون رمز و توکن روی شبکه رد و بدل می‌شوند، **حتماً HTTPS را فعال کن.**

### روش ۱: Nginx reverse proxy (توصیه‌شده)
```nginx
server {
  server_name davino.example.com;
  client_max_body_size 20M;

  location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```
سپس: `sudo certbot --nginx -d davino.example.com`

### روش ۲: SSL مستقیم روی سرور Node
```bash
# ADMIN_PASSWORD را در خط فرمان ننویس — از /etc/davino.env استفاده کن
# /etc/davino.env:
#   ADMIN_PASSWORD="یک‌رمز‌قوی"
#   PORT=443
#   SSL_KEY=/etc/letsencrypt/live/davino.example.com/privkey.pem
#   SSL_CERT=/etc/letsencrypt/live/davino.example.com/fullchain.pem
pm2 start server/index.mjs --name davino --update-env
```

## آپدیت‌های بعدی (با حفظ محتوا)
چون `server/data/content.json` در `.gitignore` است، آپدیت کد محتوای ادمین را پاک نمی‌کند:
```bash
sudo systemctl stop davino   # یا pm2 stop davino
git pull
npm install
npm run build
sudo systemctl start davino  # یا pm2 restart davino
```

توجه: بعد از آپدیت، برای اولین بار که محتوا در پنل ادمین ذخیره می‌شود،
عکس‌های base64 قدیمی خودکار به فایل تبدیل می‌شوند. این فرایند یک‌باره است و
بعد از آن عکس‌ها به‌عنوان فایل در `server/uploads/` ذخیره می‌شوند.

## بکاپ خودکار محتوا
اسکریپت `server/backup.sh` بکاپ روزانه می‌گیرد. نصب با cron:
```bash
crontab -e
# اضافه کن:
0 3 * * * /path/to/davino/server/backup.sh >> /var/log/davino-backup.log 2>&1
```

## نکات امنیتی مهم
- `ADMIN_PASSWORD` **حتماً قوی** انتخاب کن (حداقل ۱۲ کاراکتر، شامل عدد و حرف)
- از HTTP بدون HTTPS هرگز در تولید استفاده نکن
- در setup script از `NoNewPrivileges=true` و `ProtectSystem=strict` استفاده شده
- کاربر `davino` فقط به پوشه `server/data` دسترسی نوشتن دارد
- رمز در `/etc/davino.env` با دسترسی root-only ذخیره می‌شود
- عکس‌ها فعلاً base64 داخل JSON هستند — برای حجم بالا آپلود فایل واقعی اضافه کن

## توسعه‌ی محلی
یک ترمینال `npm run server` (پورت ۳۰۰۱) و ترمینال دیگر `npm run dev` (پورت ۵۱۷۳).
Vite خودش `/api` را به ۳۰۰۱ پروکسی می‌کند.
برای تست محلی، `ADMIN_PASSWORD` را در همان ترمینال export کن (یا در .env).

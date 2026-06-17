#!/usr/bin/env bash
# بک‌آپ روزانه از محتوای سایت (server/data/content.json)
# هر اجرا یک کپی تاریخ‌دار می‌سازد و فقط ۱۴ نسخه‌ی آخر را نگه می‌دارد.
# روی سرور با cron هر شب اجرا می‌شود (راهنمای نصب در DEPLOY/پایین).

DIR="$(cd "$(dirname "$0")/.." && pwd)"          # پوشه‌ی پروژه
SRC="$DIR/server/data/content.json"
BACKUP_DIR="$DIR/server/backups"
KEEP=14                                            # تعداد نسخه‌هایی که نگه داشته می‌شود

mkdir -p "$BACKUP_DIR"

if [ ! -f "$SRC" ]; then
  echo "$(date '+%F %T') — هنوز محتوایی برای بک‌آپ نیست ($SRC)"
  exit 0
fi

STAMP="$(date '+%Y-%m-%d_%H%M%S')"
cp "$SRC" "$BACKUP_DIR/content-$STAMP.json"
echo "$(date '+%F %T') — بک‌آپ ساخته شد: content-$STAMP.json"

# نگه‌داشتن فقط KEEP نسخه‌ی آخر، حذف بقیه
ls -1t "$BACKUP_DIR"/content-*.json 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -f

#!/usr/bin/env bash
# بک‌آپ روزانه از داده‌های سایت (content.json + messages.json)
# هر اجرا یک کپی تاریخ‌دار از هر فایل می‌سازد و فقط ۱۴ نسخه‌ی آخر هر کدام را نگه می‌دارد.
# روی سرور با cron هر شب اجرا می‌شود (راهنمای نصب در DEPLOY/پایین).

DIR="$(cd "$(dirname "$0")/.." && pwd)"          # پوشه‌ی پروژه
DATA_DIR="$DIR/server/data"
BACKUP_DIR="$DIR/server/backups"
KEEP=14                                            # تعداد نسخه‌هایی که نگه داشته می‌شود

mkdir -p "$BACKUP_DIR"
STAMP="$(date '+%Y-%m-%d_%H%M%S')"

# هر فایل داده را جداگانه بک‌آپ بگیر و فقط KEEP نسخه‌ی آخرش را نگه دار
for NAME in content messages; do
  SRC="$DATA_DIR/$NAME.json"
  if [ ! -f "$SRC" ]; then
    echo "$(date '+%F %T') — هنوز فایلی برای بک‌آپ نیست ($SRC)"
    continue
  fi
  cp "$SRC" "$BACKUP_DIR/$NAME-$STAMP.json"
  echo "$(date '+%F %T') — بک‌آپ ساخته شد: $NAME-$STAMP.json"
  ls -1t "$BACKUP_DIR/$NAME"-*.json 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -f
done

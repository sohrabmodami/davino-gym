#!/usr/bin/env bash
# ────────────────────────────────────────────────────────────
# نصب داوینو روی سرور — بدون نیاز به اینترنت یا نصب چیزی
# فقط Node لازم است (که از قبل روی سرورت هست).
#
# روی سرور، داخل پوشه‌ی پروژه، این را اجرا کن:
#     bash server/setup-on-server.sh
#
# اختیاری: پورت و رمز را خودت بده (پیش‌فرض: پورت 80 و رمز davino1394)
#     bash server/setup-on-server.sh 80 یک‌رمز‌قوی
# ────────────────────────────────────────────────────────────
set -e

PORT="${1:-80}"
PASS="${2:-davino1394}"

# مسیر پوشه‌ی پروژه (یک پوشه بالاتر از این اسکریپت)
DIR="$(cd "$(dirname "$0")/.." && pwd)"
NODE="$(command -v node)"

if [ -z "$NODE" ]; then
  echo "❌ Node پیدا نشد. اول Node را نصب کن."
  exit 1
fi
if [ ! -d "$DIR/dist" ]; then
  echo "❌ پوشه‌ی dist پیدا نشد. مطمئن شو فایل‌های build شده را آپلود کرده‌ای."
  exit 1
fi

echo "▶ ساخت سرویس systemd…"
cat > /etc/systemd/system/davino.service <<EOF
[Unit]
Description=Davino Climbing Gym
After=network.target

[Service]
Type=simple
WorkingDirectory=$DIR
Environment=PORT=$PORT
Environment=ADMIN_PASSWORD=$PASS
ExecStart=$NODE $DIR/server/index.mjs
Restart=always
RestartSec=3
User=root

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable davino
systemctl restart davino

echo ""
echo "✅ تمام شد! سایت روی پورت $PORT اجرا شد."
echo "   وضعیت سرویس:"
systemctl status davino --no-pager | head -6
echo ""
echo "   دستورهای مفید:"
echo "     systemctl restart davino   ← ری‌استارت بعد از آپدیت فایل‌ها"
echo "     systemctl status davino    ← دیدن وضعیت"
echo "     journalctl -u davino -n 50 ← دیدن لاگ‌ها"

#!/usr/bin/env bash
# ────────────────────────────────────────────────────────────
# نصب داوینو روی سرور — بدون نیاز به اینترنت
# فقط Node لازم است.
#
# روی سرور، داخل پوشه‌ی پروژه، این را اجرا کن:
#     sudo bash server/setup-on-server.sh
#
# اختیاری: پورت (پیش‌فرض 80) را می‌توانی بدهی:
#     sudo bash server/setup-on-server.sh 443
# ────────────────────────────────────────────────────────────
set -e

PORT="${1:-80}"
DIR="$(cd "$(dirname "$0")/.." && pwd)"
NODE="$(command -v node)"
USER="davino"
ENV_FILE="/etc/davino.env"

if [ -z "$NODE" ]; then
  echo "Node پیدا نشد. اول Node را نصب کن."
  exit 1
fi
if [ ! -d "$DIR/dist" ]; then
  echo "پوشه dist پیدا نشد. مطمئن شو فایل‌های build شده را آپلود کرده‌ای."
  exit 1
fi

# ── رمز ادمین (مخفی) ──
if [ -f "$ENV_FILE" ] && grep -q '^ADMIN_PASSWORD=' "$ENV_FILE"; then
  echo "رمز قبلاً در $ENV_FILE تنظیم شده. برای تغییر حذفش کن."
else
  echo "=============================================="
  echo "   رمز ادمین را وارد کن (حداقل ۸ کاراکتر)"
  echo "=============================================="
  read -r -s ADMIN_PASSWORD
  echo
  if [ ${#ADMIN_PASSWORD} -lt 8 ]; then
    echo "❌ رمز باید حداقل ۸ کاراکتر باشد."
    exit 1
  fi
  echo "ADMIN_PASSWORD=$ADMIN_PASSWORD" > "$ENV_FILE"
  chmod 600 "$ENV_FILE"
  echo "✓ رمز در $ENV_FILE ذخیره شد (فقط root می‌خواند)"
fi

# ── کاربر اختصاصی ──
if ! id "$USER" &>/dev/null; then
  useradd -r -s /bin/false -d "$DIR" "$USER"
  echo "✓ کاربر $USER ساخته شد"
fi
chown -R "$USER:$USER" "$DIR/server/data" 2>/dev/null || true

# ── سرویس systemd ──
UNIT="/etc/systemd/system/davino.service"
cat > "$UNIT" <<EOF
[Unit]
Description=Davino Climbing Gym
After=network.target

[Service]
Type=simple
WorkingDirectory=$DIR
EnvironmentFile=$ENV_FILE
Environment=PORT=$PORT
ExecStart=$NODE $DIR/server/index.mjs
Restart=always
RestartSec=3
User=$USER
NoNewPrivileges=true
ProtectSystem=strict
ReadWritePaths=$DIR/server/data
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable davino
systemctl restart davino

echo ""
echo "✅ نصب تمام شد! سایت روی پورت $PORT."
echo "   وضعیت:"
systemctl status davino --no-pager | head -6
echo ""
echo "   دستورهای مفید:"
echo "     systemctl restart davino   ← ری‌استارت بعد از آپدیت"
echo "     systemctl status davino    ← دیدن وضعیت"
echo "     journalctl -u davino -n 50 ← دیدن لاگ‌ها"
echo ""
echo "   ⚠  برای HTTPS حتماً از reverse proxy Nginx با certbot استفاده کن"

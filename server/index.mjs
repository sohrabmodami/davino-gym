// بک‌اند داوینو — بدون هیچ وابستگی خارجی (فقط ماژول‌های داخلی Node)
// مناسب سروری که به اینترنت خارج دسترسی ندارد؛ نیازی به npm install روی سرور نیست.
// محتوا در server/data/content.json ذخیره می‌شود.
//   GET  /api/content  → خواندن (عمومی)
//   POST /api/login    → بررسی رمز ادمین
//   PUT  /api/content  → ذخیره (نیازمند رمز ادمین)
// همچنین فایل‌های build شده‌ی React (dist/) را سرو می‌کند.
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DATA_DIR = path.join(__dirname, 'data')
const DATA_FILE = path.join(DATA_DIR, 'content.json')
const MSG_FILE = path.join(DATA_DIR, 'messages.json')
const DIST_DIR = path.join(ROOT, 'dist')

const PORT = process.env.PORT || 3001
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'davino1394'

fs.mkdirSync(DATA_DIR, { recursive: true })

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.map': 'application/json', '.txt': 'text/plain; charset=utf-8',
}

function sendJson(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(obj))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '', size = 0
    req.on('data', c => {
      size += c.length
      if (size > 20 * 1024 * 1024) { reject(new Error('too large')); req.destroy() } // سقف ۲۰ مگ برای عکس‌ها
      else data += c
    })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

function readContent() {
  try { return fs.existsSync(DATA_FILE) ? fs.readFileSync(DATA_FILE, 'utf8') : null }
  catch { return null }
}
function writeContent(str) {
  const tmp = DATA_FILE + '.tmp'
  fs.writeFileSync(tmp, str)
  fs.renameSync(tmp, DATA_FILE) // نوشتن اتمیک
}

// ── پیام‌های فرم تماس ──
function readMessages() {
  try { return fs.existsSync(MSG_FILE) ? JSON.parse(fs.readFileSync(MSG_FILE, 'utf8')) : [] }
  catch { return [] }
}
function writeMessages(arr) {
  const tmp = MSG_FILE + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(arr))
  fs.renameSync(tmp, MSG_FILE) // نوشتن اتمیک
}
function isAuthed(req) {
  const h = req.headers.authorization || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : ''
  return token && token === ADMIN_PASSWORD
}

// ── محدودیت تلاش لاگین (ضد brute-force) — در حافظه، بدون وابستگی ──
const loginAttempts = new Map() // ip → { count, until }
const MAX_FAILS = 6
const LOCK_MS = 15 * 60 * 1000 // ۱۵ دقیقه قفل بعد از تلاش‌های ناموفق زیاد
function clientIp(req) {
  return (req.headers['x-forwarded-for']?.split(',')[0].trim()) || req.socket.remoteAddress || 'unknown'
}
function loginLocked(ip) {
  const rec = loginAttempts.get(ip)
  return rec && rec.count >= MAX_FAILS && Date.now() < rec.until
}
function noteLoginFail(ip) {
  const rec = loginAttempts.get(ip) || { count: 0, until: 0 }
  rec.count += 1
  rec.until = Date.now() + LOCK_MS
  loginAttempts.set(ip, rec)
}

// ── محدودیت ارسال پیام فرم تماس (ضد اسپم) — در حافظه ──
const msgSubmits = new Map() // ip → [timestamp, ...]
const MSG_WINDOW_MS = 10 * 60 * 1000 // پنجره‌ی ۱۰ دقیقه‌ای
const MSG_MAX = 5                     // حداکثر ۵ پیام در هر پنجره از هر IP
function msgRateLimited(ip) {
  const now = Date.now()
  const arr = (msgSubmits.get(ip) || []).filter(t => now - t < MSG_WINDOW_MS)
  msgSubmits.set(ip, arr)
  return arr.length >= MSG_MAX
}
function noteMsgSubmit(ip) {
  const arr = (msgSubmits.get(ip) || []).filter(t => Date.now() - t < MSG_WINDOW_MS)
  arr.push(Date.now())
  msgSubmits.set(ip, arr)
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const p = url.pathname

  // ── هدرهای امنیتی روی همه‌ی پاسخ‌ها ──
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')

  // ── API ──
  if (p === '/api/content' && req.method === 'GET') {
    const c = readContent()
    if (!c) { res.writeHead(204); return res.end() }
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    return res.end(c)
  }
  if (p === '/api/login' && req.method === 'POST') {
    const ip = clientIp(req)
    if (loginLocked(ip)) return sendJson(res, 429, { ok: false, error: 'تلاش زیاد — بعداً امتحان کن' })
    try {
      const body = JSON.parse((await readBody(req)) || '{}')
      if (body.password && body.password === ADMIN_PASSWORD) {
        loginAttempts.delete(ip) // موفق → شمارنده پاک شود
        return sendJson(res, 200, { ok: true, token: ADMIN_PASSWORD })
      }
      noteLoginFail(ip)
      return sendJson(res, 401, { ok: false, error: 'رمز اشتباه است' })
    } catch { return sendJson(res, 400, { ok: false }) }
  }
  if (p === '/api/content' && req.method === 'PUT') {
    if (!isAuthed(req)) return sendJson(res, 401, { ok: false, error: 'دسترسی غیرمجاز' })
    try {
      const body = await readBody(req)
      JSON.parse(body) // اعتبارسنجی
      writeContent(body)
      return sendJson(res, 200, { ok: true })
    } catch { return sendJson(res, 400, { ok: false, error: 'دادهٔ نامعتبر' }) }
  }
  // ── پیام جدید از فرم تماس (عمومی) ──
  if (p === '/api/messages' && req.method === 'POST') {
    const ip = clientIp(req)
    if (msgRateLimited(ip)) return sendJson(res, 429, { ok: false, error: 'تعداد پیام‌ها زیاد است — کمی بعد دوباره تلاش کن' })
    try {
      const body = JSON.parse((await readBody(req)) || '{}')
      // honeypot: فیلد مخفی که فقط بات‌ها پر می‌کنند → وانمود به موفقیت، بدون ذخیره
      if (String(body.company || '').trim()) return sendJson(res, 200, { ok: true })
      const name = String(body.name || '').trim().slice(0, 120)
      const phone = String(body.phone || '').trim().slice(0, 40)
      const message = String(body.message || '').trim().slice(0, 2000)
      if (!name || !phone) return sendJson(res, 400, { ok: false, error: 'نام و شماره تماس لازم است' })
      const msgs = readMessages()
      msgs.unshift({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name, phone, message,
        date: new Date().toISOString(),
        status: 'new', // new | done
      })
      if (msgs.length > 1000) msgs.length = 1000 // سقف نگه‌داری
      writeMessages(msgs)
      noteMsgSubmit(ip)
      return sendJson(res, 200, { ok: true })
    } catch { return sendJson(res, 400, { ok: false, error: 'دادهٔ نامعتبر' }) }
  }
  // ── خواندن پیام‌ها (فقط ادمین) ──
  if (p === '/api/messages' && req.method === 'GET') {
    if (!isAuthed(req)) return sendJson(res, 401, { ok: false, error: 'دسترسی غیرمجاز' })
    return sendJson(res, 200, { ok: true, messages: readMessages() })
  }
  // ── به‌روزرسانی پیام‌ها: تغییر وضعیت/حذف (فقط ادمین) ──
  if (p === '/api/messages' && req.method === 'PUT') {
    if (!isAuthed(req)) return sendJson(res, 401, { ok: false, error: 'دسترسی غیرمجاز' })
    try {
      const body = JSON.parse((await readBody(req)) || '{}')
      if (!Array.isArray(body.messages)) return sendJson(res, 400, { ok: false })
      writeMessages(body.messages)
      return sendJson(res, 200, { ok: true })
    } catch { return sendJson(res, 400, { ok: false, error: 'دادهٔ نامعتبر' }) }
  }

  if (p.startsWith('/api/')) return sendJson(res, 404, { ok: false })

  // ── فایل‌های استاتیک React (dist/) + روتینگ SPA ──
  let filePath = path.normalize(path.join(DIST_DIR, decodeURIComponent(p)))
  if (!filePath.startsWith(DIST_DIR)) filePath = path.join(DIST_DIR, 'index.html') // جلوگیری از path traversal
  if (p === '/' || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html')
  }
  fs.readFile(filePath, (err, content) => {
    if (err) { res.writeHead(404); return res.end('Not found') }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' })
    res.end(content)
  })
})

server.listen(PORT, () => console.log(`Davino server روی پورت ${PORT} اجرا شد (بدون وابستگی)`))

// بک‌اند داوینو — بدون وابستگی خارجی (فقط ماژول‌های داخلی Node)
// محتوا در server/data/content.json ذخیره می‌شود.
//   GET  /api/content     → خواندن (عمومی)
//   POST /api/login       → بررسی رمز ادمین
//   PUT  /api/content     → ذخیره (نیازمند سشن معتبر)
//   POST /api/logout      → پایان سشن ادمین
//   POST /api/upload      → آپلود عکس (نیازمند سشن معتبر)
// همچنین فایل‌های build شده‌ی React (dist/) را سرو می‌کند.
// ────────────────────────────────────────────────────────────
// امنیت:
// - ADMIN_PASSWORD الزامی است (بدون مقدار پیش‌فرض)
// - احراز هویت با توکن سشن تصادفی (نه خود رمز)
// - رمز در حافظه می‌ماند، در شبکه گردش نمی‌کند
// - قابلیت HTTPS با متغیرهای محیطی SSL_KEY و SSL_CERT
// - Content-Security-Policy روی همه پاسخ‌ها
// - محدودیت نرخ نوشتن (rate limiting)
// - رمزگذاری PII در ثبت‌نام‌ها (AES-256-GCM)
// - عکس‌ها به‌عنوان فایل ذخیره می‌شوند، نه base64 در JSON
// ────────────────────────────────────────────────────────────
import http from 'http'
import https from 'https'
import fs from 'fs'
import fsp from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DATA_DIR = path.join(__dirname, 'data')
const DATA_FILE = path.join(DATA_DIR, 'content.json')
const MSG_FILE = path.join(DATA_DIR, 'messages.json')
const REG_FILE = path.join(DATA_DIR, 'registrations.json')
const WORKSHOP_FILE = path.join(DATA_DIR, 'workshop-registrations.json')
const NATURE_KIDS_FILE = path.join(DATA_DIR, 'nature-kids-registrations.json')
const DIST_DIR = path.join(ROOT, 'dist')
const UPLOAD_DIR = path.join(__dirname, 'uploads')

const PORT = process.env.PORT || 3001
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
if (!ADMIN_PASSWORD) {
  console.error('ADMIN_PASSWORD env required — set a strong password')
  process.exit(1)
}

// ── کلید رمزگذاری PII از ADMIN_PASSWORD ──
const ENCRYPTION_KEY = crypto.scryptSync(ADMIN_PASSWORD, 'davino-pii-salt', 32)
const ENCRYPTION_ALGO = 'aes-256-gcm'

function encrypt(text) {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGO, ENCRYPTION_KEY, iv)
  let enc = cipher.update(text, 'utf8', 'hex')
  enc += cipher.final('hex')
  return JSON.stringify({ iv: iv.toString('hex'), data: enc, tag: cipher.getAuthTag().toString('hex') })
}

function decrypt(encryptedStr) {
  try {
    const { iv, data, tag } = JSON.parse(encryptedStr)
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGO, ENCRYPTION_KEY, Buffer.from(iv, 'hex'))
    decipher.setAuthTag(Buffer.from(tag, 'hex'))
    let dec = decipher.update(data, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec
  } catch { return '' }
}

function isEncrypted(val) {
  if (typeof val !== 'string') return false
  try {
    const o = JSON.parse(val)
    return o && typeof o.iv === 'string' && typeof o.data === 'string' && typeof o.tag === 'string'
  } catch { return false }
}

const encryptFields = ['nationalId', 'phone', 'address', 'birthDate']

const WORKSHOP_CONCERNS = new Set([
  'کاهش اعتمادبه‌نفس', 'کمبود مسئولیت‌پذیری', 'وابستگی بیش از حد به والدین',
  'خجالتی بودن', 'اضطراب و استرس', 'نداشتن تمرکز', 'لجبازی',
  'ناتوانی در کنترل هیجان', 'استفاده زیاد از موبایل و تبلت', 'مشکل در ارتباط با همسالان', 'مورد دیگر',
])
const WORKSHOP_HEARD = new Set(['اینستاگرام', 'دوستان و آشنایان', 'سایت داوینو', 'کانال تلگرام', 'سایر'])
const WORKSHOP_GENDERS = new Set(['پسر', 'دختر'])
const NATURE_RELATIONS = new Set(['پدر', 'مادر', 'ولی'])
const NATURE_HEARD = new Set(['اینستاگرام', 'دوستان و آشنایان', 'سایت داوینو', 'کانال تلگرام', 'سایر'])

function encryptRegistration(reg) {
  const r = { ...reg }
  for (const f of encryptFields) {
    if (r[f] && !isEncrypted(r[f])) r[f] = encrypt(r[f])
  }
  return r
}

function decryptRegistration(reg) {
  const r = { ...reg }
  for (const f of encryptFields) {
    if (r[f] && isEncrypted(r[f])) r[f] = decrypt(r[f])
  }
  return r
}

// ── normalizeDigits ──
const normalizeDigits = (value) => String(value)
  .replace(/[۰-۹]/g, digit => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))
  .replace(/[٠-٩]/g, digit => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit))

// ── ایجاد پوشه‌ها ──
fs.mkdirSync(DATA_DIR, { recursive: true })
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.map': 'application/json', '.txt': 'text/plain; charset=utf-8',
}

const CACHE_MAX = { '.html': 0, '.json': 0, '.js': 31536000, '.css': 31536000, '.png': 31536000, '.jpg': 31536000, '.jpeg': 31536000, '.gif': 31536000, '.webp': 31536000, '.svg': 31536000, '.ico': 31536000, '.woff': 31536000, '.woff2': 31536000, '.ttf': 31536000 }

// ── CSP policy (تنظیم شده برای React با استایل‌های inline) ──
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
].join('; ')

// ── helpers ──
function sendJson(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(obj))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '', size = 0
    req.on('data', c => {
      size += c.length
      if (size > 20 * 1024 * 1024) { reject(new Error('too large')); req.destroy() }
      else data += c
    })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

// ── Async file I/O ──
async function readJson(filePath) {
  try {
    await fsp.access(filePath)
    const raw = await fsp.readFile(filePath, 'utf8')
    return JSON.parse(raw)
  } catch { return null }
}

async function readContent() {
  return readJson(DATA_FILE)
}

async function writeContent(data) {
  const tmp = DATA_FILE + '.tmp'
  await fsp.writeFile(tmp, JSON.stringify(data))
  await fsp.rename(tmp, DATA_FILE)
}

async function readMessages() {
  const data = await readJson(MSG_FILE)
  return Array.isArray(data) ? data : []
}

async function writeMessages(arr) {
  const tmp = MSG_FILE + '.tmp'
  await fsp.writeFile(tmp, JSON.stringify(arr))
  await fsp.rename(tmp, MSG_FILE)
}

async function readRegistrationsRaw() {
  const data = await readJson(REG_FILE)
  return Array.isArray(data) ? data : []
}

async function readRegistrations() {
  const raw = await readRegistrationsRaw()
  return raw.map(decryptRegistration)
}

async function writeRegistrations(arr) {
  const enc = arr.map(encryptRegistration)
  const tmp = REG_FILE + '.tmp'
  await fsp.writeFile(tmp, JSON.stringify(enc))
  await fsp.rename(tmp, REG_FILE)
}

function encryptWorkshop(reg) {
  const r = { ...reg, attendees: (reg.attendees || []).map(a => {
    const person = { ...a }
    if (person.phone && !isEncrypted(person.phone)) person.phone = encrypt(person.phone)
    if (person.email && !isEncrypted(person.email)) person.email = encrypt(person.email)
    return person
  }) }
  return r
}

function decryptWorkshop(reg) {
  const r = { ...reg, attendees: (reg.attendees || []).map(a => {
    const person = { ...a }
    if (person.phone && isEncrypted(person.phone)) person.phone = decrypt(person.phone)
    if (person.email && isEncrypted(person.email)) person.email = decrypt(person.email)
    return person
  }) }
  return r
}

async function readWorkshopRaw() {
  const data = await readJson(WORKSHOP_FILE)
  return Array.isArray(data) ? data : []
}

async function readWorkshopRegistrations() {
  return (await readWorkshopRaw()).map(decryptWorkshop)
}

async function writeWorkshopRegistrations(arr) {
  const enc = arr.map(encryptWorkshop)
  const tmp = WORKSHOP_FILE + '.tmp'
  await fsp.writeFile(tmp, JSON.stringify(enc))
  await fsp.rename(tmp, WORKSHOP_FILE)
}

function encryptNatureKids(reg) {
  const r = { ...reg }
  if (r.parentPhone && !isEncrypted(r.parentPhone)) r.parentPhone = encrypt(r.parentPhone)
  if (r.medicalNotes && !isEncrypted(r.medicalNotes)) r.medicalNotes = encrypt(r.medicalNotes)
  return r
}

function decryptNatureKids(reg) {
  const r = { ...reg }
  if (r.parentPhone && isEncrypted(r.parentPhone)) r.parentPhone = decrypt(r.parentPhone)
  if (r.medicalNotes && isEncrypted(r.medicalNotes)) r.medicalNotes = decrypt(r.medicalNotes)
  return r
}

async function readNatureKidsRaw() {
  const data = await readJson(NATURE_KIDS_FILE)
  return Array.isArray(data) ? data : []
}

async function readNatureKidsRegistrations() {
  return (await readNatureKidsRaw()).map(decryptNatureKids)
}

async function writeNatureKidsRegistrations(arr) {
  const enc = arr.map(encryptNatureKids)
  const tmp = NATURE_KIDS_FILE + '.tmp'
  await fsp.writeFile(tmp, JSON.stringify(enc))
  await fsp.rename(tmp, NATURE_KIDS_FILE)
}

// ── محدودیت تلاش لاگین ──
const loginAttempts = new Map()
const MAX_FAILS = 6
const LOCK_MS = 15 * 60 * 1000
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

// ── محدودیت ارسال پیام ──
const msgSubmits = new Map()
const MSG_WINDOW_MS = 10 * 60 * 1000
const MSG_MAX = 5
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

// ── محدودیت نرخ نوشتن ادمین (PUT) ──
const writeLimits = new Map()
const WRITE_MAX = 10
const WRITE_WINDOW_MS = 10000
function writeRateLimited(token) {
  const now = Date.now()
  const arr = (writeLimits.get(token) || []).filter(t => now - t < WRITE_WINDOW_MS)
  writeLimits.set(token, arr)
  return arr.length >= WRITE_MAX
}
function noteWrite(token) {
  const arr = (writeLimits.get(token) || []).filter(t => Date.now() - t < WRITE_WINDOW_MS)
  arr.push(Date.now())
  writeLimits.set(token, arr)
}

// ── سشن‌های ادمین ──
const sessions = new Map()
const SESSION_TTL_MS = 24 * 60 * 60 * 1000
const SESSION_CLEANUP_MS = 60 * 60 * 1000

setInterval(() => {
  const now = Date.now()
  for (const [token, s] of sessions) {
    if (now >= s.expiresAt) sessions.delete(token)
  }
}, SESSION_CLEANUP_MS)

function createSession() {
  const token = crypto.randomBytes(32).toString('hex')
  sessions.set(token, { expiresAt: Date.now() + SESSION_TTL_MS })
  return token
}

function isAuthed(req) {
  const h = req.headers.authorization || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : ''
  const s = sessions.get(token)
  if (!s) return false
  if (Date.now() >= s.expiresAt) { sessions.delete(token); return false }
  s.expiresAt = Date.now() + SESSION_TTL_MS
  return true
}

function getToken(req) {
  const h = req.headers.authorization || ''
  return h.startsWith('Bearer ') ? h.slice(7) : ''
}

// ── تبدیل base64 image به فایل (با deduplication با hash محتوا) ──
const imageHashCache = new Map()

async function saveBase64Image(dataUrl) {
  const match = dataUrl.match(/^data:(image\/(\w+));base64,(.+)$/)
  if (!match) return null
  const ext = { jpeg: 'jpg', jpg: 'jpg', png: 'png', gif: 'gif', webp: 'webp' }[match[2]] || 'jpg'
  const buf = Buffer.from(match[3], 'base64')
  const hash = crypto.createHash('md5').update(buf).digest('hex')
  const cached = imageHashCache.get(hash)
  if (cached) return cached
  const name = `${hash}.${ext}`
  const filePath = path.join(UPLOAD_DIR, name)
  try {
    await fsp.writeFile(filePath, buf, { flag: 'wx' })
  } catch (e) {
    if (e.code !== 'EEXIST') console.error('Failed to save upload:', e.message)
  }
  const url = `/uploads/${name}`
  imageHashCache.set(hash, url)
  return url
}

// ── پردازش عکس‌های base64 در محتوا و تبدیل به فایل ──
async function processImages(data) {
  if (!data || typeof data !== 'object') return data
  const d = Array.isArray(data) ? [...data] : { ...data }

  if (d.trainers && Array.isArray(d.trainers)) {
    d.trainers = await Promise.all(d.trainers.map(async t => {
      if (t.photo && typeof t.photo === 'string' && t.photo.startsWith('data:image/')) {
        const url = await saveBase64Image(t.photo)
        if (url) return { ...t, photo: url }
      }
      return t
    }))
  }

  if (d.settings && typeof d.settings === 'object') {
    if (d.settings.heroImage && typeof d.settings.heroImage === 'string' && d.settings.heroImage.startsWith('data:image/')) {
      const url = await saveBase64Image(d.settings.heroImage)
      if (url) d.settings = { ...d.settings, heroImage: url }
    }
  }

  if (d.gallery && Array.isArray(d.gallery)) {
    d.gallery = await Promise.all(d.gallery.map(async g => {
      if (g.photo && typeof g.photo === 'string' && g.photo.startsWith('data:image/')) {
        const url = await saveBase64Image(g.photo)
        if (url) return { ...g, photo: url }
      }
      return g
    }))
  }

  return d
}

// ── اعتبارسنجی بدنه PUT /api/content ──
function validateContent(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return 'body must be an object'
  }
  const allowedKeys = new Set(['trainers', 'classes', 'gallery', 'pricing', 'settings', 'articles'])
  for (const key of Object.keys(data)) {
    if (!allowedKeys.has(key)) return `unexpected key: ${key}`
  }
  if (data.trainers !== undefined && !Array.isArray(data.trainers)) return 'trainers must be an array'
  if (data.classes !== undefined && !Array.isArray(data.classes)) return 'classes must be an array'
  if (data.gallery !== undefined && !Array.isArray(data.gallery)) return 'gallery must be an array'
  if (data.pricing !== undefined && !Array.isArray(data.pricing)) return 'pricing must be an array'
  if (data.settings !== undefined && (typeof data.settings !== 'object' || Array.isArray(data.settings))) return 'settings must be an object'
  if (data.articles !== undefined && !Array.isArray(data.articles)) return 'articles must be an array'

  for (const t of (data.trainers || [])) {
    if (!t || typeof t !== 'object') return 'each trainer must be an object'
    if (!t.id || typeof t.id !== 'string') return 'each trainer must have a string id'
    if (t.name && typeof t.name !== 'string') return 'trainer name must be a string'
    if (t.photo && typeof t.photo !== 'string') return 'trainer photo must be a string'
  }

  for (const c of (data.classes || [])) {
    if (!c || typeof c !== 'object') return 'each class must be an object'
    if (c.title && typeof c.title !== 'string') return 'class title must be a string'
    if (c.days && (!Array.isArray(c.days) || c.days.some(d => typeof d !== 'string'))) return 'class days must be an array of strings'
  }

  for (const g of (data.gallery || [])) {
    if (!g || typeof g !== 'object') return 'each gallery item must be an object'
    if (g.photo && typeof g.photo !== 'string') return 'gallery photo must be a string'
  }

  if (data.settings) {
    if (data.settings.heroImage && typeof data.settings.heroImage !== 'string') return 'heroImage must be a string'
    if (data.settings.gymName && typeof data.settings.gymName !== 'string') return 'gymName must be a string'
  }

  for (const p of (data.pricing || [])) {
    if (!p || typeof p !== 'object') return 'each pricing item must be an object'
  }

  for (const a of (data.articles || [])) {
    if (!a || typeof a !== 'object') return 'each article must be an object'
  }

  return null
}

// ── لاگ ساده ──
function auditLog(action, detail) {
  const ts = new Date().toISOString()
  console.log(`[AUDIT] ${ts} — ${action} — ${detail}`)
}

// ── Headers امنیتی ──
function setSecurityHeaders(res, host) {
  res.setHeader('Content-Security-Policy', CSP)
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('X-XSS-Protection', '0')
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
  if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const p = url.pathname
  const host = req.headers.host

  setSecurityHeaders(res, host)

  // ── API ──
  if (p === '/api/content' && req.method === 'GET') {
    const content = await readContent()
    if (!content) { res.writeHead(204); return res.end() }
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    return res.end(JSON.stringify(content))
  }

  if (p === '/api/content-core' && req.method === 'GET') {
    const content = await readContent()
    if (!content) { res.writeHead(204); return res.end() }
    try {
      const { gallery, ...core } = content
      return sendJson(res, 200, core)
    } catch {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
      return res.end(JSON.stringify(content))
    }
  }

  if (p === '/api/login' && req.method === 'POST') {
    const ip = clientIp(req)
    if (loginLocked(ip)) return sendJson(res, 429, { ok: false, error: 'تلاش زیاد — بعداً امتحان کن' })
    try {
      const body = JSON.parse((await readBody(req)) || '{}')
      if (body.password && body.password === ADMIN_PASSWORD) {
        loginAttempts.delete(ip)
        const token = createSession()
        auditLog('LOGIN_OK', ip)
        return sendJson(res, 200, { ok: true, token })
      }
      noteLoginFail(ip)
      auditLog('LOGIN_FAIL', ip)
      return sendJson(res, 401, { ok: false, error: 'رمز اشتباه است' })
    } catch { return sendJson(res, 400, { ok: false }) }
  }

  if (p === '/api/logout' && req.method === 'POST') {
    const h = req.headers.authorization || ''
    const token = h.startsWith('Bearer ') ? h.slice(7) : ''
    sessions.delete(token)
    auditLog('LOGOUT', token.slice(0, 8) + '...')
    return sendJson(res, 200, { ok: true })
  }

  if (p === '/api/content' && req.method === 'PUT') {
    if (!isAuthed(req)) return sendJson(res, 401, { ok: false, error: 'دسترسی غیرمجاز' })
    const token = getToken(req)
    if (writeRateLimited(token)) return sendJson(res, 429, { ok: false, error: 'تعداد درخواست‌ها زیاد است — کمی صبر کن' })
    try {
      const body = JSON.parse(await readBody(req))
      const err = validateContent(body)
      if (err) return sendJson(res, 400, { ok: false, error: err })
      const processed = await processImages(body)
      await writeContent(processed)
      noteWrite(token)
      auditLog('CONTENT_UPDATE', `keys: ${Object.keys(body).join(',')}`)
      return sendJson(res, 200, { ok: true, data: processed })
    } catch (e) {
      const msg = e.message === 'too large' ? 'حجم داده بیش از حد مجاز (۲۰MB)' : 'دادهٔ نامعتبر'
      return sendJson(res, 400, { ok: false, error: msg })
    }
  }

  // ── آپلود عکس ──
  if (p === '/api/upload' && req.method === 'POST') {
    if (!isAuthed(req)) return sendJson(res, 401, { ok: false, error: 'دسترسی غیرمجاز' })
    try {
      const body = JSON.parse(await readBody(req))
      if (!body.data || typeof body.data !== 'string' || !body.data.startsWith('data:image/')) {
        return sendJson(res, 400, { ok: false, error: 'دادهٔ عکس نامعتبر' })
      }
      const url = await saveBase64Image(body.data)
      if (!url) return sendJson(res, 400, { ok: false, error: 'فرمت عکس پشتیبانی نمی‌شود' })
      return sendJson(res, 200, { ok: true, url })
    } catch { return sendJson(res, 400, { ok: false, error: 'دادهٔ نامعتبر' }) }
  }

  // ── پیام‌ها ──
  if (p === '/api/messages' && req.method === 'POST') {
    const ip = clientIp(req)
    if (msgRateLimited(ip)) return sendJson(res, 429, { ok: false, error: 'تعداد پیام‌ها زیاد است — کمی بعد دوباره تلاش کن' })
    try {
      const body = JSON.parse((await readBody(req)) || '{}')
      if (String(body.company || '').trim()) return sendJson(res, 200, { ok: true })
      const name = String(body.name || '').trim().slice(0, 120)
      const phone = String(body.phone || '').trim().slice(0, 40)
      const message = String(body.message || '').trim().slice(0, 2000)
      if (!name || !phone) return sendJson(res, 400, { ok: false, error: 'نام و شماره تماس لازم است' })
      const msgs = await readMessages()
      msgs.unshift({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name, phone, message,
        date: new Date().toISOString(),
        status: 'new',
      })
      if (msgs.length > 1000) msgs.length = 1000
      await writeMessages(msgs)
      noteMsgSubmit(ip)
      return sendJson(res, 200, { ok: true })
    } catch { return sendJson(res, 400, { ok: false, error: 'دادهٔ نامعتبر' }) }
  }

  if (p === '/api/messages' && req.method === 'GET') {
    if (!isAuthed(req)) return sendJson(res, 401, { ok: false, error: 'دسترسی غیرمجاز' })
    return sendJson(res, 200, { ok: true, messages: await readMessages() })
  }

  if (p === '/api/messages' && req.method === 'PUT') {
    if (!isAuthed(req)) return sendJson(res, 401, { ok: false, error: 'دسترسی غیرمجاز' })
    try {
      const body = JSON.parse((await readBody(req)) || '{}')
      if (!Array.isArray(body.messages)) return sendJson(res, 400, { ok: false })
      await writeMessages(body.messages)
      return sendJson(res, 200, { ok: true })
    } catch { return sendJson(res, 400, { ok: false, error: 'دادهٔ نامعتبر' }) }
  }

  // ── ثبت‌نام ──
  if (p === '/api/registrations' && req.method === 'POST') {
    const ip = clientIp(req)
    if (msgRateLimited(ip)) return sendJson(res, 429, { ok: false, error: 'تعداد درخواست‌ها زیاد است — کمی بعد دوباره تلاش کن' })
    try {
      const body = JSON.parse((await readBody(req)) || '{}')
      if (String(body.company || '').trim()) return sendJson(res, 200, { ok: true })
      const fullName = String(body.fullName || '').trim().slice(0, 120)
      const nationalId = normalizeDigits(body.nationalId || '').replace(/\D/g, '').slice(0, 10)
      const birthDate = String(body.birthDate || '').trim().slice(0, 20)
      const phone = normalizeDigits(body.phone || '').replace(/\D/g, '').slice(0, 11)
      const address = String(body.address || '').trim().slice(0, 500)
      const insuranceExpiry = String(body.insuranceExpiry || '').trim().slice(0, 20)
      const planId = String(body.planId || '').trim().slice(0, 80)
      const planName = String(body.planName || '').trim().slice(0, 160)
      const planPrice = String(body.planPrice || '').trim().slice(0, 80)
      if (!fullName || nationalId.length !== 10 || !birthDate || !/^09\d{9}$/.test(phone) || !address || !insuranceExpiry || !planId) {
        return sendJson(res, 400, { ok: false, error: 'اطلاعات ثبت‌نام کامل یا معتبر نیست' })
      }
      const registrations = await readRegistrationsRaw()
      registrations.unshift(encryptRegistration({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        fullName, nationalId, birthDate, phone, address, insuranceExpiry,
        planId, planName, planPrice, status: 'pending', paymentStatus: 'not_started',
        date: new Date().toISOString(),
      }))
      if (registrations.length > 2000) registrations.length = 2000
      await writeRegistrations(registrations)
      noteMsgSubmit(ip)
      return sendJson(res, 200, { ok: true })
    } catch { return sendJson(res, 400, { ok: false, error: 'دادهٔ نامعتبر' }) }
  }

  if (p === '/api/registrations' && req.method === 'GET') {
    if (!isAuthed(req)) return sendJson(res, 401, { ok: false, error: 'دسترسی غیرمجاز' })
    return sendJson(res, 200, { ok: true, registrations: await readRegistrations() })
  }

  if (p === '/api/registrations' && req.method === 'PUT') {
    if (!isAuthed(req)) return sendJson(res, 401, { ok: false, error: 'دسترسی غیرمجاز' })
    try {
      const body = JSON.parse((await readBody(req)) || '{}')
      const allowedStatuses = new Set(['pending', 'contacted', 'completed', 'cancelled'])
      if (!Array.isArray(body.registrations) || body.registrations.some(item => !item || !item.id || !allowedStatuses.has(item.status))) {
        return sendJson(res, 400, { ok: false, error: 'اطلاعات درخواست‌ها معتبر نیست' })
      }
      await writeRegistrations(body.registrations)
      return sendJson(res, 200, { ok: true })
    } catch { return sendJson(res, 400, { ok: false, error: 'دادهٔ نامعتبر' }) }
  }

  // ── ثبت‌نام کارگاه ──
  if (p === '/api/workshop-registrations' && req.method === 'POST') {
    const ip = clientIp(req)
    if (msgRateLimited(ip)) return sendJson(res, 429, { ok: false, error: 'تعداد درخواست‌ها زیاد است — کمی بعد دوباره تلاش کن' })
    try {
      const body = JSON.parse((await readBody(req)) || '{}')
      if (String(body.company || '').trim()) return sendJson(res, 200, { ok: true })

      const attendeeCount = Number(body.attendeeCount) === 2 ? 2 : 1
      const price = attendeeCount === 2 ? '۲،۰۰۰،۰۰۰' : '۱،۲۵۰،۰۰۰'
      const rawAttendees = Array.isArray(body.attendees) ? body.attendees.slice(0, attendeeCount) : []
      if (rawAttendees.length !== attendeeCount) {
        return sendJson(res, 400, { ok: false, error: 'اطلاعات شرکت‌کنندگان کامل نیست' })
      }

      const attendees = []
      for (const raw of rawAttendees) {
        const fullName = String(raw.fullName || '').trim().slice(0, 120)
        const phone = normalizeDigits(raw.phone || '').replace(/\D/g, '').slice(0, 11)
        const age = String(raw.age || '').trim().slice(0, 3)
        const job = String(raw.job || '').trim().slice(0, 120)
        const email = String(raw.email || '').trim().slice(0, 160)
        if (!fullName || !/^09\d{9}$/.test(phone) || !age || !job) {
          return sendJson(res, 400, { ok: false, error: 'اطلاعات شرکت‌کنندگان کامل یا معتبر نیست' })
        }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return sendJson(res, 400, { ok: false, error: 'ایمیل معتبر نیست' })
        }
        attendees.push({ fullName, phone, age, job, email })
      }

      const childRaw = body.child || {}
      const childName = String(childRaw.name || '').trim().slice(0, 120)
      const childAge = String(childRaw.age || '').trim().slice(0, 3)
      const childGender = String(childRaw.gender || '').trim()
      let isMember
      if (childRaw.isMember === true || childRaw.isMember === 'yes' || childRaw.isMember === 'بله') isMember = true
      else if (childRaw.isMember === false || childRaw.isMember === 'no' || childRaw.isMember === 'خیر') isMember = false
      else return sendJson(res, 400, { ok: false, error: 'اطلاعات فرزند کامل نیست' })
      if (!childName || !childAge || !WORKSHOP_GENDERS.has(childGender)) {
        return sendJson(res, 400, { ok: false, error: 'اطلاعات فرزند کامل نیست' })
      }
      const child = { name: childName, age: childAge, gender: childGender, isMember }

      const concerns = Array.isArray(body.concerns)
        ? body.concerns.map(c => String(c).trim()).filter(c => WORKSHOP_CONCERNS.has(c)).slice(0, 12)
        : []
      const concernOther = String(body.concernOther || '').trim().slice(0, 300)
      if (!concerns.length) return sendJson(res, 400, { ok: false, error: 'حداقل یک دغدغه را انتخاب کنید' })
      if (concerns.includes('مورد دیگر') && !concernOther) {
        return sendJson(res, 400, { ok: false, error: 'لطفاً مورد دیگر را بنویسید' })
      }

      const expectation = String(body.expectation || '').trim().slice(0, 1000)
      if (!expectation) return sendJson(res, 400, { ok: false, error: 'انتظار از کارگاه را بنویسید' })

      const heardFrom = String(body.heardFrom || '').trim()
      const heardOther = String(body.heardOther || '').trim().slice(0, 200)
      if (!WORKSHOP_HEARD.has(heardFrom)) return sendJson(res, 400, { ok: false, error: 'منبع آشنایی را انتخاب کنید' })
      if (heardFrom === 'سایر' && !heardOther) {
        return sendJson(res, 400, { ok: false, error: 'لطفاً منبع آشنایی را بنویسید' })
      }

      const list = await readWorkshopRaw()
      list.unshift(encryptWorkshop({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        attendeeCount, price, attendees, child,
        concerns, concernOther, expectation, heardFrom, heardOther,
        status: 'pending',
        date: new Date().toISOString(),
      }))
      if (list.length > 2000) list.length = 2000
      await writeWorkshopRegistrations(list)
      noteMsgSubmit(ip)
      return sendJson(res, 200, { ok: true })
    } catch { return sendJson(res, 400, { ok: false, error: 'دادهٔ نامعتبر' }) }
  }

  if (p === '/api/workshop-registrations' && req.method === 'GET') {
    if (!isAuthed(req)) return sendJson(res, 401, { ok: false, error: 'دسترسی غیرمجاز' })
    return sendJson(res, 200, { ok: true, registrations: await readWorkshopRegistrations() })
  }

  if (p === '/api/workshop-registrations' && req.method === 'PUT') {
    if (!isAuthed(req)) return sendJson(res, 401, { ok: false, error: 'دسترسی غیرمجاز' })
    try {
      const body = JSON.parse((await readBody(req)) || '{}')
      const allowedStatuses = new Set(['pending', 'contacted', 'completed', 'cancelled'])
      if (!Array.isArray(body.registrations) || body.registrations.some(item => !item || !item.id || !allowedStatuses.has(item.status))) {
        return sendJson(res, 400, { ok: false, error: 'اطلاعات درخواست‌ها معتبر نیست' })
      }
      await writeWorkshopRegistrations(body.registrations)
      return sendJson(res, 200, { ok: true })
    } catch { return sendJson(res, 400, { ok: false, error: 'دادهٔ نامعتبر' }) }
  }

  // ── ثبت‌نام سنگ‌نوردی طبیعت کودکان ──
  if (p === '/api/nature-kids-registrations' && req.method === 'POST') {
    const ip = clientIp(req)
    if (msgRateLimited(ip)) return sendJson(res, 429, { ok: false, error: 'تعداد درخواست‌ها زیاد است — کمی بعد دوباره تلاش کن' })
    try {
      const body = JSON.parse((await readBody(req)) || '{}')
      if (String(body.company || '').trim()) return sendJson(res, 200, { ok: true })

      const parentName = String(body.parentName || '').trim().slice(0, 120)
      const parentPhone = normalizeDigits(body.parentPhone || '').replace(/\D/g, '').slice(0, 11)
      const relation = String(body.relation || '').trim()
      const childName = String(body.childName || '').trim().slice(0, 120)
      const childAge = normalizeDigits(body.childAge || '').replace(/\D/g, '').slice(0, 2)
      const childGender = String(body.childGender || '').trim()
      let isMember
      if (body.isMember === true || body.isMember === 'yes' || body.isMember === 'بله') isMember = true
      else if (body.isMember === false || body.isMember === 'no' || body.isMember === 'خیر') isMember = false
      else return sendJson(res, 400, { ok: false, error: 'عضویت در باشگاه را مشخص کنید' })
      const medicalNotes = String(body.medicalNotes || '').trim().slice(0, 500)
      const notes = String(body.notes || '').trim().slice(0, 1000)
      const heardFrom = String(body.heardFrom || '').trim()
      const heardOther = String(body.heardOther || '').trim().slice(0, 200)

      if (!parentName || !/^09\d{9}$/.test(parentPhone) || !NATURE_RELATIONS.has(relation)) {
        return sendJson(res, 400, { ok: false, error: 'اطلاعات والدین کامل یا معتبر نیست' })
      }
      if (!childName || !childAge || !WORKSHOP_GENDERS.has(childGender)) {
        return sendJson(res, 400, { ok: false, error: 'اطلاعات کودک کامل نیست' })
      }
      const ageNum = Number(childAge)
      if (!Number.isInteger(ageNum) || ageNum < 1 || ageNum > 17) {
        return sendJson(res, 400, { ok: false, error: 'سن کودک باید بین ۱ تا ۱۷ سال باشد' })
      }
      if (body.consent !== true) {
        return sendJson(res, 400, { ok: false, error: 'رضایت والدین برای ثبت‌نام لازم است' })
      }
      if (!NATURE_HEARD.has(heardFrom)) return sendJson(res, 400, { ok: false, error: 'منبع آشنایی را انتخاب کنید' })
      if (heardFrom === 'سایر' && !heardOther) {
        return sendJson(res, 400, { ok: false, error: 'لطفاً منبع آشنایی را بنویسید' })
      }

      const list = await readNatureKidsRaw()
      list.unshift(encryptNatureKids({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        parentName, parentPhone, relation,
        childName, childAge, childGender, isMember,
        medicalNotes, notes, heardFrom, heardOther,
        consent: true,
        status: 'pending',
        date: new Date().toISOString(),
      }))
      if (list.length > 2000) list.length = 2000
      await writeNatureKidsRegistrations(list)
      noteMsgSubmit(ip)
      return sendJson(res, 200, { ok: true })
    } catch { return sendJson(res, 400, { ok: false, error: 'دادهٔ نامعتبر' }) }
  }

  if (p === '/api/nature-kids-registrations' && req.method === 'GET') {
    if (!isAuthed(req)) return sendJson(res, 401, { ok: false, error: 'دسترسی غیرمجاز' })
    return sendJson(res, 200, { ok: true, registrations: await readNatureKidsRegistrations() })
  }

  if (p === '/api/nature-kids-registrations' && req.method === 'PUT') {
    if (!isAuthed(req)) return sendJson(res, 401, { ok: false, error: 'دسترسی غیرمجاز' })
    try {
      const body = JSON.parse((await readBody(req)) || '{}')
      const allowedStatuses = new Set(['pending', 'contacted', 'completed', 'cancelled'])
      if (!Array.isArray(body.registrations) || body.registrations.some(item => !item || !item.id || !allowedStatuses.has(item.status))) {
        return sendJson(res, 400, { ok: false, error: 'اطلاعات درخواست‌ها معتبر نیست' })
      }
      await writeNatureKidsRegistrations(body.registrations)
      return sendJson(res, 200, { ok: true })
    } catch { return sendJson(res, 400, { ok: false, error: 'دادهٔ نامعتبر' }) }
  }

  if (p.startsWith('/api/')) return sendJson(res, 404, { ok: false })

  // ── static file serving (fully async) ──
  async function resolveStaticPath(requestPath) {
    const decoded = decodeURIComponent(requestPath)
    const distCandidate = path.normalize(path.join(DIST_DIR, decoded))
    if (distCandidate.startsWith(DIST_DIR)) {
      try {
        const stat = await fsp.stat(distCandidate)
        if (!stat.isDirectory()) return distCandidate
      } catch {}
    }
    // /uploads/* → UPLOAD_DIR (بدون پیشوند /uploads/)
    const uploadRel = decoded.startsWith('/uploads/') ? decoded.slice(9) : decoded
    const uploadCandidate = path.normalize(path.join(UPLOAD_DIR, uploadRel))
    if (uploadCandidate.startsWith(UPLOAD_DIR)) {
      try {
        const stat = await fsp.stat(uploadCandidate)
        if (!stat.isDirectory()) return uploadCandidate
      } catch {}
    }
    return path.join(DIST_DIR, 'index.html')
  }

  const filePath = await resolveStaticPath(p)
  try {
    const content = await fsp.readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream' }
    if (ext !== '.html' && ext !== '.json') {
      headers['Cache-Control'] = `public, max-age=${CACHE_MAX[ext] || 31536000}, immutable`
    }
    res.writeHead(200, headers)
    res.end(content)
  } catch {
    res.writeHead(404)
    res.end('Not found')
  }
})

const SSL_KEY = process.env.SSL_KEY
const SSL_CERT = process.env.SSL_CERT

if (SSL_KEY && SSL_CERT) {
  try {
    const sslOpts = {
      key: fs.readFileSync(path.resolve(SSL_KEY)),
      cert: fs.readFileSync(path.resolve(SSL_CERT)),
    }
    https.createServer(sslOpts, server).listen(PORT, () =>
      console.log(`Davino server روی پورت ${PORT} (HTTPS) اجرا شد`))
  } catch (e) {
    console.error('SSL failed, falling back to HTTP:', e.message)
    server.listen(PORT, () => console.log(`Davino server روی پورت ${PORT} (HTTP) اجرا شد`))
  }
} else {
  server.listen(PORT, () => console.log(`Davino server روی پورت ${PORT} (HTTP) اجرا شد — برای محیط تولید HTTPS را فعال کن`))
}

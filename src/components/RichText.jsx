// رندر متن با نشانه‌گذاری ساده:
//   «## عنوان» → h2 ، «### زیرعنوان» → h3 ، «- مورد» → لیست ، «---» → جداکننده ، خط خالی = پاراگراف
export default function RichText({ text }) {
  const lines = String(text || '').replace(/\r/g, '').split('\n')
  const blocks = []
  let para = []
  let list = []

  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: 'p', text: para.join(' ') })
      para = []
    }
  }
  const flushList = () => {
    if (list.length) {
      blocks.push({ type: 'ul', items: [...list] })
      list = []
    }
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) { flushPara(); flushList(); continue }
    if (line === '---' || line === '⸻') { flushPara(); flushList(); blocks.push({ type: 'hr' }); continue }
    if (line.startsWith('### ')) { flushPara(); flushList(); blocks.push({ type: 'h3', text: line.slice(4) }); continue }
    if (line.startsWith('## ')) { flushPara(); flushList(); blocks.push({ type: 'h2', text: line.slice(3) }); continue }
    if (line.startsWith('- ') || line.startsWith('* ')) { flushPara(); list.push(line.slice(2)); continue }
    flushList()
    para.push(line)
  }
  flushPara(); flushList()

  return (
    <div className="rich-text">
      {blocks.map((b, i) => {
        if (b.type === 'h2') return <h2 key={i} style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 900, color: 'var(--text)', letterSpacing: '-.01em', margin: '44px 0 14px', lineHeight: 1.4 }}>{b.text}</h2>
        if (b.type === 'h3') return <h3 key={i} style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.3rem)', fontWeight: 800, color: 'var(--text)', margin: '28px 0 10px' }}>{b.text}</h3>
        if (b.type === 'hr') return <hr key={i} style={{ border: 'none', borderTop: '1px solid var(--line)', margin: '36px 0' }} />
        if (b.type === 'ul') return (
          <ul key={i} style={{ listStyle: 'none', margin: '0 0 18px', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {b.items.map((it, j) => (
              <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, fontSize: 'clamp(15px, 2vw, 16.5px)', color: 'var(--t60)', lineHeight: 1.9 }}>
                <span style={{ flexShrink: 0, width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', marginTop: 11 }} />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        )
        return <p key={i} style={{ fontSize: 'clamp(15px, 2vw, 16.5px)', color: 'var(--t60)', lineHeight: 2.15, margin: '0 0 18px', textAlign: 'justify' }}>{b.text}</p>
      })}
    </div>
  )
}

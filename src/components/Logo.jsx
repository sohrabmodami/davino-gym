export default function Logo({ size = 1, dark = false }) {
  const height = Math.round(40 * size)
  const src = dark ? '/davino-logo-light.png' : '/davino-logo.png'
  return (
    <img
      src={src}
      alt="Davino Climbing"
      height={height}
      width={Math.round(height * (296 / 59))}
      style={{
        height,
        width: 'auto',
        display: 'block',
        objectFit: 'contain',
      }}
      draggable={false}
    />
  )
}

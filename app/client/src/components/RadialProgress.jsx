export default function RadialProgress({ value, color }) {
  return (
    <div
      className="radial-progress mb-4"
      style={{
        '--value': value,
        '--color': color,
      }}
    >
      <span
        className="font-headline-md text-headline-md"
        style={{ color }}
      >
        {value}%
      </span>
    </div>
  )
}

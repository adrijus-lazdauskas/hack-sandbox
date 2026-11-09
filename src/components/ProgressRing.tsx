/** Ring with the percentage in the middle. The centre is transparent, so it works on any background. */
export function ProgressRing({ percent, size = 62, color = 'currentColor' }: { percent: number; size?: number; color?: string }) {
  const stroke = Math.max(4, Math.round(size / 9));
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const p = Math.min(100, Math.max(0, Math.round(percent)));
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${p} % gewusst`}>
      <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeOpacity={0.15} strokeWidth={stroke} />
      {p > 0 && (
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(p / 100) * circumference} ${circumference}`}
          transform={`rotate(-90 ${c} ${c})`}
        />
      )}
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fill={color} fontSize={size / 4} fontWeight={800}>
        {`${p}\u202F%`}
      </text>
    </svg>
  );
}

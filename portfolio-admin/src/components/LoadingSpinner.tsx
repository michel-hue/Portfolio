interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export default function LoadingSpinner({
  size = 'md',
  label,
}: LoadingSpinnerProps) {
  const sizeClass = `spinner-${size}`;
  return (
    <div className="spinner-wrapper">
      <div className={`spinner ${sizeClass}`} role="status" aria-label="Chargement" />
      {label && <span className="spinner-label">{label}</span>}
    </div>
  );
}

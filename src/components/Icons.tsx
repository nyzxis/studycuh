interface IconProps {
  readonly size?: number;
  readonly className?: string;
}

export function IconSearch({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="square" className={className} aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5L20.5 20.5" />
    </svg>
  );
}

export function IconBook({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="square" className={className} aria-hidden="true">
      <path d="M4 4.5H11C12.1 4.5 13 5.4 13 6.5V19.5C13 18.7 12.1 18 11 18H4V4.5Z" />
      <path d="M20 4.5H13C11.9 4.5 11 5.4 11 6.5V19.5C11 18.7 11.9 18 13 18H20V4.5Z" />
    </svg>
  );
}

export function IconCheck({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="square" className={className} aria-hidden="true">
      <path d="M4.5 12.5L9.5 17.5L19.5 6.5" />
    </svg>
  );
}

export function IconBookmark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="square" className={className} aria-hidden="true">
      <path d="M6 4H18V20L12 15.5L6 20V4Z" />
    </svg>
  );
}

export function IconSpark({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="square" className={className} aria-hidden="true">
      <path d="M12 3V7M12 17V21M3 12H7M17 12H21M6 6L8.8 8.8M15.2 15.2L18 18M18 6L15.2 8.8M8.8 15.2L6 18" />
    </svg>
  );
}

export function IconAlert({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="square" className={className} aria-hidden="true">
      <path d="M12 3.5L21 19.5H3L12 3.5Z" />
      <path d="M12 9.5V13.5" />
      <circle cx="12" cy="16.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function IconLab({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="square" className={className} aria-hidden="true">
      <path d="M9 3H15M10 3V9.5L4.5 18.5C4 19.3 4.6 20.5 5.6 20.5H18.4C19.4 20.5 20 19.3 19.5 18.5L14 9.5V3" />
      <path d="M7.5 14.5H16.5" />
    </svg>
  );
}

export function IconCards({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="square" className={className} aria-hidden="true">
      <rect x="4" y="6" width="13" height="14" rx="1.5" />
      <path d="M8 6V4.5C8 3.7 8.7 3 9.5 3H19.5C20.3 3 21 3.7 21 4.5V15.5C21 16.3 20.3 17 19.5 17H17" />
    </svg>
  );
}

export function IconMenu({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="square" className={className} aria-hidden="true">
      <path d="M4 7H20M4 12H20M4 17H20" />
    </svg>
  );
}

export function IconGrid({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="square" className={className} aria-hidden="true">
      <rect x="3.5" y="3.5" width="7" height="7" />
      <rect x="13.5" y="3.5" width="7" height="7" />
      <rect x="3.5" y="13.5" width="7" height="7" />
      <rect x="13.5" y="13.5" width="7" height="7" />
    </svg>
  );
}

export function IconArrowRight({ size = 15, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="square" className={className} aria-hidden="true">
      <path d="M5 12H19M13 6L19 12L13 18" />
    </svg>
  );
}

export function IconPlus({ size = 15, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className={className} aria-hidden="true">
      <path d="M12 5V19M5 12H19" />
    </svg>
  );
}

export function IconMinus({ size = 15, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className={className} aria-hidden="true">
      <path d="M5 12H19" />
    </svg>
  );
}

export function IconGrip({ size = 15, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className={className} aria-hidden="true">
      <circle cx="9" cy="6" r="1" fill="currentColor" />
      <circle cx="15" cy="6" r="1" fill="currentColor" />
      <circle cx="9" cy="12" r="1" fill="currentColor" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
      <circle cx="9" cy="18" r="1" fill="currentColor" />
      <circle cx="15" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

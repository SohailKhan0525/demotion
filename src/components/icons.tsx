import React from "react";

type IconProps = { size?: number; color?: string; strokeWidth?: number };

const base = (
  path: React.ReactNode
): React.FC<IconProps> => ({ size = 16, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {path}
  </svg>
);

export const HomeIcon = base(
  <path d="M3 11.5 12 4l9 7.5M5.5 10v9a1 1 0 0 0 1 1H9.5v-5.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V20h3a1 1 0 0 0 1-1v-9" />
);

export const LayersIcon = base(
  <>
    <path d="m12 3 8.5 4.7L12 12.4 3.5 7.7 12 3Z" />
    <path d="m3.5 12 8.5 4.7L20.5 12" />
    <path d="m3.5 16.3 8.5 4.7 8.5-4.7" />
  </>
);

export const PaletteIcon = base(
  <>
    <path d="M12 3a9 9 0 1 0 0 18c1 0 1.8-.8 1.8-1.8 0-.47-.18-.9-.48-1.22a1.8 1.8 0 0 1-.48-1.23c0-1 .8-1.8 1.8-1.8H16a5 5 0 0 0 5-5c0-3.9-4-6.97-9-6.97Z" />
    <circle cx="7.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="11" cy="7.2" r="1" fill="currentColor" stroke="none" />
    <circle cx="15.2" cy="8" r="1" fill="currentColor" stroke="none" />
  </>
);

export const ToggleIcon = base(
  <>
    <rect x="2.5" y="7" width="19" height="10" rx="5" />
    <circle cx="16.5" cy="12" r="3.4" fill="currentColor" stroke="none" />
  </>
);

export const LockIcon = base(
  <>
    <rect x="5" y="10.5" width="14" height="9" rx="2" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </>
);

export const ChevronRightIcon = base(<path d="m9 5 7 7-7 7" />);

export const SparkIcon = base(
  <path d="M12 2.5 13.8 9l6.7 1.8-6.7 1.8L12 19.5l-1.8-6.9-6.7-1.8 6.7-1.8L12 2.5Z" />
);

export const CheckIcon = base(<path d="m4 12.5 5 5.5L20 6" />);

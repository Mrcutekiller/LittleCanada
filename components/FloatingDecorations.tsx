export function TomatoSVG() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="25" fill="#E74C3C" />
      <path d="M25 8C25 8 20 12 20 18C20 22 22 25 25 25" stroke="#27AE60" strokeWidth="2" fill="none" />
      <circle cx="35" cy="35" r="3" fill="#C0392B" opacity="0.6" />
      <circle cx="20" cy="25" r="2" fill="#C0392B" opacity="0.6" />
    </svg>
  )
}

export function BasilSVG() {
  return (
    <svg width="50" height="60" viewBox="0 0 50 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="25" cy="35" rx="8" ry="12" fill="#27AE60" />
      <ellipse cx="15" cy="25" rx="6" ry="10" fill="#2ECC71" />
      <ellipse cx="35" cy="25" rx="6" ry="10" fill="#27AE60" />
      <path d="M25 8V15" stroke="#229954" strokeWidth="2" />
      <circle cx="25" cy="6" r="2" fill="#229954" />
    </svg>
  )
}

export function EggSVG() {
  return (
    <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="25" rx="15" ry="20" fill="#F4D9A6" />
      <circle cx="20" cy="20" r="6" fill="#FEF5E7" />
    </svg>
  )
}

export function BreadSVG() {
  return (
    <svg width="50" height="45" viewBox="0 0 50 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="12" width="34" height="25" rx="4" fill="#D4A574" />
      <line x1="15" y1="12" x2="15" y2="37" stroke="#8B6914" strokeWidth="1.5" opacity="0.5" />
      <line x1="25" y1="12" x2="25" y2="37" stroke="#8B6914" strokeWidth="1.5" opacity="0.5" />
      <line x1="35" y1="12" x2="35" y2="37" stroke="#8B6914" strokeWidth="1.5" opacity="0.5" />
    </svg>
  )
}

export function ChocolateSVG() {
  return (
    <svg width="45" height="50" viewBox="0 0 45 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="10" width="29" height="35" rx="2" fill="#6F4E37" />
      <rect x="12" y="14" width="5" height="5" fill="#8B6914" />
      <rect x="24" y="14" width="5" height="5" fill="#8B6914" />
      <rect x="18" y="24" width="5" height="5" fill="#8B6914" />
      <rect x="12" y="32" width="5" height="5" fill="#8B6914" />
      <rect x="24" y="32" width="5" height="5" fill="#8B6914" />
    </svg>
  )
}

export function BerrySVG() {
  return (
    <svg width="40" height="45" viewBox="0 0 40 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="28" r="12" fill="#C0392B" />
      <path d="M20 16C20 16 15 20 15 26C15 32 17 35 20 35C23 35 25 32 25 26C25 20 20 16 20 16Z" fill="#27AE60" />
      <circle cx="14" cy="25" r="2" fill="#A93226" opacity="0.7" />
    </svg>
  )
}

interface FloatingDecorationsProps {
  type: 'burger' | 'pizza' | 'breakfast' | 'dessert'
}

export function FloatingDecorations({ type }: FloatingDecorationsProps) {
  const getDecorations = () => {
    switch (type) {
      case 'burger':
        return (
          <>
            <div className="deco-1 absolute left-4 top-8">
              <TomatoSVG />
            </div>
            <div className="deco-2 absolute right-6 top-16">
              <BasilSVG />
            </div>
          </>
        )
      case 'pizza':
        return (
          <>
            <div className="deco-1 absolute left-6 top-6">
              <TomatoSVG />
            </div>
            <div className="deco-3 absolute right-4 top-12">
              <BasilSVG />
            </div>
          </>
        )
      case 'breakfast':
        return (
          <>
            <div className="deco-1 absolute left-5 top-10">
              <EggSVG />
            </div>
            <div className="deco-2 absolute right-5 top-8">
              <BreadSVG />
            </div>
          </>
        )
      case 'dessert':
        return (
          <>
            <div className="deco-1 absolute left-6 top-12">
              <ChocolateSVG />
            </div>
            <div className="deco-3 absolute right-4 top-6">
              <BerrySVG />
            </div>
          </>
        )
    }
  }

  return <div className="absolute inset-0">{getDecorations()}</div>
}

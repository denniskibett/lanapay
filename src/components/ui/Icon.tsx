import { BoltIcon, GlobeAltIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const icons = {
  BoltIcon,
  GlobeAltIcon,
  LockClosedIcon,
  // Add other icons here
}

export function Icon({
  name,
  className,
}: {
  name: keyof typeof icons
  className?: string
}) {
  const IconComponent = icons[name]
  return <IconComponent className={className} />
}
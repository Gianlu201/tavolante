import { avatarSrc } from '../lib/avatars'
import { labelInitials } from '../lib/settings'

type PlayerAvatarProps = {
  name: string
  avatarId: string | null
  /** Size, border and font size: the circle itself is the same everywhere. */
  className?: string
}

/** Ritratto rotondo di un giocatore fuori dal tavolo: personaggio o iniziali. */
export default function PlayerAvatar({ name, avatarId, className = '' }: PlayerAvatarProps) {
  const src = avatarSrc(avatarId)

  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full font-mono font-semibold text-cream ${
        src ? 'bg-black/25' : 'bg-cream/10'
      } ${className}`}
      aria-hidden="true"
    >
      {src ? (
        <img src={src} alt="" className="block size-full object-cover" draggable={false} />
      ) : (
        labelInitials(name)
      )}
    </span>
  )
}

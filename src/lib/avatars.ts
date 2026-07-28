export type Avatar = {
  id: string
  src: string
}

/**
 * Every image dropped into src/assets/avatars/ becomes an avatar — the file name
 * (without extension) is the id persisted in the settings, so renaming a file
 * detaches it from the players already using it.
 */
const files = import.meta.glob('../assets/avatars/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const ALL_AVATARS: Avatar[] = Object.entries(files)
  .map(([path, src]) => ({
    id: path.split('/').pop()!.replace(/\.[^.]+$/, ''),
    src,
  }))
  .sort((a, b) => a.id.localeCompare(b.id, 'it', { numeric: true }))

/**
 * Easter egg: these avatars are hidden from the picker and get assigned on their own
 * when a player is named after one of them.
 */
const EASTER_EGG_BY_NAME: Record<string, string> = {
  chiara: 'chiaraRucaj',
  genni: 'genniRucaj',
  gianluca: 'gianlucaDiDiego',
  ilaria: 'ilariaFranchi',
  mirko: 'mirkoGini',
  ranieri: 'ranieriMura',
}

const EASTER_EGG_IDS = new Set(Object.values(EASTER_EGG_BY_NAME))

/** Avatars offered in the drawer — the easter egg ones stay out of the grid. */
export const AVATARS: Avatar[] = ALL_AVATARS.filter(
  (avatar) => !EASTER_EGG_IDS.has(avatar.id),
)

export const avatarSrc = (avatarId: string | null) =>
  avatarId ? (ALL_AVATARS.find((avatar) => avatar.id === avatarId)?.src ?? null) : null

export const easterEggAvatar = (name: string): string | null =>
  EASTER_EGG_BY_NAME[name.trim().toLowerCase()] ?? null

export const isEasterEggAvatar = (avatarId: string | null) =>
  avatarId !== null && EASTER_EGG_IDS.has(avatarId)

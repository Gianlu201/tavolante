export type Avatar = {
  id: string;
  src: string;
};

/**
 * Every image dropped into src/assets/avatars/ becomes an avatar — the file name
 * (without extension) is the id persisted in the settings, so renaming a file
 * detaches it from the players already using it.
 */
const files = import.meta.glob('../assets/avatars/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const ALL_AVATARS: Avatar[] = Object.entries(files)
  .map(([path, src]) => ({
    id: path
      .split('/')
      .pop()!
      .replace(/\.[^.]+$/, ''),
    src,
  }))
  .sort((a, b) => a.id.localeCompare(b.id, 'it', { numeric: true }));

/**
 * Easter egg: these avatars stay out of the picker until a player is named after one
 * of them, and even then they are only appended at the end of the grid — they have to
 * be spotted and picked by hand, they are never assigned on their own.
 */
const EASTER_EGG_BY_NAME: Record<string, string> = {
  chiara: 'chiaraRucaj',
  genni: 'genniRucaj',
  gianluca: 'gianlucaDiDiego',
  ilaria: 'ilariaFranchi',
  lorenzo: 'lorenzoOrlandini',
  ludovica: 'ludovicaBorgogni',
  mirko: 'mirkoGini',
  ranieri: 'ranieriMura',
};

const EASTER_EGG_IDS = new Set(Object.values(EASTER_EGG_BY_NAME));

/** Avatars always offered in the drawer — the easter egg ones stay out of the grid. */
export const AVATARS: Avatar[] = ALL_AVATARS.filter(
  (avatar) => !EASTER_EGG_IDS.has(avatar.id),
);

const findAvatar = (avatarId: string | null): Avatar | null =>
  avatarId
    ? (ALL_AVATARS.find((avatar) => avatar.id === avatarId) ?? null)
    : null;

export const avatarSrc = (avatarId: string | null) =>
  findAvatar(avatarId)?.src ?? null;

/**
 * The grid shown for one player: the shared avatars, then the easter egg unlocked by
 * their name. The one already picked stays in the list too, so a later rename does not
 * make the current selection disappear from the grid.
 */
export const avatarChoices = (
  name: string,
  selectedId: string | null,
): Avatar[] => {
  const unlocked = [
    EASTER_EGG_BY_NAME[name.trim().toLowerCase()],
    selectedId,
  ].filter(
    (id): id is string =>
      id !== undefined && id !== null && EASTER_EGG_IDS.has(id),
  );

  const extras = [...new Set(unlocked)]
    .map(findAvatar)
    .filter((avatar): avatar is Avatar => avatar !== null);

  return extras.length > 0 ? [...AVATARS, ...extras] : AVATARS;
};

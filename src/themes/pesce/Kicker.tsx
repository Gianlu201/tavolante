/** «Tavolante · Briscola», poi la parola viene barrata e corretta: è il primo d'aprile. */
export default function AprilFoolsKicker() {
  return (
    <>
      Tavolante ·{' '}
      <span className="inline-grid justify-items-center">
        <span
          className="col-start-1 row-start-1 animate-briscola-out line-through motion-reduce:hidden"
          aria-hidden="true"
        >
          Briscola
        </span>
        <span className="col-start-1 row-start-1 animate-murlan-in motion-reduce:animate-none">
          Murlan
        </span>
      </span>{' '}
      🐟
    </>
  )
}

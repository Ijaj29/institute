import loginIllustration from '@/assets/login-illustration.png';

const INDEX_ENTRIES = [
  { code: 'ADM', label: 'Admissions & enrollment' },
  { code: 'ACD', label: 'Academics & timetables' },
  { code: 'FEE', label: 'Fees & finance' },
  { code: 'ATT', label: 'Attendance & records' },
];

export function BrandPanel() {
  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-ink-700 px-12 py-12 text-paper lg:flex">
      {/* subtle ledger-line texture */}
      <div className="pointer-events-none absolute inset-0 bg-ledger-lines opacity-[0.08]" />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brass/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brass/60 font-display text-lg">
          M
        </span>
        <div>
          <p className="font-display text-lg leading-none">Meridian Institute</p>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-100/70">Campus Portal</p>
        </div>
      </div>

      <div className="relative z-10">
        <p className="font-display text-[2.75rem] leading-[1.1] text-paper">
          Every record,
          <br />
          one register.
        </p>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-100/80">
          Sign in to manage admissions, attendance, fees and faculty schedules from a single,
          dependable ledger built for your institute.
        </p>

        <img
          src={loginIllustration}
          alt="Illustration of a staff member working at a desk with a computer"
          className="mt-8 w-full max-w-md select-none"
          draggable={false}
        />
      </div>

      {/* Signature element: card-catalog index rail */}
      <div className="relative z-10 border-t border-paper/15 pt-6">
        <p className="mb-3 text-[11px] uppercase tracking-[0.25em] text-ink-100/60">
          Index of modules
        </p>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
          {INDEX_ENTRIES.map((entry) => (
            <li key={entry.code} className="flex items-baseline gap-2 text-sm">
              <span className="font-display text-brass">{entry.code}</span>
              <span className="text-ink-100/75">{entry.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom'

export function About() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">אודות</h1>
        <Link
          to="/"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 hover:bg-slate-50"
        >
          חזרה
        </Link>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 text-slate-800 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">סימולציה: “התחל סימולציה”</h2>
          <p className="text-sm text-slate-700">
            הסימולציה מתחילה ב־60% נפח, עולה ל־75% תוך ~10 שניות ומציגה התראת
            קיבולת. המשתמש נדרש לפתוח “שירותים קרובים” ולחזור, ואז הסימולציה
            ממשיכה ל־85% תוך ~7.5 שניות, מציגה התראת ריקון אוטומטי ומרוקנת את
            השלפוחית ל־10–20% לאחר 10 שניות. במהלך הסימולציה כפתור “אישור” חסום
            עד שלב השירותים.
          </p>
          <p className="text-sm text-slate-700">
            Simulation (English): Starts at 60%, ramps to 75% in ~10s and shows a
            capacity alert. User must open “Nearby Restrooms” and return; then it
            ramps to 85% in ~7.5s, shows an auto-empty alert, waits 10s, and empties
            to ~10–20%. The OK button is disabled until the restroom step.
          </p>
          <p className="text-xs text-red-600">
            סימולציה להדגמה בלבד; אינה כלי רפואי או אבחנתי. / Simulation only; not
            a medical device.
          </p>
        </section>
      </div>
    </div>
  )
}


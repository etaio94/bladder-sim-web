type Props = {
  title: string
  body: string
  onClose?: () => void
  actions: React.ReactNode
}

export function Modal({ title, body, actions }: Props) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-700">{body}</p>
        <div className="mt-4 flex flex-wrap gap-2 justify-end">{actions}</div>
      </div>
    </div>
  )
}


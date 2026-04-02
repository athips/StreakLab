import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type ToastCtx = { show: (msg: string) => void }

const ToastContext = createContext<ToastCtx | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState('')
  const [visible, setVisible] = useState(false)

  const show = useCallback((m: string) => {
    setMsg(m)
    setVisible(true)
    window.setTimeout(() => setVisible(false), 2200)
  }, [])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className={`pointer-events-none fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] left-1/2 z-[9999] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#58CC02] px-5 py-2.5 font-display text-sm font-black text-white shadow-[0_4px_20px_rgba(88,204,2,0.4)] transition-[opacity,transform] duration-300 md:bottom-10 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        role="status"
      >
        {msg}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

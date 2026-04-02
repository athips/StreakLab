/* eslint react-refresh/only-export-components: off */
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
      <div id="toast" className={`toast ${visible ? 'show' : ''}`} role="status">
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

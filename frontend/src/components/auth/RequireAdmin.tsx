import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsAdmin(false)
        return
      }
      const { data } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', user.id)
        .single()
      setIsAdmin(!!data)
    }
    checkAdmin()
  }, [])

  if (isAdmin === null) return <div>Carregando...</div>
  if (!isAdmin) return <Navigate to="/admin/login" replace />

  return <>{children}</>
}

import { create } from 'zustand'
import { authClient } from '@/lib/auth-client'
import { UserPermissionStoreState } from '@/utils/types'

export const userPermissionStore = create<UserPermissionStoreState>(set => ({
  hasPermission: false,
  loading: true,
  checkPermission: async () => {
    try {
      const { data } = await authClient.getSession()
      if (data?.user.role == 'admin') {
        set({ hasPermission: true, loading: false })
      } else {
        set({ hasPermission: false, loading: false })
      }
    } catch {
      set({ hasPermission: false, loading: false })
    }
  },
}))

import { UserJWTPayload } from '@/utils/jwt'
import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'

interface UserState {
    user: UserJWTPayload | undefined
    setUser: (user: UserJWTPayload | undefined) => void
}

const useUserStore = create<UserState>()(
    devtools(
        persist(
            (set, get) => ({
                user: undefined,
                setUser: (user) => set((state) => ({ user })),
            }),
            {
                name: 'user-storage', // unique name
                storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
            }
        )
    )
)

export { useUserStore }
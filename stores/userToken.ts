import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'

export type Breadcrumbs = Array<{ title: string, href: string }>

interface UserTokenState {
    token: string
    setToken: (token: string) => void
}

const useUserTokenStore = create<UserTokenState>()(
    devtools(
        persist(
            (set, get) => ({
                token: '',
                setToken: (token) => set((state) => ({ token })),
            }),
            {
                name: 'user-token-storage', // unique name
                // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
            }
        )
    )
)

export { useUserTokenStore }
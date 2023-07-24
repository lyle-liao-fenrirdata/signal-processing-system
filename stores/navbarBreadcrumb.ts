import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'

export type Breadcrumbs = Array<{ title: string, href: string }>

interface NavbarBreadcrumbState {
    breadcrumbs: Breadcrumbs
    setBreadcrumbs: (breadcrumb: Breadcrumbs) => void
}

const useNavbarBreadcrumbStore = create<NavbarBreadcrumbState>()(
    devtools(
        persist(
            (set, get) => ({
                breadcrumbs: [],
                setBreadcrumbs: (breadcrumbs) => set((state) => ({ breadcrumbs })),
            }),
            {
                name: 'navbar-breadcrumb-storage', // unique name
                storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
            }
        )
    )
)

export { useNavbarBreadcrumbStore }
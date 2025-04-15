import {create} from 'zustand'
import {persist, createJSONStorage} from 'zustand/middleware'

type SidebarStatus = {
    sidebarOpen : boolean;
    setSideBarOpen : (status : boolean) => void;
}

export const useSidebarStatus = create<SidebarStatus>()(
    persist(
        set => ({
        sidebarOpen: true,
        setSideBarOpen: status => set({sidebarOpen : status})
        }),
        {
            name : 'sidebar-open-status',
            storage :createJSONStorage(() => localStorage) 
        }
    )
);
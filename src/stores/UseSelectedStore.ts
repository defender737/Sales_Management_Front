import {create} from 'zustand'
import {persist, createJSONStorage} from 'zustand/middleware'

type StoreState = {
    selectedStoreId : number | null;
    setSelectedStoreId : (id : number) => void;
}

export const useSelectedStore = create<StoreState>()(
    persist(
        set => ({
        selectedStoreId: null,
        setSelectedStoreId: id => set({selectedStoreId : id})
        }),
        {
            name : 'selected-store-id',
            storage :createJSONStorage(() => localStorage) 
        }
    )
);
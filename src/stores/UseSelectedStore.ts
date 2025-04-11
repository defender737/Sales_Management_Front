import {create} from 'zustand'

type StoreState = {
    selectedStoreId : number | null;
    setSelectedStoreId : (id : number) => void;
}

export const useSelectedStore = create<StoreState>( set => ({
    selectedStoreId: null,
    setSelectedStoreId: id => set({selectedStoreId : id})
}));
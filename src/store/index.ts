import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface GlobalState {
    expandedPlayer :boolean;
    setExpendPlayer: (expanded: boolean) => void;
}

const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      (set) => ({
        expandedPlayer: false,
        setExpendPlayer: (expanded) => set({ expandedPlayer: expanded }),
      }),
      {
        name: 'global-storage',
      },
    ),
  ),
)

export default useGlobalStore;



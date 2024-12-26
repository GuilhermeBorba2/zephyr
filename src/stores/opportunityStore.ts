import { create } from 'zustand';
import type { Opportunity } from '../types/database.types';

interface OpportunityStore {
  opportunities: Opportunity[];
  setOpportunities: (opportunities: Opportunity[]) => void;
  addOpportunity: (opportunity: Opportunity) => void;
  updateOpportunity: (id: string, opportunity: Partial<Opportunity>) => void;
  removeOpportunity: (id: string) => void;
}

export const useOpportunityStore = create<OpportunityStore>((set) => ({
  opportunities: [],
  setOpportunities: (opportunities) => set({ opportunities }),
  addOpportunity: (opportunity) =>
    set((state) => ({
      opportunities: [...state.opportunities, opportunity],
    })),
  updateOpportunity: (id, opportunity) =>
    set((state) => ({
      opportunities: state.opportunities.map((opp) =>
        opp.id === id ? { ...opp, ...opportunity } : opp
      ),
    })),
  removeOpportunity: (id) =>
    set((state) => ({
      opportunities: state.opportunities.filter((opp) => opp.id !== id),
    })),
}));
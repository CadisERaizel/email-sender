import { create } from "zustand";
import { addNewCompany, getCompaniesList } from "../apis/apis";

export const useCompaniesStore = create((set) => ({
  companiesList: [],
  selectedCompany : null,

  fetchList: async () => {
    const companies = await getCompaniesList();

    set({
      companiesList: companies,
    });
  },

  addCompany: async (company) => {
    const response = await addNewCompany(company);
    if (response !== 500) {
      useCompaniesStore.getState().fetchList();
      return 200
    }else {
        return response;
    }
  },

  setSelectedCompany: (index) => {
    set({
        selectedCompany: useCompaniesStore.getState().companiesList[index]
    })
  }

}));

import { create } from "zustand";
import { getEmailTemplatesList } from "../apis/apis";


export const useTemplateStore = create((set) => ({
    templateList: [],

    fetchList: async () => {
        const templates = await getEmailTemplatesList();

        set({
            templateList: templates
        });
    },
}));

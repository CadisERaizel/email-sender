import { create } from "zustand";
import { getOpenedMails } from "../apis/apis";


export const useEmailStore = create((set) => ({
    emailsOpenedList: [],

    fetchOpenedList: async () => {
        const emailsOpened = await getOpenedMails();

        set({
            emailsOpenedList: emailsOpened
        });
    },
}));

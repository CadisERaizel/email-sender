import { create } from "zustand";
import { getInbox, getDraft, getNextMessages } from "../apis/apis";

const useMailStore = create((set) => ({
  inbox: {
    mails: [],
    nextLink: "",
  },
  draft: {
    mails: [],
    nextLink: "",
  },
  sent: [],
  archive: [],
  junk: [],
  deleted: [],

  fetchInbox: async () => {
    const data = await getInbox();
    set({
      inbox: data,
    });
  },

  fetchDraft: async () => {
    const data = await getDraft();
    set({
      draft: data,
    });
  },

  fetchNextLink: async () =>{
    console.log(useMailStore.getState().inbox.nextLink);
    const data = await getNextMessages(useMailStore.getState().inbox.nextLink);
    set({
      inbox: {
        mails: [...useMailStore.getState().inbox.mails, ...data.mails],
        nextLink: data.nextLink
      },
    });
  },

  getMailData: (index) => {
    console.log(useMailStore.getState().inbox.mails[index])
    return useMailStore.getState().inbox.mails[index];
  }

}));

export default useMailStore;

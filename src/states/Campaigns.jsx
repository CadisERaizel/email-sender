import { create } from "zustand";
import { getCampaignList } from "../apis/apis";


export const useCampaignStore = create((set) => ({
    campaignList: [],

    fetchList: async () => {
        const campaigns = await getCampaignList();

        set({
            campaignList: campaigns
        });
    },
}));

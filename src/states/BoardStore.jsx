import { create } from 'zustand';

const useBoardStore = create((set) => ({
    board: {
        tasks: {
            "task-1": { id: "task-1", content: "Content for task 1" },
            "task-2": { id: "task-2", content: "Content for task-2" },
            "task-3": { id: "task-3", content: "Content for task-3" },
            "task-4": { id: "task-4", content: "Content for task-4" }
        },
        columns: {
            "column-1": { id: "column-1", title: "Lead Created", taskIds: ['task-1'] },
            "column-2": { id: "column-2", title: "Meeting Scheduled", taskIds: ['task-2', 'task-3'] },
            "column-3": { id: "column-3", title: "Meetings", taskIds: [] },
            "column-4": { id: "column-4", title: "Completed", taskIds: ["task-4"] }
        },
        columnOrder: ["column-1", "column-2", "column-3", "column-4"]
    },

    setBoard: (data) =>{
        set({
            board: data
        })
    },

    // Async function to fetch data from the backend
    // fetchData: async () => {
    //     try {
    //         const response = await fetch('your_backend_api_endpoint');
    //         const data = await response.json();

    //         // Update the Zustand store with the fetched data
    //         set({
    //             tasks: data.tasks,
    //             columns: data.columns,
    //             columnOrder: data.columnOrder,
    //         });
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // },

    // Other functions for manipulation can be added as needed

    // Reset the state to an empty state
    // resetState: () => set({ tasks: {}, columns: {}, columnOrder: [] }),

    // // Call the fetchData function when the store is initialized
    // onInitialize: async () => {
    //     await useBoardStore.fetchData();
    // },

    getBoard: () => {
        return useBoardStore.getState().board;
    },
}));

export default useBoardStore;


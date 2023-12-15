import React from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useBoardStore } from '../states/index'
import BoardColumn from '../components/BoardColumn';

const WhiteBoard = () => {
    const board = useBoardStore()
    const boardData = board.getBoard()
    const setBoardData = board.setBoard


    const onDragEnd = result => {
        const { destination, source, draggableId, type } = result;
        //If there is no destination
        if (!destination) { return }

        //If source and destination is the same
        if (destination.droppableId === source.droppableId && destination.index === source.index) { return }

        //If you're dragging columns
        if (type === 'column') {
            const newColumnOrder = Array.from(boardData.columnOrder);
            newColumnOrder.splice(source.index, 1);
            newColumnOrder.splice(destination.index, 0, draggableId);
            const newState = {
                ...boardData,
                columnOrder: newColumnOrder
            }
            setBoardData(newState)
            return;
        }

        //Anything below this happens if you're dragging tasks
        const start = boardData.columns[source.droppableId];
        const finish = boardData.columns[destination.droppableId];

        //If dropped inside the same column
        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);
            const newColumn = {
                ...start,
                taskIds: newTaskIds
            }
            const newState = {
                ...boardData,
                columns: {
                    ...boardData.columns,
                    [newColumn.id]: newColumn
                }
            }
            setBoardData(newState)
            return;
        }

        //If dropped in a different column
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
            ...start,
            taskIds: startTaskIds
        }

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds
        }

        const newState = {
            ...boardData,
            columns: {
                ...boardData.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish
            }
        }

        setBoardData(newState)
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='all-columns' direction='horizontal' type='column'>
                {(provided) => (
                    <div className='flex' {...provided.droppableProps} ref={provided.innerRef}>
                        {boardData.columnOrder.map((id, index) => {
                            const column = boardData.columns[id]
                            const tasks = column.taskIds.map(taskId => boardData.tasks[taskId])

                            return <BoardColumn key={column.id} column={column} tasks={tasks} index={index} />
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default WhiteBoard;

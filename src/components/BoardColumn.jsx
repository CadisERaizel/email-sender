// Board.js
import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import Card from './BoardCard';

const BoardColumn = (props) => {
    return (
        <Draggable key={props.column.id} draggableId={props.column.id} index={props.index}>
            {(provided) => (
                <div className={`m-[1rem] border rounded w-1/4 flex flex-col border-solid border-gray-300 bg-back-grey`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}>
                    <div className='py-[1rem] mx-[1rem]' {...provided.dragHandleProps}>{props.column.title}</div>
                    <Droppable droppableId={props.column.id} type='task'>
                        {(provided, snapshot) => (
                            <div className={`p-[1rem] h-full ${snapshot.isDraggingOver ? 'bg-[#d5f3ff]' : 'bg-[inherit]'}`}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {props.tasks.map((task, index) => <Card key={task.id} task={task} index={index} />)}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>

            )}
        </Draggable>
    );
};

export default BoardColumn;

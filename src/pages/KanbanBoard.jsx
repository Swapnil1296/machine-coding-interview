import React from "react";

const initialBoard = {
    columns: [
        {
            id: "todo",
            title: "Todo",
            taskIds: ["task-1", "task-2"],
        },
        {
            id: "progress",
            title: "In Progress",
            taskIds: ["task-3"],
        },
        {
            id: "done",
            title: "Done",
            taskIds: [],
        },
    ],

    tasks: {
        "task-1": {
            id: "task-1",
            title: "Build login page",
            description: "Implement authentication UI",
            priority: "high",
            status: "todo",
            dueDate: "2026-12-01",
            labels: ["Frontend"],
        },
        "task-2": {
            id: "task-2",
            title: "Login api Implementation",
            description: "Implement authentication UI",
            priority: "high",
            status: "todo",
            dueDate: "2026-12-01",
            labels: ["Backend"],
        },
        "task-3": {
            id: "task-3",
            title: "Implement page sanitization",
            description: "Implement authentication UI",
            priority: "high",
            status: "todo",
            dueDate: "2026-12-01",
            labels: ["Frontend"],
        },
    },
};
const tags = [
    { label: "TO DO", key: "todo" },
    { label: "IN PROGRESS", key: "inprogress" },
    { label: "IN REVIEW", key: "inreview" },
    { label: "DONE", key: "done" },
];
const KanbanBoard = () => {
    return (
        <div className="container">
            {tags.map((tag) => (
                <div>
                    <BoardHeader key={tag.key} className={tag.key} label={tag.label} />
                    <BoardColumn />
                </div>
            ))}
        </div>
    );
};
const BoardColumn = () => {
    return <div className="board"><TaskCard /></div>
};
const TaskCard = () => {
    return <>
        <div className="task_card">
            <div className="task_first">  <span>Frontend API integration</span>
                <div className="task_label">
                    <span >Fronted</span>
                </div>
            </div>
            <div className="task_second">
                <span className="task_status">TO DO</span>
                <div className="task_priority"><span >High</span></div>

            </div>
        </div>
        <div className="task_card">
            <div className="task_first">  <span>Frontend API integration</span>
                <div className="task_label">
                    <span >Fronted</span>
                </div>
            </div>
            <div className="task_second">
                <span className="task_status">TO DO</span>
                <span >Due: 27/11/2026</span>
                <div className="task_priority"><span >High</span></div>

            </div>
        </div>;
    </>
};
const TaskForm = () => {
    return <div>TaskForm</div>;
};
const TaskModal = () => {
    return <div>TaskModal</div>;
};
const SearchFilter = () => {
    return <div>SearchFilter</div>;
};
const BoardHeader = ({ className, label }) => (
    <div className={`board_column ${className}`}>
        <div className="column_container">
            <div>
                <span>{label}</span>
            </div >
            <div>
                <button>+</button>
            </div >
            <div className="priority_filter">
                <select >
                    <option value="">Select</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>
        </div>
    </div>
);
export default KanbanBoard;

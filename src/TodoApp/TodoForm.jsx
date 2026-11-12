import React, { useEffect, useState } from "react";

const TodoForm = () => {
    const [alltasks, setAllTasks] = useState(() => {
        return JSON.parse(localStorage.getItem("tasks")) || [];
    });
    const [task, setTask] = useState("");

    const [taskVisibility, setTaskVisibility] = useState("all");

    const saveTask = (event) => {
        event.preventDefault();
        setTask(event.target.value);
    };

    const hadleTaskSave = (event) => {
        event.preventDefault();
        const randomId = Math.random().toString(36).substring(2, 12);
        const newTask = {
            task: task,
            id: randomId,
            status: "active",
        };
        setAllTasks((prev) => [...prev, newTask]);
        setTask("");
    };
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(alltasks));
    }, [alltasks]);


    return (
        <div className="container">
            <div className="header">Todos</div>
            <div className="form_div">
                <input
                    type="text"
                    className="input_box"
                    placeholder="What you want to do ?"
                    value={task}
                    onChange={(e) => saveTask(e)}
                />
                <button onClick={(e) => hadleTaskSave(e)}>+</button>
            </div>
            <TodoStatus
                taskVisibility={taskVisibility}
                setTaskVisibility={setTaskVisibility}
            />
            <TodoList alltasks={alltasks} setAllTasks={setAllTasks} taskVisibility={taskVisibility} />
        </div>
    );
};

export default TodoForm;

export const TodoStatus = ({ setTaskVisibility }) => {
    return (
        <div className="todo_status">
            <button onClick={() => setTaskVisibility("all")}>All</button>
            <button onClick={() => setTaskVisibility("active")}>Active</button>
            <button onClick={() => setTaskVisibility("completed")}>Completed</button>
        </div>
    );
};

export const TodoList = ({ alltasks, setAllTasks, taskVisibility }) => {
    
  const handleMarkComplete = (taskId) => {
    const newTasks = alltasks.map((item) => {
        if (item.id === taskId) {
            return {
                ...item,
                status: "completed"
            };
        }

        return item;
    });

    setAllTasks(newTasks);
};
    const handleDeleteTask = (taskId) => {
        const updatedTasks = alltasks.filter((items) => items.id !== taskId);

        setAllTasks(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    };
     const filteredTask = alltasks.filter((item) => {
        if (taskVisibility === "active") {
            return item.status === "active";
        }

        if (taskVisibility === "completed") {
            return item.status === "completed";
        }

        return true;
    });
    console.log("filteredTask", filteredTask)
    return (
        <>
            {filteredTask?.map((items, index) => (
                <div className="todo_list_items" key={items?.id}>
                    <div>{index + 1}</div>
                    <div className="task">{items?.task}</div>
                    <div className="status">{items?.status}</div>
                    <div className="edit_tasks">
                        {items?.status==='active' && <button onClick={() => handleMarkComplete(items?.id)}>Mark Complete</button>}
                        <button onClick={() => handleDeleteTask(items?.id)}>Delete</button>
                    </div>
                </div>
            ))}
        </>
    );
};




// optimize version *****************************************************





// Main Todo component.
// const TodoForm = () => {
//     // Store all tasks in React state.
//     const [alltasks, setAllTasks] = useState([]);

//     // Store the current input value.
//     const [task, setTask] = useState("");

//     // Store the currently selected filter.
//     const [taskVisibility, setTaskVisibility] = useState("all");

//     // Store the ID of the task currently being edited.
//     const [editingTaskId, setEditingTaskId] = useState(null);

//     // Store the updated task text while editing.
//     const [editValue, setEditValue] = useState("");

//     // Store validation error messages.
//     const [error, setError] = useState("");

//     // Track whether localStorage has been loaded.
//     const [isLoaded, setIsLoaded] = useState(false);

//     // Load tasks from localStorage after the component mounts.
//     useEffect(() => {
//         try {
//             // Read previously saved tasks from localStorage.
//             const savedTasks = localStorage.getItem("tasks");

//             // Parse saved tasks or use an empty array.
//             const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];

//             // Make sure the parsed data is an array.
//             setAllTasks(Array.isArray(parsedTasks) ? parsedTasks : []);
//         } catch (error) {
//             // Handle invalid JSON or localStorage errors.
//             console.error("Unable to load tasks:", error);

//             // Start with an empty task list.
//             setAllTasks([]);
//         } finally {
//             // Mark localStorage initialization as complete.
//             setIsLoaded(true);
//         }
//     }, []);

//     // Persist tasks whenever the task list changes.
//     useEffect(() => {
//         // Avoid overwriting localStorage before initial loading finishes.
//         if (!isLoaded) return;

//         try {
//             // Convert the task array into JSON and save it.
//             localStorage.setItem("tasks", JSON.stringify(alltasks));
//         } catch (error) {
//             // Handle storage quota or browser storage errors.
//             console.error("Unable to save tasks:", error);
//         }
//     }, [alltasks, isLoaded]);

//     // Handle changes in the new-task input.
//     const handleTaskChange = (event) => {
//         // Update the input state with the latest value.
//         setTask(event.target.value);

//         // Clear any previous validation error.
//         setError("");
//     };

//     // Handle adding a new task.
//     const handleTaskSave = (event) => {
//         // Prevent the browser from submitting and refreshing the page.
//         event.preventDefault();

//         // Remove unnecessary spaces from the task.
//         const trimmedTask = task.trim();

//         // Prevent empty tasks from being added.
//         if (!trimmedTask) {
//             setError("Task cannot be empty.");
//             return;
//         }

//         // Generate a unique ID for the new task.
//         const randomId = crypto.randomUUID();

//         // Create a new task object.
//         const newTask = {
//             id: randomId,
//             task: trimmedTask,
//             status: "active",
//         };

//         // Add the new task without mutating existing state.
//         setAllTasks((prevTasks) => [...prevTasks, newTask]);

//         // Reset the input field.
//         setTask("");

//         // Clear any validation error.
//         setError("");
//     };

//     // Toggle a task between active and completed.
//     const handleMarkComplete = (taskId) => {
//         // Create a new array using the previous state.
//         setAllTasks((prevTasks) =>
//             prevTasks.map((item) => {
//                 // Check whether the current task matches the selected ID.
//                 if (item.id === taskId) {
//                     // Return a new task object with the opposite status.
//                     return {
//                         ...item,
//                         status: item.status === "active" ? "completed" : "active",
//                     };
//                 }

//                 // Return unchanged tasks.
//                 return item;
//             })
//         );
//     };

//     // Handle deleting a task.
//     const handleDeleteTask = (taskId) => {
//         // Remove the task whose ID matches the selected ID.
//         setAllTasks((prevTasks) =>
//             prevTasks.filter((item) => item.id !== taskId)
//         );

//         // Exit edit mode if the deleted task was being edited.
//         if (editingTaskId === taskId) {
//             setEditingTaskId(null);
//             setEditValue("");
//         }
//     };

//     // Start editing an existing task.
//     const handleEditStart = (item) => {
//         // Store the ID of the selected task.
//         setEditingTaskId(item.id);

//         // Populate the edit input with the existing task text.
//         setEditValue(item.task);

//         // Clear previous validation errors.
//         setError("");
//     };

//     // Save changes made to an existing task.
//     const handleEditSave = (event, taskId) => {
//         // Prevent the form from refreshing the page.
//         event.preventDefault();

//         // Remove leading and trailing spaces.
//         const trimmedValue = editValue.trim();

//         // Prevent saving an empty task.
//         if (!trimmedValue) {
//             setError("Task cannot be empty.");
//             return;
//         }

//         // Update only the matching task.
//         setAllTasks((prevTasks) =>
//             prevTasks.map((item) =>
//                 item.id === taskId
//                     ? { ...item, task: trimmedValue }
//                     : item
//             )
//         );

//         // Exit edit mode.
//         setEditingTaskId(null);

//         // Reset the edit input.
//         setEditValue("");

//         // Clear validation errors.
//         setError("");
//     };

//     // Calculate the total number of tasks.
//     const totalTasks = alltasks.length;

//     // Calculate the number of completed tasks.
//     const completedTasks = alltasks.filter(
//         (item) => item.status === "completed"
//     ).length;

//     // Calculate the number of active tasks.
//     const activeTasks = totalTasks - completedTasks;

//     // Filter tasks based on the selected visibility option.
//     const filteredTasks = alltasks.filter((item) => {
//         // Show all tasks when the All filter is selected.
//         if (taskVisibility === "all") return true;

//         // Show only active tasks when Active is selected.
//         if (taskVisibility === "active") {
//             return item.status === "active";
//         }

//         // Show only completed tasks when Completed is selected.
//         if (taskVisibility === "completed") {
//             return item.status === "completed";
//         }

//         // Return false for any unsupported filter.
//         return false;
//     });

//     // Render the Todo application.
//     return (
//         <div className="container">
//             {/* Application heading. */}
//             <h1 className="header">Todos</h1>

//             {/* Form for creating new tasks. */}
//             <form className="form_div" onSubmit={handleTaskSave}>
//                 {/* Input field for entering a new task. */}
//                 <input
//                     type="text"
//                     className="input_box"
//                     placeholder="What do you want to do?"
//                     value={task}
//                     onChange={handleTaskChange}
//                     aria-label="New task"
//                 />

//                 {/* Submit button for creating a task. */}
//                 <button type="submit">+</button>
//             </form>

//             {/* Display validation errors when present. */}
//             {error && <p role="alert">{error}</p>}

//             {/* Display task statistics. */}
//             <TodoStats
//                 totalTasks={totalTasks}
//                 activeTasks={activeTasks}
//                 completedTasks={completedTasks}
//             />

//             {/* Render task filtering buttons. */}
//             <TodoStatus
//                 taskVisibility={taskVisibility}
//                 setTaskVisibility={setTaskVisibility}
//             />

//             {/* Render the filtered task list. */}
//             <TodoList
//                 alltasks={filteredTasks}
//                 onMarkComplete={handleMarkComplete}
//                 onDeleteTask={handleDeleteTask}
//                 onEditStart={handleEditStart}
//                 onEditSave={handleEditSave}
//                 editingTaskId={editingTaskId}
//                 editValue={editValue}
//                 setEditValue={setEditValue}
//                 error={error}
//             />

//             {/* Display a message when no tasks match the filter. */}
//             {filteredTasks.length === 0 && (
//                 <p>No tasks found.</p>
//             )}
//         </div>
//     );
// };

// // Component responsible for displaying task statistics.
// export const TodoStats = ({
//     totalTasks,
//     activeTasks,
//     completedTasks,
// }) => {
//     // Render the task statistics.
//     return (
//         <div className="todo_stats">
//             {/* Display total tasks. */}
//             <span>Total: {totalTasks}</span>

//             {/* Display active tasks. */}
//             <span>Pending: {activeTasks}</span>

//             {/* Display completed tasks. */}
//             <span>Completed: {completedTasks}</span>
//         </div>
//     );
// };

// // Component responsible for task filtering.
// export const TodoStatus = ({
//     taskVisibility,
//     setTaskVisibility,
// }) => {
//     // Define the available filters.
//     const filters = ["all", "active", "completed"];

//     // Render filter buttons.
//     return (
//         <div className="todo_status">
//             {/* Generate one button for every filter. */}
//             {filters.map((filter) => (
//                 <button
//                     key={filter}
//                     type="button"
//                     onClick={() => setTaskVisibility(filter)}
//                     aria-pressed={taskVisibility === filter}
//                 >
//                     {/* Capitalize the filter label. */}
//                     {filter.charAt(0).toUpperCase() + filter.slice(1)}
//                 </button>
//             ))}
//         </div>
//     );
// };

// // Component responsible for rendering individual tasks.
// export const TodoList = ({
//     alltasks,
//     onMarkComplete,
//     onDeleteTask,
//     onEditStart,
//     onEditSave,
//     editingTaskId,
//     editValue,
//     setEditValue,
// }) => {
//     // Render the list of tasks.
//     return (
//         <div className="todo_list">
//             {/* Iterate through all filtered tasks. */}
//             {alltasks.map((item, index) => (
//                 // Use the unique task ID as the React key.
//                 <div className="todo_list_items" key={item.id}>
//                     {/* Display the task's position. */}
//                     <div>{index + 1}</div>

//                     {/* Check whether the current task is being edited. */}
//                     {editingTaskId === item.id ? (
//                         // Display an edit form for the selected task.
//                         <form onSubmit={(event) => onEditSave(event, item.id)}>
//                             {/* Controlled input for editing task text. */}
//                             <input
//                                 type="text"
//                                 value={editValue}
//                                 onChange={(event) =>
//                                     setEditValue(event.target.value)
//                                 }
//                                 aria-label="Edit task"
//                                 autoFocus
//                             />

//                             {/* Save the edited task. */}
//                             <button type="submit">Save</button>

//                             {/* Cancel editing without changing the task. */}
//                             <button
//                                 type="button"
//                                 onClick={() => onEditStart(null)}
//                             >
//                                 Cancel
//                             </button>
//                         </form>
//                     ) : (
//                         // Display the task text when not editing.
//                         <div className="task">{item.task}</div>
//                     )}

//                     {/* Display the current task status. */}
//                     <div className="status">{item.status}</div>

//                     {/* Render task action buttons. */}
//                     <div className="edit_tasks">
//                         {/* Toggle task completion status. */}
//                         <button
//                             type="button"
//                             onClick={() => onMarkComplete(item.id)}
//                         >
//                             {item.status === "active"
//                                 ? "Mark Complete"
//                                 : "Mark Active"}
//                         </button>

//                         {/* Allow editing only when not already editing. */}
//                         {editingTaskId !== item.id && (
//                             <button
//                                 type="button"
//                                 onClick={() => onEditStart(item)}
//                             >
//                                 Edit
//                             </button>
//                         )}

//                         {/* Delete the selected task. */}
//                         <button
//                             type="button"
//                             onClick={() => onDeleteTask(item.id)}
//                         >
//                             Delete
//                         </button>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// // Export the main Todo component.
// export default TodoForm;

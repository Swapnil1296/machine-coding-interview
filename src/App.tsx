
import './App.css'
import KanbanBoard from './pages/KanbanBoard'
// 1. Problem statement
// Build a Kanban task management application similar to Trello or Jira.

// Users should be able to create tasks, organize them into columns, move tasks between columns using drag and drop, edit task details, and delete tasks.
// 2. Functional requirements
// A. Board structure

// Create three default columns:
// 1. Todo
// 2. In Progress
// 3. Done
// Each column should display its title, task count, and task cards.

// B. Task management

// Users should be able to:
// - Create a task.
// - Edit an existing task.
// - Delete a task.
// - Assign a priority: Low, Medium, High.
// - Add a description.
// - Set a due date.
// - Add labels/tags.
// C. Drag and drop
// - Drag a task from one column to another.
// - Reorder tasks within the same column.
// - Update the task's status after moving it.
// - Show a visual indication of the drop target.
// - Prevent invalid drop operations.
// Use the native HTML Drag and Drop API. Don't use a drag-and-drop library.

// D. Search and filtering
// - Search tasks by title.
// - Filter by priority.
// - Filter by status.
// - Search and filtering should work together.
// E. Persistence
// - Save board data in localStorage.
// - Restore the board after refreshing.
// - Keep task IDs stable.

// 6. Edge cases
// 1. Drag a task into its existing position.
// 2. Move a task from Todo directly to Done.
// 3. Delete a task while filters are active.
// 4. Edit a task while searching.
// 5. Search returns no matching tasks.
// 6. Refresh the page after moving tasks.
// 7. Prevent duplicate task IDs.
// 8. Handle a task with no due date.
// 9. Move tasks when a column contains no tasks.
// 10. Ensure filtering doesn't accidentally change the underlying board data.
function App() {

  return (
    <>
    <KanbanBoard/>
    </>
  )
}

export default App

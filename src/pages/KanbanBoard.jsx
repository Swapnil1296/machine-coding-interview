import React, { useMemo, useReducer } from "react";

const initialBoard = {
  columns: [
    { label: "TO DO", id: "todo", taskIds: ["task-1", "task-2"] },
    { label: "IN PROGRESS", id: "inprogress", taskIds: ["task-3"] },
    { label: "IN REVIEW", id: "inreview", taskIds: [] },
    { label: "DONE", id: "done", taskIds: [] },
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
      priority: "low",
      status: "todo",
      dueDate: "2026-12-01",
      labels: ["Backend"],
    },
    "task-3": {
      id: "task-3",
      title: "Implement page sanitization",
      description: "Implement authentication UI",
      priority: "high",
      status: "inprogress",
      dueDate: "2026-12-01",
      labels: ["Frontend"],
    },
  },
};
const initialFilters = {
  search: "", // free-text on title/description
  priority: [], // ["high", "low"]
  status: [], // ["todo", "done"]  (column ids)
  labels: [], // ["Frontend", "Backend"]
  dueDate: null, // "2026-12-01" (exact date)
};

// The priorities a task can have. `value` is what is stored on the task,
// `label` is what the user sees.
const PRIORITY_OPTIONS = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];
const initialState = {
  board: initialBoard,
  filters: initialFilters,
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TASK":
      return { ...state };
    case "CHANGE_TASK_STATUS":
      return { ...state };
    case "DELET_TASK":
      return { ...state };
    case "UPDATE_TASK":
      return { ...state };
    // ------- filter actions -------
    case "SET_FILTER":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case "TOGGLE_FILTER_VALUE": {
      const { key, value } = action.payload; // key = "priority" | "status" | "labels"
      const current = state.filters[key];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return {
        ...state,
        filters: { ...state.filters, [key]: next },
      };
    }
    case "RESET_FILTERS":
      return { ...state, filters: initialFilters };
    default:
      return state;
  }
};
function filterBoard(board, filters) {
  const { search = "", priority = [], status = [], labels = [], dueDate = null } = filters;

  // A task must pass EVERY filter below to be shown, so the filters work together.
  const matches = (task) => {
    // 1. Text search on title + description.
    //    trim() so a search of just spaces does not hide everything.
    //    `?? ""` because a task may have no description (it would print "undefined").
    const q = search.trim().toLowerCase();
    if (q) {
      const haystack = `${task.title ?? ""} ${task.description ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    // 2. Priority (empty array = no filter)
    if (priority.length && !priority.includes(task.priority)) return false;

    // 3. Status (empty array = no filter)
    if (status.length && !status.includes(task.status)) return false;

    // 4. Labels — match if task has ANY of the selected labels
    //    (change to `.every` if you want ALL)
    //    `?? []` because a task may have no labels.
    const taskLabels = task.labels ?? [];
    if (labels.length && !labels.some((l) => taskLabels.includes(l))) return false;

    // 5. Due date (exact match). A task with no due date never matches a chosen date.
    if (dueDate && task.dueDate !== dueDate) return false;

    return true;
  };

  // Filter tasks map, keep only matching ones
  const filteredTasks = Object.fromEntries(
    Object.entries(board.tasks).filter(([, task]) => matches(task))
  );

  // Rebuild column taskIds so they only reference surviving tasks
  const columns = board.columns.map((col) => ({
    ...col,
    taskIds: col.taskIds.filter((id) => filteredTasks[id]),
  }));

  return { columns, tasks: filteredTasks };
}

const KanbanBoard = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { board, filters } = state;
      // Only recompute when board or filters change
  const visibleBoard = useMemo(
    () => filterBoard(state.board, state.filters),
    [state.board, state.filters]
    );

  // The filter checkboxes are built from the FULL board (not the filtered one),
  // otherwise a label would disappear from the list as soon as it is filtered out.
  const labelOptions = useMemo(() => {
    const allLabels = Object.values(board.tasks).flatMap((task) => task.labels ?? []);
    return [...new Set(allLabels)].map((label) => ({ value: label, label }));
  }, [board.tasks]);
  const statusOptions = board.columns.map((column) => ({
    value: column.id,
    label: column.label,
  }));

  const visibleTaskCount = Object.keys(visibleBoard.tasks).length;

    return (
        <>
            <FilterOptions
              filters={filters}
              dispatch={dispatch}
              labelOptions={labelOptions}
              statusOptions={statusOptions}
            />
      {visibleTaskCount === 0 && (
        <p className="board_empty">No tasks match your filters.</p>
      )}
      <div className="container">
           
      {visibleBoard.columns.map((column) => {
        // A column only stores task ids, so look up the full task for each id.
        // Use the filtered tasks, so the cards always match the filters.
        const tasks = column.taskIds.map((taskId) => visibleBoard.tasks[taskId]);

        return (
          <div key={column.id}>
            <BoardHeader
              className={column.id}
              label={column.label}
              count={tasks.length}
            />
            {tasks.length > 0 ? (
              <BoardColumn tasks={tasks} statusLabel={column.label} />
            ) : null}
          </div>
        );
      })}
    </div> </>
  );
};
const FilterOptions = ({ filters, dispatch, labelOptions, statusOptions }) => {
  return (
    <div className="priority_filter_container">
      <div className="priority_filter">
        <div className="filter_search">
          <input
            type="text"
            placeholder="Search.."
            value={filters.search}
            onChange={(e) =>
              dispatch({ type: "SET_FILTER", payload: { search: e.target.value } })
            }
          />
        </div>

        <div className="filter_date">
          <label htmlFor="filter-calender">Due date</label>
          <input
            type="date"
            id="filter-calender"
            name="filter-calender"
            value={filters.dueDate ?? ""}
            onChange={(e) =>
              // an empty date (cleared by the user) means "no date filter"
              dispatch({ type: "SET_FILTER", payload: { dueDate: e.target.value || null } })
            }
          />
        </div>

        <CheckboxGroup
          title="Filter by Label"
          filterKey="labels"
          options={labelOptions}
          selected={filters.labels}
          dispatch={dispatch}
        />
        <CheckboxGroup
          title="Filter by Priority"
          filterKey="priority"
          options={PRIORITY_OPTIONS}
          selected={filters.priority}
          dispatch={dispatch}
        />
        <CheckboxGroup
          title="Filter by Status"
          filterKey="status"
          options={statusOptions}
          selected={filters.status}
          dispatch={dispatch}
        />

        <button type="button" onClick={() => dispatch({ type: "RESET_FILTERS" })}>
          Clear filters
        </button>
      </div>
    </div>
  );
};

// A list of checkboxes. Ticking one adds its value to filters[filterKey];
// ticking it again removes it. Several can be ticked at the same time.
const CheckboxGroup = ({ title, filterKey, options, selected, dispatch }) => (
  <div className="filter_group">
    <span className="filter_title">{title}</span>
    <div className="filter_checks">
      {options.map((option) => (
        <label key={option.value} className="check_item">
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={() =>
              dispatch({
                type: "TOGGLE_FILTER_VALUE",
                payload: { key: filterKey, value: option.value },
              })
            }
          />
          {option.label}
        </label>
      ))}
    </div>
  </div>
);
// Shows one card for every task in the column.
const BoardColumn = ({ tasks, statusLabel }) => {
  return (
    <div className="board">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} statusLabel={statusLabel} />
      ))}
    </div>
  );
};

// Shows one task. A task may have no due date, so that part is optional.
const TaskCard = ({ task, statusLabel }) => {
  return (
    <div className="task_card">
      <div className="task_first">
        <span>{task.title}</span>
        {task.labels.map((label) => (
          <div className="task_label" key={label}>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="task_second">
        <span className="task_status">{statusLabel}</span>
        {task.dueDate && <span>Due: {formatDate(task.dueDate)}</span>}
        <div className="task_priority">
          <span>{task.priority}</span>
        </div>
      </div>
    </div>
  );
};

// "2026-12-01" -> "01/12/2026". Split the text instead of using new Date(),
// because new Date() can show the previous day in some time zones.
const formatDate = (dateText) => {
  const [year, month, day] = dateText.split("-");
  return `${day}/${month}/${year}`;
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
const BoardHeader = ({ className, label, count }) => (
  <div className={`board_column ${className}`}>
    <div className="column_container">
      <div>
        <span>
          {label} ({count})
        </span>
      </div>
      <div>
        <button>+</button>
      </div>
     
    </div>
  </div>
);
export default KanbanBoard;

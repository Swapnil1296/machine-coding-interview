import { useState } from 'react'
import TodoForm from './TodoApp/TodoForm.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TodoForm/>
    </>
  )
}

export default App

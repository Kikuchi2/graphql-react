import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client"
import { useState, useMemo } from "react";
import { CheckCircle2, PlusCircle, Delete } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";

const GET_TODOS = gql`
  query GetTodos($date: String!) {
    getTodos(date: $date) {
      id,
      title,
      date,
      completed
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($title: String!, $date: String!) {
      addTodo(title: $title, date: $date) {
        id,
        title,
        date,
        completed
      }
    }
`;

const UPDATE_TODO = gql`
  mutation updateTodo($id: ID!, $completed: Boolean!) {
    updateTodo(id: $id, completed: $completed) {
      id,
      title,
      date,
      completed
    }
  }
`;

const DELETE_TODO = gql`
  mutation deleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      id,
      title,
      date,
      completed
    }
  }
`;

type Todo = {
  id: string;
  title: string;
  date: String;
  completed: boolean;
}

function App() {
  const today = new Date();
  const formattedDate: string = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const [date, setDate] = useState(formattedDate)

  const { loading, data } = useQuery<{ getTodos: Todo[] }>(GET_TODOS, {
    variables: { date },
    fetchPolicy: "network-only",
  });

  const todos = useMemo(() => data?.getTodos ?? [], [data]) 
  const [addTodo] = useMutation(ADD_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO)
  const [deleteTodo] = useMutation(DELETE_TODO)
  const [title, setTitle] = useState("");
  const handleAddTodo = async () => {
    await addTodo({
      variables: { title, date },
      refetchQueries: [{ query: GET_TODOS, variables:{ date } }]
    })
    setTitle("")
  }

  const handleUpdateTodo = async (id: string, completed: boolean) => {
    await updateTodo({
      variables: { id, completed: !completed  },
      refetchQueries: [{ query: GET_TODOS, variables:{ date } }]
    })
  }

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo({
      variables: { id },
      refetchQueries: [{ query: GET_TODOS, variables:{ date } }]
    })
  }

  const handlePreviousDate = async () => {
    // const temp = new Date(date)
    const previousDate = new Date(date)
    previousDate.setDate(previousDate.getDate() - 1)
    const formattedPreviousDate: string = `${previousDate.getFullYear()}-${previousDate.getMonth() + 1}-${previousDate.getDate()}`;

    setDate(formattedPreviousDate)
    // console.log(formattedPreviousDate)
  }

  const handleNextDate = async () => {
    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)
    const formattedNextDate: string =  `${nextDate.getFullYear()}-${nextDate.getMonth() + 1}-${nextDate.getDate()}`;

    setDate(formattedNextDate)
    // console.log(formattedNextDate)
  }

  if (loading) return <p>Loading....</p>

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-mint-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-teal-400 to-emerald-500 p-6">
            <h1 className="text-3xl font-bold text-white mb-2">To-Do List</h1>
            <p><button onClick={handlePreviousDate}>←</button>{ date }<button onClick={handleNextDate}>→</button></p>
          </div>
          <div className="p-6">
            <div className="flex mb-4">
              <input
                type="text"
                placeholder="タスクを追加"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-grow mr-2 bg-teal-50 border-teal-200 focus:ring-2 focus:ring-teal-300 focus:border-transparent"
              />
              <Button
                onClick={handleAddTodo}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <PlusCircle className="w-5 h-5" />
              </Button>
            </div>

            <AnimatePresence>
              {todos.map((todo: Todo) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -100 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center mb-4  p-4 rounded-lg shadow-sm ${
                    todo.completed ? "bg-mint-100" : "bg-white"
                  }`}
                >
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() =>
                      handleUpdateTodo(todo.id, todo.completed)
                    }
                    className="mr-3 border-teal-400 text-teal-500"
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`flex-grow text-lg ${
                      todo.completed
                        ? "line-through text-teal-600"
                        : "text-gray-800"
                    }`}
                  >
                    {todo.title}
                  </label>
                  {todo.completed && (
                    <CheckCircle2 className="w-5 h-5 text-teal-500 ml-2" />
                  )}

                <Button
                  id={`todo-${todo.id}`}
                  onClick={() => 
                    handleDeleteTodo(todo.id)
                  }
                >
                <Delete />
              </Button>
                </motion.div>
              ))}
            </AnimatePresence>
            {todos.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-teal-600 mt-6"
              >
                タスクがありません
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default App

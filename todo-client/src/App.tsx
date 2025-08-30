import { useMutation, useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client"
import { useState } from "react";
import { Variable } from "lucide-react";

const GET_TODOS = gql`
  query{
    getTodos {
      id,
      title,
      completed
    }
  }
`;

const ADD_TODO = gql`
  mutation addTodo($title: String!) {
      addTodo(title: $title) {
        id,
        title,
        completed
      }
    }
`;

const UPDATE_TODO = gql`
  mutation updateTodo($id: ID!, $completed: Boolean!) {
    updateTodo(id: $id, completed: $completed) {
      id,
      title,
      completed
    }
  }
`;

type Todo = {
  id: string;
  title: string;
  completed: boolean;
}

function App() {
  const { loading, data } = useQuery(GET_TODOS, {
    fetchPolicy :"network-only",
  });

  const todos = data ? data.getTodos : []; 
  const [addTodo] = useMutation(ADD_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO)
  const [title, setTitle] = useState("");
  const handleAddTodo = async () => {
    await addTodo({
      variables: { title },
      refetchQueries: [{ query: GET_TODOS }]
    })
    setTitle("")
  }

  const handleUpdateTodo = async (id: string, completed: boolean) => {
    await updateTodo({
      variables: { id, completed: !completed  },
      refetchQueries: [{ query: GET_TODOS }]
    })
  }

  if (loading) return <p>Loading....</p>

  return (
    <div>
      <h1>TODO List</h1>
      <input type="text" placeholder="Please Add Todo" value={title} onChange={(e) => setTitle(e.target.value)}/>
      <button onClick={handleAddTodo}>add</button>
      <ul>
        {todos.map((todo: Todo) => (
          <li key={todo.id} style={{
            textDecoration: todo.completed ? "line-through" : "none"
          }}
          >
            <input type="checkbox" checked={todo.completed} onChange={() => handleUpdateTodo(todo.id, todo.completed)}/>
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App

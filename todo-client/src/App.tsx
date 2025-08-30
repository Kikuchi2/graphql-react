import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client"

const GET_TODOS = gql`
  query{
    getTodos {
      id,
      title,
      completed
    }
  }
`

type Todo = {
  id: string;
  title: string;
  completed: boolean;
}

function App() {
  // const todos = [
  //   { id : "1", title: "task_a", completed: false },
  //   { id : "2", title: "task_b", completed: false }
  // ] as Todo[];

  const { loading, data } = useQuery(GET_TODOS, {
    fetchPolicy :"network-only",
  });

  const todos = data ? data.getTodos : []; 

  if (loading) return <p>Loading....</p>

  return (
    <div>
      <h1>TODO List</h1>
      <input type="text" placeholder="Please Add Todo"/>
      <button>add</button>
      <ul>
        {todos.map((todo: Todo) => (
          <li key={todo.id} style={{
            textDecoration: todo.completed ? "line-through" : "none"
          }}
          >
            <input type="checkbox" checked={todo.completed} />
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App

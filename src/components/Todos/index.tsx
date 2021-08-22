import { ReactElement, useCallback, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import Todo, { TTodo } from './Todo';

type TodoList = {
  [k: number]: TTodo;
};

const initTodos: TodoList = {
  0: {
    id: 0,
    text: 'test',
    deleted: false,
    checked: false,
  },
};

export default function Todos(): ReactElement {
  const [maxId, setMaxId] = useState(1);
  const [todos, setTodos] = useState<TodoList>(initTodos);

  const [newTodoText, setNewTodoText] = useState('');

  const fnAddTodoSubmit = useCallback(
    (e) => {
      e.preventDefault();
      let id = maxId;
      let text = newTodoText;

      setMaxId(maxId + 1);
      setNewTodoText('');

      let newTodo: TTodo = {
        id,
        text,
        deleted: false,
        checked: false,
      };

      let newTodos = JSON.parse(JSON.stringify(todos));
      newTodos[id] = newTodo;

      setTodos(newTodos);
    },
    [maxId, newTodoText, todos],
  );

  const changeTodoText = useCallback(
    (id: number, text: string) => {
      let newTodosArr = Object.keys(todos).map((k) => {
        let curTodo = todos[parseInt(k)];

        if (curTodo.id !== id) return [parseInt(k), curTodo];
        else
          return [
            parseInt(k),
            {
              ...curTodo,
              text,
            },
          ];
      });
      setTodos(Object.fromEntries(newTodosArr));
    },
    [todos],
  );

  return (
    <div>
      <Card>
        <div className="header text-center border-bottom">
          <h1>Todos</h1>
        </div>
        <Form className="border-0 d-flex" onSubmit={fnAddTodoSubmit}>
          <Form.Control
            type="text"
            placeholder="New todo text..."
            className="rounded-0 border-0"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
          />
          <Button type="submit" className="btn-success rounded-0 border-0">
            Add
          </Button>
        </Form>
        <div className="todos">
          {Object.keys(todos).map((k) => {
            let todo = todos[parseInt(k)];
            return (
              !todo.deleted && (
                <div key={parseInt(k)}>
                  <Todo
                    {...todo}
                    fnChangeTodo={(text) => changeTodoText(todo.id, text)}
                  />
                </div>
              )
            );
          })}
        </div>
      </Card>
    </div>
  );
}

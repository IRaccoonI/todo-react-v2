import { ReactElement, useCallback, useMemo, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { PlusLg } from 'react-bootstrap-icons';
import Todo, { TTodo } from './Todo';

type TTodoEntity = {
  [k: number]: TTodo;
};

const initTodos: TTodo[] = [
  {
    id: 0,
    text: 'test',
    deleted: false,
    checked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 1,
    text: 'sometext',
    deleted: true,
    checked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    text: 'sometest',
    deleted: false,
    checked: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    text: 'text',
    deleted: true,
    checked: true,
    createdAt: new Date().toISOString(),
  },
];

type TFilter = boolean | null;
type TTodoFilter = {
  deleted: TFilter;
  checked: TFilter;
};

const initFilter: TTodoFilter = {
  deleted: false,
  checked: null,
};

const getTodoEntity = (todos: TTodo[], filter: TTodoFilter): TTodoEntity => {
  let curId = 0;
  let resEntity: TTodoEntity = {};
  for (let todo of todos) {
    if (
      (filter.checked === null || todo.checked === filter.checked) &&
      (filter.deleted == null || todo.deleted === filter.deleted)
    )
      resEntity[curId] = { ...todo };
    curId += 1;
  }
  return resEntity;
};

export default function Todos(): ReactElement {
  const [maxId, setMaxId] = useState(initTodos.length);
  const [todos, setTodos] = useState<TTodo[]>(initTodos);
  const [filter, setFilter] = useState<TTodoFilter>(initFilter);
  const [todoAdding, setTodoAdding] = useState(false);

  const todosEntity = useMemo<TTodoEntity>(
    () => getTodoEntity(todos, filter),
    [todos, filter],
  );

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
        deleted: filter.deleted ?? false,
        checked: filter.checked ?? false,
        createdAt: new Date().toISOString(),
      };

      let newTodos = todos.slice();
      newTodos.push(newTodo);

      setTodos(newTodos);
    },
    [maxId, newTodoText, todos, filter],
  );

  const changeTodoText = useCallback(
    (id: number, text: string) => {
      let newTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, text } : { ...todo },
      );
      setTodos(newTodos);
    },
    [todos],
  );

  const fnChangeTodoChecked = useCallback(
    (id, checked) => {
      let newTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, checked: !checked } : { ...todo },
      );
      setTodos(newTodos);
    },
    [todos],
  );
  const fnChangeTodoDeleted = useCallback(
    (id, deleted) => {
      let newTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, deleted: !deleted } : { ...todo },
      );
      setTodos(newTodos);
    },
    [todos],
  );

  const fnChangeFilter = useCallback(
    (name: keyof TTodoFilter, state: TFilter) => {
      let newFilter = { ...filter };
      if (state === null) newFilter[name] = true;
      else if (state) newFilter[name] = false;
      else newFilter[name] = null;
      setFilter(newFilter);
    },
    [filter],
  );

  return (
    <div>
      <Card>
        <div className="header text-center border-bottom">
          <h1>Todos</h1>
        </div>
        <div className="p-2 border-top">
          <Button
            type="submit"
            variant={
              filter.checked === null
                ? 'outline-success'
                : filter.checked
                ? 'success'
                : 'danger'
            }
            onClick={() => fnChangeFilter('checked', filter.checked)}
          >
            Checked
          </Button>
          <Button
            type="submit"
            variant={
              filter.deleted === null
                ? 'outline-success'
                : filter.deleted
                ? 'success'
                : 'danger'
            }
            onClick={() => fnChangeFilter('deleted', filter.deleted)}
            className="ms-2"
          >
            Deleted
          </Button>
        </div>
        <div className="todos">
          {Object.keys(todosEntity).map((k) => {
            let todo = todosEntity[parseInt(k)];
            return (
              <div key={parseInt(k)}>
                <Todo
                  {...todo}
                  fnChangeTodoText={(text) => changeTodoText(todo.id, text)}
                  fnChangeTodoChecked={() =>
                    fnChangeTodoChecked(todo.id, todo.checked)
                  }
                  fnChangeTodoDeleted={() =>
                    fnChangeTodoDeleted(todo.id, todo.deleted)
                  }
                />
              </div>
            );
          })}
        </div>
      </Card>
      <div className="mt-2">
        {todoAdding ? (
          <Form
            className="border-0 d-flex"
            onSubmit={(e) => {
              fnAddTodoSubmit(e);
              setTodoAdding(false);
            }}
          >
            <Form.Control
              type="text"
              placeholder="New todo text..."
              className="rounded-0 border-0"
              value={newTodoText}
              autoFocus={true}
              onChange={(e) => setNewTodoText(e.target.value)}
            />
            <Button
              type="submit"
              variant="success"
              className="rounded-0 border-0"
            >
              Add
            </Button>
          </Form>
        ) : (
          <Button
            variant="success"
            className="w-100"
            style={{ fontSize: '1rem' }}
            onClick={() => setTodoAdding(true)}
          >
            <PlusLg></PlusLg>
          </Button>
        )}
      </div>
    </div>
  );
}

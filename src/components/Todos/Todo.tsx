import { ReactElement, useCallback, useState } from 'react';
import { Form } from 'react-bootstrap';

export type TTodo = {
  id: number;
  text: string;
  deleted: boolean;
  checked: boolean;
};

type TodoProps = TTodo & {
  fnChangeTodo: (text: string) => void;
};

export default function Todo(props: TodoProps): ReactElement {
  const [newTodoText, setNewTodoText] = useState('');
  const [editing, setEditing] = useState(false);

  const fnEditSubmit = useCallback(
    (e) => {
      e.preventDefault();
      props.fnChangeTodo(newTodoText);
      setEditing(false);
    },
    [props, newTodoText],
  );

  return (
    <div className="todo">
      <div className="d-flex p-2 border-top">
        <div className="flex-grow-1">
          {editing ? (
            <Form className="border-0 d-flex" onSubmit={fnEditSubmit}>
              <Form.Control
                type="text"
                placeholder="New todo text..."
                className="rounded-0 border-0 p-0"
                autoFocus={true}
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
              />
            </Form>
          ) : (
            <span>{props.text}</span>
          )}
        </div>
        <div
          onClick={() => {
            setNewTodoText(props.text);
            setEditing(true);
          }}
        >
          test
        </div>
      </div>
    </div>
  );
}

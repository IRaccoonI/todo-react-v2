import moment from 'moment';
import { ReactElement, useCallback, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Check, Pen, X } from 'react-bootstrap-icons';

export type TTodo = {
  id: number;
  text: string;
  deleted: boolean;
  checked: boolean;
  createdAt: string;
};

type TodoProps = TTodo & {
  fnChangeTodoText: (text: string) => void;
  fnChangeTodoChecked: () => void;
  fnChangeTodoDeleted: () => void;
};

export default function Todo(props: TodoProps): ReactElement {
  const [newTodoText, setNewTodoText] = useState('');
  const [editing, setEditing] = useState(false);

  const fnEditSubmit = useCallback(
    (e) => {
      e.preventDefault();
      props.fnChangeTodoText(newTodoText);
      setEditing(false);
    },
    [props, newTodoText],
  );

  return (
    <div className={'todo ' + (props.checked && 'checked')}>
      <div className="d-flex p-2 border-top">
        <Button
          variant={(props.checked ? '' : 'outline-') + 'success'}
          className="p-0 px-1"
          onClick={props.fnChangeTodoChecked}
        >
          <Check></Check>
        </Button>
        <div className="flex-grow-1 mx-2">
          {editing ? (
            <Form className="border-0 d-flex" onSubmit={fnEditSubmit}>
              <Form.Control
                type="text"
                placeholder="New todo text..."
                className="rounded-0 border-0 p-0"
                autoFocus={true}
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onBlur={fnEditSubmit}
              />
            </Form>
          ) : (
            <span
              className={props.deleted ? 'text-decoration-line-through' : ''}
            >
              {props.text}{' '}
              <span className="time-pass">
                {moment(props.createdAt).fromNow()}
              </span>
            </span>
          )}
        </div>
        <Button
          onClick={() => {
            setNewTodoText(props.text);
            setEditing(true);
          }}
          variant={editing ? 'primary' : 'outline-primary'}
          className="rounded-0 p-0 px-2"
        >
          <Pen></Pen>
        </Button>
        <Button
          onClick={props.fnChangeTodoDeleted}
          variant={props.deleted ? 'danger' : 'outline-danger'}
          className="rounded-0 p-0 px-1"
        >
          <X></X>
        </Button>
      </div>
    </div>
  );
}

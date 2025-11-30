'use client';

import { startTransition, useActionState } from 'react';

import { toggleTodoAction } from '@/lib/server/actions/todos.actions';

export default function ToggleTodo(props: { id: number; completed: boolean }) {
  let [, action, pending] = useActionState(async () => await toggleTodoAction(props.id, !props.completed), null);

  let onToggleTodo = () => {
    startTransition(() => {
      action();
    });
  };

  return <input disabled={pending} type="checkbox" defaultChecked={props.completed} onClick={onToggleTodo} />;
}

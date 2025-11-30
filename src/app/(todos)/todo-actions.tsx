'use client';

import { useActionState } from 'react';

import { deleteTodoAction } from '@/lib/server/actions/todos.actions';

export default function TodoActions(props: { id: number }) {
  let [, action, pending] = useActionState(async () => {
    await deleteTodoAction(props.id);
  }, null);

  return (
    <form className={'col-start-3'}>
      <input type={'hidden'} name={'id'} value={props.id} />
      <button
        disabled={pending}
        type={'submit'}
        formAction={action}
        className={'border rounded-md text-sm px-2 py-1 cursor-pointer hover:bg-gray-800'}
      >
        Delete
      </button>
    </form>
  );
}

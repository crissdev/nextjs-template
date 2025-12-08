'use client';

import { useActionState } from 'react';

import { deleteTodoAction } from '@/lib/server/todos/todos.actions';
import { Button } from '@/lib/ui/components/cn/button';

export default function TodoActions(props: { id: number }) {
  let [, action, pending] = useActionState(async () => {
    await deleteTodoAction(props.id);
  }, null);

  return (
    <form className={'col-start-3'}>
      <input type={'hidden'} name={'id'} value={props.id} />
      <Button disabled={pending} type={'submit'} formAction={action} size={'sm'}>
        Delete
      </Button>
    </form>
  );
}

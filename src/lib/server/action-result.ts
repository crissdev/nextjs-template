import { ValidationError } from '@/lib/server/validation-error';

export enum ACTION_ERROR_CODE {
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export type ActionErrorResult = {
  success: false;
  error: {
    code: ACTION_ERROR_CODE;
    message: string;
    details?: unknown;
  };
};

export type ActionSuccessResult<T = unknown> = {
  success: true;
  data: T;
};

export type ActionSuccessResultVoid = {
  success: true;
};

export type ActionResult<T = unknown> =
  | ActionErrorResult
  | (T extends void ? ActionSuccessResultVoid : ActionSuccessResult<T>);

export type FormAction<T = unknown> = (
  prevState: ActionResult<T> | undefined,
  payload: FormData,
) => Promise<ActionResult<T>>;

export type TypedAction<R = unknown, T = void> = T extends void
  ? () => Promise<ActionResult<R>>
  : (payload: T) => Promise<ActionResult<R>>;

export function toFormData<T extends object>(obj: T): FormData {
  let formData = new FormData();
  for (let [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    formData.set(key, String(value));
  }
  return formData;
}

export function toActionSuccessResult(): ActionSuccessResultVoid;
export function toActionSuccessResult<T>(data: T): ActionSuccessResult<T>;

export function toActionSuccessResult<T = unknown>(data?: T) {
  return data === undefined
    ? ({ success: true } satisfies ActionSuccessResultVoid)
    : ({ success: true, data } satisfies ActionSuccessResult<T>);
}

export function toActionErrorResult(err: Error, code?: ACTION_ERROR_CODE): ActionErrorResult {
  return {
    success: false,
    error: {
      code:
        code ??
        (err instanceof ValidationError ? ACTION_ERROR_CODE.VALIDATION_FAILED : ACTION_ERROR_CODE.INTERNAL_ERROR),
      message: err.message,
      details: err instanceof ValidationError ? err.issues : undefined,
    },
  };
}

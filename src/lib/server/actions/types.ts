import { ValidationError } from '@/lib/server/services/service-errors';

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
      details: err instanceof ValidationError ? JSON.stringify(err.issues, null, 2) : undefined,
    },
  };
}

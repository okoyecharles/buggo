import { Middleware } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { USER_VALIDATE_FAIL } from '../constants/userConstants';

const FALLBACK_MESSAGE = 'Something went wrong... Please try again';

// A failed session check is expected for signed out visitors, so it stays quiet.
const silentFailures: string[] = [USER_VALIDATE_FAIL];

/*
 * Every failed request dispatches a *_FAIL action carrying the server's
 * response body, so one middleware can surface all of them. The server always
 * answers an error with { message }, validation included.
 */
const errorMiddleware: Middleware = () => (next) => (action: any) => {
  const type = action?.type;

  if (
    typeof type === 'string' &&
    type.endsWith('_FAIL') &&
    !silentFailures.includes(type)
  ) {
    const { message } = action.payload || {};

    // Reuse the action type as the toast id so a retried request replaces its
    // own message instead of stacking another copy.
    toast.error(typeof message === 'string' ? message : FALLBACK_MESSAGE, {
      toastId: type,
    });
  }

  return next(action);
};

export default errorMiddleware;

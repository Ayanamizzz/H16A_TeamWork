import createError from 'http-errors';

function echo(value: string): { value: string } {
  if (value === 'echo') {
    // NEW Iteration 3
    throw createError(400, 'Cannot echo "echo"');
    // OLD Iteration 2
    // return { error: 'error' };
  }
  return {
    value,
  };
}

export { echo };

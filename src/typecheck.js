export default function check(fn, error) {
  return value => {
    if (fn(value)) {
      return { pass: true };
    } else {
      return { pass: false, error: error };
    }
  };
}

export function isArrayOf(itemValidator) {
  return value => Array.isArray(value) && value.every(itemValidator);
}

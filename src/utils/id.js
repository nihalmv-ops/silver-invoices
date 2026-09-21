let counter = 1000;

export function generateId(prefix = 'id') {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}


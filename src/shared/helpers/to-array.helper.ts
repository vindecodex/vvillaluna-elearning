export const toArray = ({ value }: { value: string[] | string }) => {
  if (Array.isArray(value)) return value;
  return [value];
};

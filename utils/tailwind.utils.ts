export const classNames = (
  ...classes: (string | null | boolean | undefined)[]
) => {
  return classes.filter(Boolean).join(" ");
};

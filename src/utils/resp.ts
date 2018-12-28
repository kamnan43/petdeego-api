export const resp = (body: object, status: number = 200) => {
  return [body, status];
};

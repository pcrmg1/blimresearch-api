export const errorHandler = (error: any) => {
  return process.env.NODE_ENV === 'development' ? console.log({ error }) : null
}

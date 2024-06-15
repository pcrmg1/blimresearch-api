export const errorHandler = (error: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log({ error })
  }
}

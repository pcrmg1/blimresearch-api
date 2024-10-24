export const checkCreditsCost = ({
  costOfRequest,
  creditLimit
}: {
  creditLimit: number
  costOfRequest: number
}) => {
  if (creditLimit < costOfRequest) {
    return { status: 400, error: 'Not enough credits' }
  } else {
    return { status: 200, message: 'Enough credits' }
  }
}

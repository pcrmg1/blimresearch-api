import { DateTime } from 'luxon'

export const getStartOfDay = ({ date }: { date: Date }) => {
  return DateTime.fromJSDate(date).startOf('day')
}

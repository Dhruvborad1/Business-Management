export const formatDisplayDate = (value) => {
  if (!value) {
    return 'N/A'
  }

  const [year, month, day] = value.split('-')

  if (!year || !month || !day) {
    return value
  }

  return `${day}/${month}/${year}`
}

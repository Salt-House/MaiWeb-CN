export const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString
  if (isNaN(date.getTime())) return String(dateString)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}

export const convertErrorsToFieldSpecific = (
  errors: Array<Record<string, string>>
) => {
  const converted: Record<string, string> = {}
  errors.forEach((error) => {
    const { path, message } = error
    const key: string = path.split('.').pop() ?? ''

    converted[key] = message
  })
  return converted
}

export const convertErrorsToFormSpecific = (
  errors: Array<Record<string, string>>
) =>
  errors.reduce((acc, error) => {
    acc[error.path] = error.message
    return acc
  }, {})

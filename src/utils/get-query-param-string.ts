// export const getQueryParamString = <T>(params: T) => {
//   const searchParams = new URLSearchParams()

//   for (const key in params) {
//     const value = params[key]
//     if (value !== undefined && value !== null && value !== '') {
//       console.log('value: ', value)
//       if (Array.isArray(value)) {
//         console.log('values is array: ', value)
//         value.forEach((item) => searchParams.append(`${key}[]`, item.toString()))
//       } else {
//         searchParams.append(key, value.toString())
//       }
//     }
//   }

//   return searchParams.toString()
// }

export const getQueryParamString = <T>(params: T) => {
  const searchParams = new URLSearchParams()

  for (const key in params) {
    const value = params[key]
    if (value !== undefined && value !== null && value !== '') {
      console.log('value: ', value)
      if (Array.isArray(value)) {
        console.log('values is array: ', value)
        value.forEach((item) => searchParams.append(key, item.toString())) // Use key without [] for arrays
      } else {
        searchParams.append(key, value.toString()) // Regular key-value for non-array
      }
    }
  }

  return searchParams.toString()
}

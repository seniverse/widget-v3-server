
export const promiseAll = async (array: any[], count: number, callback: any) => {
  for (let i = 0; i < array.length; i += count) {
    const arr = array.slice(i, i + count)
    await Promise.all(arr.map(async item => await callback(item)))
  }
}

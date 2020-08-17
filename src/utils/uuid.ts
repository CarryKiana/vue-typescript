function S4 (): string {
  return (((1 + Math.random()) * 0x10000) | 0)
        .toString(16)
        .substring(1)
}

export function getUid (): string {
  let uuid = S4() +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        S4() +
        S4()
  return uuid
}

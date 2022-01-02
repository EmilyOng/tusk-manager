export function getSelectorHash(props: Record<any, any>) {
  const key = Object.keys(props).find((key) => key.startsWith('data-v-'))
  if (!key) {
    return {}
  }
  return { [key]: '' }
}

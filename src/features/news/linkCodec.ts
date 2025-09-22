export function encodeLinkToId(link: string) {
  return encodeURIComponent(btoa(link));
}
export function decodeIdToLink(id: string) {
  return atob(decodeURIComponent(id));
}

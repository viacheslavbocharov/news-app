export function isSupportedLink(link: string) {
  const host = new URL(link).host;
  return (
    host.endsWith("science.nasa.gov") ||
    host.endsWith("theregister.com") ||
    host.endsWith("nasa.gov")
  );
}

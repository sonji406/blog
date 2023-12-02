export function getLastPartOfUrl(url) {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1];
}

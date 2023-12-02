export const postListHref = (blogUserId, searchValue, number, limit) => {
  const searchUrl = searchValue && `?q=${searchValue}`;
  const pageUrl = `page=${number}&limit=${limit}`;

  if (blogUserId) {
    return `${blogUserId}${searchValue ? searchUrl + '&' : '?'}${pageUrl}`;
  }

  return `?${pageUrl}`;
};

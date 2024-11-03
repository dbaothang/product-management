module.exports = (objectPagination, query, countProduct) => {
  if (query.page) {
    const page = Number(query.page);
    if (!isNaN(page) && page >= 1 && page <= 5) {
      objectPagination.currentPage = parseInt(query.page);
    } else {
      objectPagination.currentPage = 1;
    }
  }
  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItems;

  const totalPage = Math.ceil(countProduct / objectPagination.limitItems);
  objectPagination.totalPage = totalPage;
  return objectPagination;
};

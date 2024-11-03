module.exports = (query) => {
  let objectSearch = {
    keyword: "",
    regax: "",
  };
  if (query.keyword) {
    objectSearch.keyword = query.keyword;
    const regax = new RegExp(objectSearch.keyword, "i");
    objectSearch.regax = regax;
  }
  return objectSearch;
};

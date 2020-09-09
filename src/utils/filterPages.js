module.exports = function (array) {
  const { lie_argv: { edge } } = global;
  return array.filter(function(page){
    const { excludes } = page; 
    if (!excludes) {
      return true;
    }
    delete page.excludes;
    return !excludes.includes(edge);
  });
}
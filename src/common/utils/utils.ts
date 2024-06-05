export function getUniqueObjects<T>(arr: T[]) {
  return arr.filter((item, index) => {
    const currentItem = JSON.stringify(item);
    return (
      index ===
      arr.findIndex((obj) => {
        return JSON.stringify(obj) === currentItem;
      })
    );
  });
}

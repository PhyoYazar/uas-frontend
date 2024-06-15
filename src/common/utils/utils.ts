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

export function get2Decimal(val: number) {
  return Math.round(val * 100) / 100;
}

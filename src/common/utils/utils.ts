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

export function transformGrade(mark: number) {
  if (mark > 74 && mark < 101) return "A+";

  if (mark > 69 && mark < 75) return "A";

  if (mark > 64 && mark < 70) return "A-";

  if (mark > 59 && mark < 65) return "B+";

  if (mark > 54 && mark < 60) return "B";

  if (mark > 49 && mark < 55) return "B-";

  if (mark > 44 && mark < 50) return "C+";

  if (mark > 41 && mark < 45) return "C";

  if (mark > 39 && mark < 42) return "C-";

  if (mark < 40 && mark > 0) return "D";

  return "Invalid grade";
}

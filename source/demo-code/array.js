let values = [0, 8, 1, 18, 5];

function compare(value1, value2) {
  if (value1 < value2) {
    return -1;
  } else if (value1 == value2) {
    return 0;
  } else {
    return 1;
  }
}

values.sort(compare);
console.log(values);

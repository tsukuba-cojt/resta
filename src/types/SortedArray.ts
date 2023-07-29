interface Array<T> {
  insertSorted: (value: T) => void;
}

Object.defineProperty(Array.prototype, 'insertSorted', {
  value: function <T>(value: T): void {
    const index = this.findIndex((v: any) => v > value);
    if (index === -1) {
      this.push(value);
    } else {
      this.splice(index, 0, value);
    }
  },
});

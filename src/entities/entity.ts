export default class Entity<T> {
  constructor(attrs?: Partial<T>) {
    console.log("Entity constructor attrs:", attrs);
    if (attrs) {
      Object.assign(this, attrs);
    }
  }
}

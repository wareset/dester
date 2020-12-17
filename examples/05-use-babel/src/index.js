export default class {
  #privateValue = 12;

  set value(v) {
    this.#privateValue = v;
  }

  get value() {
    return this.#privateValue;
  }
}

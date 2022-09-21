export function RequiredProps<T extends { new(...args: any[]): {} }>(selector: string, ...props: string[]) {
  return function (constructor: T) {
    const original = constructor.prototype.ngOnInit;

    constructor.prototype.ngOnInit = function () {
      props.forEach((prop: string) => {
        if (this[prop] === undefined) {
          throw new Error(`${constructor.name}[${selector}], [${prop}] attribute is required`);
        }
      });

      if (original && typeof original === 'function') {
        original.apply(this, arguments);
      }
    };
  };
}

export function Required(selector: string) {
  return (target: { ngOnInit?: () => void, [prop: string]: any }, prop: string) => {
    if (target['ngOnInit']) {
      const original: Function | null = target['ngOnInit'];

      target['ngOnInit'] = function () {

        if (this[prop] === undefined) {
          throw new Error(`${selector}, [${prop}] attribute is required`);
        }

        if (original) {
          original.apply(this);
        }
      };
    }
  }
}

export function RequiredWhenRead(selector: string) {
  return (target: object, prop: string) => {
    Object.defineProperty(target, prop, {
      get() {
        throw new Error(`${selector}, [${prop}] attribute is required`);
      },
      set(value) {
        Object.defineProperty(target, prop, {
          value,
          writable: true,
          configurable: true,
        });
      },
      configurable: true
    });
  }
}

# 二十、手写实现

## 手写 call/apply/bind

```javascript
// call
Function.prototype.myCall = function(context, ...args) {
    context = context || window;
    const fn = Symbol();
    context[fn] = this;
    const result = context[fn](...args);
    delete context[fn];
    return result;
};

// apply
Function.prototype.myApply = function(context, args) {
    context = context || window;
    const fn = Symbol();
    context[fn] = this;
    const result = context[fn](...args);
    delete context[fn];
    return result;
};

// bind
Function.prototype.myBind = function(context, ...args) {
    const fn = this;
    return function(...newArgs) {
        return fn.apply(context, [...args, ...newArgs]);
    };
};
```

---

## 手写 new

```javascript
function myNew(Constructor, ...args) {
    const obj = Object.create(Constructor.prototype);
    const result = Constructor.apply(obj, args);
    return result instanceof Object ? result : obj;
}
```

---

## 手写 Promise

```javascript
class MyPromise {
    constructor(executor) {
        this.state = 'pending';
        this.value = undefined;
        this.callbacks = [];
        
        const resolve = (value) => {
            if (this.state !== 'pending') return;
            this.state = 'fulfilled';
            this.value = value;
            this.callbacks.forEach(cb => cb.onFulfilled(value));
        };
        
        const reject = (reason) => {
            if (this.state !== 'pending') return;
            this.state = 'rejected';
            this.value = reason;
            this.callbacks.forEach(cb => cb.onRejected(reason));
        };
        
        executor(resolve, reject);
    }
    
    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            const handle = () => {
                if (this.state === 'fulfilled') {
                    try {
                        resolve(onFulfilled(this.value));
                    } catch (e) {
                        reject(e);
                    }
                } else if (this.state === 'rejected') {
                    try {
                        reject(onRejected(this.value));
                    } catch (e) {
                        reject(e);
                    }
                }
            };
            
            if (this.state === 'pending') {
                this.callbacks.push({
                    onFulfilled: () => {
                        try { resolve(onFulfilled(this.value)); }
                        catch (e) { reject(e); }
                    },
                    onRejected: () => {
                        try { reject(onRejected(this.value)); }
                        catch (e) { reject(e); }
                    }
                });
            } else {
                setTimeout(handle, 0);
            }
        });
    }
}
```

---

## 手写 EventEmitter

```javascript
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
        return this;
    }
    
    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(cb => cb(...args));
        }
        return this;
    }
    
    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
        return this;
    }
    
    once(event, callback) {
        const wrapper = (...args) => {
            callback(...args);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
        return this;
    }
}
```

---

[返回上级目录](../README.md)


### generc with arrowfun

- https://stackoverflow.com/questions/32308370/what-is-the-syntax-for-typescript-arrow-functions-with-generics

~~~ ts
const foo = <T>(x: T) => x; // ERROR : unclosed `T` tag
const foo = <T extends unknown>(x: T) => x;

// If you're in a .tsx file you cannot just write <T>, but this works:
const foo = <T, >(x: T) => x;
~~~

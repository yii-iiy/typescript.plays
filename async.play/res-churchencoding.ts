// by chatGPT-3.5

interface AsyncResult<T> {
  is_complete: boolean;
  result?: T;
  error?: any;
}

const run_async =
  <T,>(promising: Promise<T> | PromiseLike<T>): AsyncResult<T> =>
  {
    const result: AsyncResult<T> = { is_complete: false };
    promising.then(
      res => {
        result.result = res;
        result.is_complete = true;
      },
      err => {
        result.error = err;
        result.is_complete = true;
      }
    );
    return result;
  };

const handleResult = <T,>(result: AsyncResult<T>, interval_id: ReturnType<typeof setInterval>) => {
  if (result.is_complete) {
    clearInterval(interval_id);
    if (result.result) {
      console.log("Async operation succeeded with result:", result.result);
    } else if (result.error) {
      console.error("Async operation failed with error:", result.error);
    }
  } else {
    console.log("Async operation is still in progress...");
  }
};

const set_interval = <T,>(callback: () => T, interval: number) =>
  ((callback: () => T, interval: number) => {
    let id: ReturnType<typeof setInterval>;

    const start = () => {
      id = setInterval(() => {
        callback();
        handleResult(async_result, id);
      }, interval);
    };

    const stop = () => {
      clearInterval(id);
    };

    return { start, stop };
  })(callback, interval);

const async_result = run_async(
  new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      resolve("hello world");
    }, 1000);
  })
);

const { start, stop:x } = set_interval(() => {
  console.log(`... wait, plz ...`);
}, 400);

start();

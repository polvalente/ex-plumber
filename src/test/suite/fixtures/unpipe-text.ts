export const samples = [
  {
    name: "three args in named function",
    piped: "before call a |> function_name(b, c) after call",
    unpiped: "before call function_name(a, b, c) after call",
  },
  {
    name: "single arg in named function",
    piped: "before call a |> function_name() after call",
    unpiped: "before call function_name(a) after call",
  },
  {
    name: "three args in anonymous function",
    piped: "before call a |> function_name.(b, c) after call",
    unpiped: "before call function_name.(a, b, c) after call",
  },
  {
    name: "single arg in anonymous function",
    piped: "before call a |> function_name.() after call",
    unpiped: "before call function_name.(a) after call",
  },
];

export const multiLineSamples = [
  {
    name: "three args in named function",
    piped: `before call
    a
    |> function_name(b, c)
    after call
    `,
    unpiped: `before call
    function_name(a, b, c)
    after call
    `,
  },
  {
    name: "single arg in named function",
    piped: `before call
    a
    |> function_name()
    after call
    `,
    unpiped: `before call
    function_name(a)
    after call
    `,
  },
  {
    name: "three args in anonymous function",
    piped: `before call
    a
    |> function_name.(b, c)
    after call
    `,
    unpiped: `before call
    function_name.(a, b, c)
    after call
    `,
  },
  {
    name: "single arg in anonymous function",
    piped: `before call
    a
    |> function_name.()
    after call
    `,
    unpiped: `before call
    function_name.(a)
    after call
    `,
  },
  {
    name: "function call piped into another function",
    piped: `before call
    f(a)
    |> g(b, c)
    after call
    `,
    unpiped: `before call
    g(f(a), b, c)
    after call
    `,
  },
];

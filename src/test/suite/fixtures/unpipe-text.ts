export const samples = [
  {
    name: "three args in named function",
    piped: "a |> function_name(b, c) |> after_call",
    unpiped: "function_name(a, b, c) |> after_call",
  },
  {
    name: "pipe chain",
    piped: "a |> b() |> function_name(c, d) |> after_call",
    unpiped: "b(a) |> function_name(c, d) |> after_call",
  },
  {
    name: "pipe chain with no raw start",
    piped: "b(a) |> function_name(c, d) |> after_call",
    unpiped: "function_name(b(a), c, d) |> after_call",
  },
  {
    name: "single arg in named function",
    piped: "a |> function_name() |> after_call",
    unpiped: "function_name(a) |> after_call",
  },
  {
    name: "three args in anonymous function",
    piped: "a |> function_name.(b, c) |> after_call",
    unpiped: "function_name.(a, b, c) |> after_call",
  },
  {
    name: "single arg in anonymous function",
    piped: "a |> function_name.() |> after_call",
    unpiped: "function_name.(a) |> after_call",
  },
  {
    name: "three args in named function and statement before call",
    piped: "before_call; a |> function_name(b, c) |> after_call",
    unpiped: "before_call; function_name(a, b, c) |> after_call",
  },
  {
    name: "single arg in named function and statement before call",
    piped: "before_call; a |> function_name() |> after_call",
    unpiped: "before_call; function_name(a) |> after_call",
  },
  {
    name: "three args in anonymous function and statement before call",
    piped: "before_call; a |> function_name.(b, c) |> after_call",
    unpiped: "before_call; function_name.(a, b, c) |> after_call",
  },
  {
    name: "single arg in anonymous function and statement before call",
    piped: "before_call; a |> function_name.() |> after_call",
    unpiped: "before_call; function_name.(a) |> after_call",
  },
];

export const multiLineSamples = [
  {
    name: "three args in named function",
    piped: `before_call;
    a
    |> function_name(b, c)
    |> after_call
    `,
    unpiped: `before_call;
    function_name(a, b, c)
    |> after_call
    `,
  },
  {
    name: "single arg in named function",
    piped: `before_call;
    a
    |> function_name()
    |> after_call
    `,
    unpiped: `before_call;
    function_name(a)
    |> after_call
    `,
  },
  {
    name: "three args in anonymous function",
    piped: `before_call;
    a
    |> function_name.(b, c)
    |> after_call
    `,
    unpiped: `before_call;
    function_name.(a, b, c)
    |> after_call
    `,
  },
  {
    name: "single arg in anonymous function",
    piped: `before_call;
    a
    |> function_name.()
    |> after_call
    `,
    unpiped: `before_call;
    function_name.(a)
    |> after_call
    `,
  },
  {
    name: "function call piped into another function",
    piped: `before_call;
    f(a)
    |> g(b, c)
    |> after_call
    `,
    unpiped: `before_call;
    g(f(a), b, c)
    |> after_call
    `,
  },
];

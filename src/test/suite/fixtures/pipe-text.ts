export const samples = [
  {
    name: "single-line selection with two args in named function",
    before: "before call function_name(a, b) after call",
    after: "a |> function_name(b",
  },
  {
    name: "single-line selection with single arg in named function",
    before: "before call function_name(a) after call",
    after: "a |> function_name(",
  },
  {
    name: "single-line selection with two args in anonymous function",
    before: "before call function_name.(a, b) after call",
    after: "a |> function_name.(b",
  },

  {
    name: "single-line selection with single arg in anonymous function",
    before: "before call function_name.(a) after call",
    after: "a |> function_name.(",
  },
];

export const multiLineSamples = [
  {
    name: "multi-line selection with two args in named function",
    before: `before |> function_name(
    a,
    b,
    c
  ) after call`,
    after: `before |> a |> function_name(b,
    c
  ) after call`,
  },
];

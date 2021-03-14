export const samples = [
  {
    name: "single-line selection with two args in named function",
    before: "before_call; X.Y.Z.function_name(A.B.C.a, b) after_call",
    after: "A.B.C.a |> X.Y.Z.function_name(b",
  },
  {
    name: "single-line selection with single arg in named function",
    before: "before_call && X.Y.Z.function_name(A.B.C.a) || after_call",
    after: "A.B.C.a |> X.Y.Z.function_name(",
  },
  {
    name: "single-line selection with two args in anonymous function",
    before: "before_call |> X.Y.Z.function_name.(A.B.C.a, b) |> after_call",
    after: "A.B.C.a |> X.Y.Z.function_name.(b",
  },

  {
    name: "single-line selection with single arg in anonymous function",
    before: "before call X.Y.Z.function_name.(A.B.C.a) after call",
    after: "A.B.C.a |> X.Y.Z.function_name.(",
  },
];

export const multiLineSamples = [
  {
    name: "multi-line selection with two args in named function",
    before: `before; X.Y.Z.function_name(
    X.Y.Z.a,
    b,
    c
  ) |> after_call`,
    after: `before; X.Y.Z.a |> X.Y.Z.function_name(b,
    c
  ) |> after_call`,
  },
];

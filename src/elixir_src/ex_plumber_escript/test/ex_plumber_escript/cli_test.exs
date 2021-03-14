defmodule ExPlumberEscript.CLITest do
  use ExUnit.Case
  doctest ExPlumberEscript.CLI

  test "handles module calls" do
    assert "1 + X.Y.Z.a |> A.B.C.f(b + 2, c, d, e) |> g(h)" ==
             ExPlumberEscript.CLI.to_pipe(
               "A.B.C.f(1 + X.Y.Z.a, b + 2, c, d, e) |> g(h)"
               |> Code.string_to_quoted!()
             )
             |> Macro.to_string()
  end

  test "handles multiline module calls" do
    {quoted, suffix} = "X.Y.Z.function_name(
    X.Y.Z.a,
    b,
    c" |> ExPlumberEscript.CLI.to_quoted()

    assert "X.Y.Z.a |> X.Y.Z.function_name(b, c" <> suffix ==
             quoted |> ExPlumberEscript.CLI.to_pipe() |> Macro.to_string()
  end

  test "handles anonymous functions" do
    {quoted, suffix} = "function_name.(A.B.C.a" |> ExPlumberEscript.CLI.to_quoted()

    assert "A.B.C.a |> function_name.(" <> suffix ==
             quoted |> ExPlumberEscript.CLI.to_pipe() |> Macro.to_string()
  end
end

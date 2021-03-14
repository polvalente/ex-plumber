defmodule ExPlumberEscript.CLITest do
  use ExUnit.Case
  doctest ExPlumberEscript.CLI

  test "handles module calls" do
    assert "(1 + X.Y.Z.a) |> A.B.C.f(b + 2, c, d, e) |> g(h)" ==
             ExPlumberEscript.CLI.to_pipe(
               "A.B.C.f(1 + X.Y.Z.a, b + 2, c, d, e) |> g(h)"
               |> Code.string_to_quoted!()
             )
             |> Macro.to_string()
  end
end

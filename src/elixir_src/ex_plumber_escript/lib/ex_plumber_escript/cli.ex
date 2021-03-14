defmodule ExPlumberEscript.CLI do
  @moduledoc """
  Main escript for ExPlumber.

  Provides functionality for converting between
  pipes and function calls.

  ## Examples

      iex> ExPlumberEscript.CLI.main(["--direction", "from_pipe", "--", "a |> f(b, c, d, e) |> g(h)"])
      "f(a, b, c, d, e) |> g(h)"
      iex> ExPlumberEscript.CLI.main(["--direction", "from_pipe", "--", "f(a, b, c, d, e) |> g(h)"])
      "g(f(a, b, c, d, e), h)"

      iex> ExPlumberEscript.CLI.main(["--direction", "to_pipe", "--", "g(f(a, b, c, d, e), h)"])
      "f(a, b, c, d, e) |> g(h)"
      iex> ExPlumberEscript.CLI.main(["--direction", "to_pipe", "--", "f(a, b, c, d, e) |> g(h)"])
      "a |> f(b, c, d, e) |> g(h)"

      iex> code = "a |> f(b, c, d, e) |> g(h)"
      iex> original_ast = Code.string_to_quoted!(code)
      iex> ^original_ast = code |> Code.string_to_quoted!() |> ExPlumberEscript.CLI.from_pipe() |> ExPlumberEscript.CLI.from_pipe() |> ExPlumberEscript.CLI.to_pipe() |> ExPlumberEscript.CLI.to_pipe()
      {:|>, [line: 1],
      [
        {:|>, [line: 1],
          [
            {:a, [line: 1], nil},
            {:f, [line: 1],
            [
              {:b, [line: 1], nil},
              {:c, [line: 1], nil},
              {:d, [line: 1], nil},
              {:e, [line: 1], nil}
            ]}
          ]},
        {:g, [line: 1], [{:h, [line: 1], nil}]}
      ]}
  """

  def main(cli_args) do
    {args, [], []} = OptionParser.parse(cli_args, strict: [direction: :string])
    direction = args[:direction] || raise "--direction is required"

    code = IO.read(:stdio, :line)

    result =
      case direction do
        "from_pipe" ->
          code |> Code.string_to_quoted!() |> from_pipe() |> Macro.to_string()

        "to_pipe" ->
          code |> Code.string_to_quoted!() |> to_pipe() |> Macro.to_string()
      end

    IO.puts(result)
  end

  def from_pipe(code) do
    code
    |> Macro.postwalk(%{has_unpiped: false}, fn
      {:|>, line, [left, {function, _, args}]}, %{has_unpiped: false} = acc ->
        {{function, line, [left | args]}, Map.put(acc, :has_unpiped, true)}

      node, acc ->
        {node, acc}
    end)
    |> elem(0)
  end

  def to_pipe(code) do
    code
    |> Macro.prewalk(%{has_piped: false}, &to_pipe/2)
    |> elem(0)
  end

  defp to_pipe({:|>, line, [left, right]}, %{has_piped: false} = acc) do
    {{:|>, line, [left |> to_pipe(acc) |> elem(0), right]}, Map.put(acc, :has_piped, true)}
  end

  defp to_pipe({function, line, [h | t]}, %{has_piped: false} = acc) when is_atom(function) do
    {{:|>, line, [h, {function, line, t}]}, Map.put(acc, :has_piped, true)}
  end

  defp to_pipe(node, acc) do
    {node, acc}
  end
end

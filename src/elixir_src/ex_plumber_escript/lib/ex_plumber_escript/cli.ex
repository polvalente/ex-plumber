defmodule ExPlumberEscript.CLI do
  @moduledoc """
  Main escript for ExPlumber.

  Provides functionality for converting between
  pipes and function calls.

  ## Examples

      iex> "a |> f(b, c, d, e) |> g(h)" |> Code.string_to_quoted!() |> ExPlumberEscript.CLI.from_pipe() |> Macro.to_string()
      "f(a, b, c, d, e) |> g(h)"
      iex> "f(a, b, c, d, e) |> g(h)" |> Code.string_to_quoted!() |> ExPlumberEscript.CLI.from_pipe() |> Macro.to_string()
      "g(f(a, b, c, d, e), h)"

      iex> "g(f(a, b, c, d, e), h)" |> Code.string_to_quoted!() |> ExPlumberEscript.CLI.to_pipe() |> Macro.to_string()
      "f(a, b, c, d, e) |> g(h)"
      iex> "f(a, b, c, d, e) |> g(h)" |> Code.string_to_quoted!() |> ExPlumberEscript.CLI.to_pipe() |> Macro.to_string()
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
    {args, [], []} = OptionParser.parse(cli_args, strict: [direction: :string, length: :integer])
    direction = args[:direction] || raise "--direction is required"
    len = args[:length] || raise "--length is required"

    code = IO.read(:stdio, len)

    {quoted, suffix} =
      code
      |> String.trim()
      |> to_quoted()

    result =
      case direction do
        "from_pipe" ->
          quoted
          |> from_pipe()
          |> macro_to_string()

        "to_pipe" ->
          quoted
          |> to_pipe()
          |> macro_to_string()
      end

    case suffix do
      "" ->
        IO.puts(result)

      suffix ->
        IO.puts(String.trim_trailing(result, suffix))
    end
  end

  defp macro_to_string({:__block__, _, statements}) do
    statements
    |> Enum.map(&Macro.to_string/1)
    |> Enum.join("; ")
  end

  defp macro_to_string(statement), do: Macro.to_string(statement)

  def from_pipe(code) do
    code
    |> Macro.postwalk(%{has_unpiped: false}, fn
      {:|>, line, [h, {{:., line, [{_, _, nil}]} = anonymous_function_node, line, t}]},
      %{has_unpiped: false} = acc ->
        {{anonymous_function_node, line, [h | t]}, Map.put(acc, :has_unpiped, true)}

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

  defp to_pipe(
         {{:., line, [{_, _, nil}]} = anonymous_function_node, _meta, [h | t]},
         %{has_piped: false} = acc
       ) do
    {{:|>, line, [h, {anonymous_function_node, line, t}]}, Map.put(acc, :has_piped, true)}
  end

  defp to_pipe({{:., line, _args} = function, _meta, [h | t]}, %{has_piped: false} = acc)
       when t != [] do
    {{:|>, line, [h, {function, line, t}]}, Map.put(acc, :has_piped, true)}
  end

  defp to_pipe({function, line, [h | t]}, %{has_piped: false} = acc)
       when is_atom(function) and t != [] do
    {{:|>, line, [h, {function, line, t}]}, Map.put(acc, :has_piped, true)}
  end

  defp to_pipe(node, acc) do
    {node, acc}
  end

  def to_quoted(str, suffix \\ "") do
    case Code.string_to_quoted(str) do
      {:ok, x} ->
        {x, suffix}

      {:error, {_, <<"missing terminator: ", x::binary-size(1), _::bitstring>>, _}} ->
        to_quoted(str <> x, suffix <> x)

      err ->
        raise inspect(err)
    end
  end
end

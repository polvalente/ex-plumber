# ExPlumber

This extension aims to provide functionality to convert back and forth between pipe operators and function calls

This is an unnoficial extension for processing [Elixir](http://elixir-lang.org) files.

## Known Issues

- `g(f(a), b, c)` doesn't work properly because the extension does not deal with nesting parens.
- `a |> b |> f(c)` does not work because `b` is not recognized as a function call.

## Contributing

- Fork this repository
- Open a Pull Request with your changes. If there is an existing Git Hub issue, please point to it in the Pull Request body.

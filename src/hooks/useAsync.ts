import { useEffect, useState } from "react";

type AsyncState<T> =
  | { status: "loading"; data?: undefined; error?: undefined }
  | { status: "error"; data?: undefined; error: string }
  | { status: "success"; data: T; error?: undefined };

/**
 * Executa uma função assíncrona quando as dependências mudam e expõe
 * status de loading/erro/sucesso. Usado nas páginas para buscar dados
 * do Appwrite sem repetir a mesma lógica de useEffect em cada uma.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    fn()
      .then((data) => {
        if (!cancelled) setState({ status: "success", data });
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            status: "error",
            error: err instanceof Error ? err.message : "Erro inesperado.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

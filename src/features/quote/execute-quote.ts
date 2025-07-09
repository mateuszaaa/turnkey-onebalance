import { Quote } from "./quote";

export const executeQuote = (
  quote: Quote & { _tag: "BTC" | "EVM" }
) => {
  const { _tag, ...quoteToSend } = quote;

  return fetch("/api/execute-quote", {
    method: "post",
    body: JSON.stringify(quoteToSend),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return response.json();
    })
    .then((response) => {
      if (typeof response === "object" && response.error)
        throw new Error(response.error);
      return response;
    });
};

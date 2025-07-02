export interface Chain {
  chain: {
    chain: "eip155:42161";
    namespace: "eip155";
    reference: "42161";
  };
  isTestnet: boolean;
}

export const fetchSupportedChains = ({
  apiKey,
  apiUrl,
}: {
  apiKey: string;
  apiUrl: string;
}): Promise<Chain[]> => {
  return fetch("/api/chains/supported-list", {
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};

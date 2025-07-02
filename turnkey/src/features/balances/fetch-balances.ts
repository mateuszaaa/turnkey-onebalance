import { Address } from "viem";
import { UserBalance } from "./balances";

export const fetchBalances = async ({
  address,
  apiKey,
  apiUrl,
}: {
  address: Address;
  apiUrl: string;
  apiKey: string;
}): Promise<UserBalance> => {
  const params = new URLSearchParams();
  params.set("address", address);

  return fetch(`/api/balances/aggregated-balance?${params}`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};

export const fetchBTCBalance = async ({
  address,
  apiKey,
  apiUrl,
}: {
  address: string;
  apiUrl: string;
  apiKey: string;
}): Promise<{
  balance: string;
  fiatValue: number;
}> => {
  const params = new URLSearchParams();
  params.set("address", address);

  return fetch(`/api/balances/btc?${params}`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};

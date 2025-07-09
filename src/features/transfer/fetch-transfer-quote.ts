import { Address } from "viem";
import { Quote } from "../quote/quote";

export interface TransferRequest {
  account: {
    accountAddress: Address;
    sessionAddress: Address;
    adminAddress: Address;
  };
  aggregatedAssetId: string;
  amount: string;
  recipientAccountId: string;
}

export const fetchTransferQuote = (
  transferRequest: TransferRequest
): Promise<Quote> => {
  return fetch("/api/transfer-quote", {
    method: "post",
    body: JSON.stringify(transferRequest),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};

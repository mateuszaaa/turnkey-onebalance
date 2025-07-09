import { TransactionStatus } from "./transaction-status";

export const fetchTransactionStatus = async ({
  quoteId,
}: {
  quoteId: string;
}): Promise<TransactionStatus> => {
  const params = new URLSearchParams();
  params.set("quoteId", quoteId);

  return fetch(`/api/status/get-execution-status?${params}`, {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      if (!response.ok) throw await response.json();
      return response.json();
    })
    .then((data) => {
      if (Object.keys(data).length > 0) {
        return {
          _tag: "TransactionStatus",
          ...data,
        };
      }
      return {
        _tag: "Empty",
      };
    })
    .then((data: TransactionStatus) => {
      if (data._tag === "Empty") {
        return data;
      }

      data.originChainOperations.forEach((op) => {
        if (op.chainId === 8253038) {
          op.explorerUrl = `https://btcscan.org/tx/${op.hash}`;
        }
      });

      data.destinationChainOperations.forEach((op) => {
        if (op.chainId === 8253038) {
          op.explorerUrl = `https://btcscan.org/tx/${op.hash}`;
        }
      });

      return data;
    });
};

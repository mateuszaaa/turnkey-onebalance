"use client";
import { PropsWithChildren, useEffect } from "react";
import { useOneBalanceAccountAddress } from "./use-onebalance-account";

export const OneBalanceAccountRequired = ({ children }: PropsWithChildren) => {
  const oneBalanceAccountQuery = useOneBalanceAccountAddress();

  useEffect(() => {
    console.log("[OneBalanceAccountRequired] Query state:", {
      isLoading: oneBalanceAccountQuery.isLoading,
      isError: oneBalanceAccountQuery.isError,
      error: oneBalanceAccountQuery.error,
      data: oneBalanceAccountQuery.data,
      status: oneBalanceAccountQuery.status,
      fetchStatus: oneBalanceAccountQuery.fetchStatus,
    });
  }, [oneBalanceAccountQuery]);

  useEffect(() => {
    if (oneBalanceAccountQuery.isError) {
      console.error("[OneBalanceAccountRequired] Error occurred:", oneBalanceAccountQuery.error);
    }
  }, [oneBalanceAccountQuery.isError, oneBalanceAccountQuery.error]);

  if (oneBalanceAccountQuery.isError) {
    return (
      <div className="text-red-500 text-xl mt-10">
        <div>Failed to load account</div>
        <div className="text-sm mt-2">
          Error: {oneBalanceAccountQuery.error?.message || 'Unknown error'}
        </div>
        <button 
          onClick={() => {
            console.log("[OneBalanceAccountRequired] Retrying...");
            oneBalanceAccountQuery.refetch();
          }}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!oneBalanceAccountQuery.data) {
    const loadingTime = Date.now();
    console.log("[OneBalanceAccountRequired] Still loading at:", new Date().toISOString());
    
    return (
      <div className="animate-pulse text-xl mt-10">
        Loading account...
        <div className="text-sm mt-2 text-gray-400">
          Status: {oneBalanceAccountQuery.status} | Fetch: {oneBalanceAccountQuery.fetchStatus}
        </div>
      </div>
    );
  }

  console.log("[OneBalanceAccountRequired] Account loaded successfully:", oneBalanceAccountQuery.data);
  return children;
};

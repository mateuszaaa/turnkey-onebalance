"use client";
import { skipToken, useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { useTurnkeyAuth } from "../turnkey/use-turnkey-auth";
import { fetchPredictAddress } from "./fetch-predict-address";
import { useEnvironment } from "../environment/environment";

export const ADMIN_ADDRESS = "0x771d3303f888E75bD24634967196b5ae87C7819D";

export const useEmbeddedWallet = () => {
  const { wallets } = useTurnkeyAuth();
  console.log("[useEmbeddedWallet] Wallets:", wallets);
  const wallet = wallets?.[0];
  console.log("[useEmbeddedWallet] Selected wallet:", wallet);
  console.log("[useEmbeddedWallet] Selected wallet address:", wallet?.address);
  return wallet;
};

export const useOneBalanceAccountAddress = () => {
  const embeddedWallet = useEmbeddedWallet();
  console.log("[useOneBalanceAccountAddress] Embedded wallet:", embeddedWallet);
  console.log("[useOneBalanceAccountAddress] Session key address:", embeddedWallet?.address);
  console.log("[useOneBalanceAccountAddress] Admin address:", ADMIN_ADDRESS);

  return usePredictAddress({
    sessionKeyAddress: embeddedWallet?.address as Address | undefined,
    // below is a random ETH address, please change this as per your requirements.
    adminKeyAddress: ADMIN_ADDRESS,
  });
};

const usePredictAddress = ({
  sessionKeyAddress,
  adminKeyAddress,
}: {
  sessionKeyAddress: Address | undefined;
  adminKeyAddress: Address;
}) => {
  const { apiKey, apiUrl } = useEnvironment();
  console.log("[usePredictAddress] Environment:", { apiKey: apiKey ? '***' : 'undefined', apiUrl });
  console.log("[usePredictAddress] Addresses:", { sessionKeyAddress, adminKeyAddress });
  
  const query = useQuery({
    queryKey: [
      "onebalance-account-address",
      sessionKeyAddress,
      adminKeyAddress,
    ],
    queryFn: sessionKeyAddress
      ? async () => {
          console.log("[usePredictAddress] Making API call with:", {
            sessionAddress: sessionKeyAddress,
            adminAddress: adminKeyAddress,
            apiUrl,
          });
          try {
            const result = await fetchPredictAddress(
              {
                sessionAddress: sessionKeyAddress,
                adminAddress: adminKeyAddress,
              },
              {
                apiUrl,
                apiKey,
              }
            );
            console.log("[usePredictAddress] API call successful:", result);
            return result;
          } catch (error) {
            console.error("[usePredictAddress] API call failed:", error);
            throw error;
          }
        }
      : skipToken,
  });
  
  console.log("[usePredictAddress] Query result:", {
    status: query.status,
    fetchStatus: query.fetchStatus,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    data: query.data,
  });
  
  return query;
};

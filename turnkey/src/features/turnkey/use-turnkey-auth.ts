"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTurnkey } from "@turnkey/sdk-react";
import { queryClient } from "../react-query";
import { toast } from "sonner";
import { usePersistedBTCWallet } from "../onebalance-account/use-persisted-btc-wallet";

type TurnkeyBrowserSDK = NonNullable<ReturnType<typeof useTurnkey>["turnkey"]>;
export type TurnkeyPasskeyClient = NonNullable<
  ReturnType<typeof useTurnkey>["passkeyClient"]
>;

export const useTurnkeyAuth = () => {
  const { turnkey, passkeyClient } = useTurnkey();
  console.log("[useTurnkeyAuth] Turnkey SDK initialized:", !!turnkey);
  console.log("[useTurnkeyAuth] Passkey client initialized:", !!passkeyClient);
  
  const { mutate: logout } = useMutation({
    mutationFn: (_turnkey: TurnkeyBrowserSDK) => {
      console.log("[useTurnkeyAuth] Logging out user");
      return _turnkey.logoutUser();
    },
    onSuccess: () => {
      console.log("[useTurnkeyAuth] Logout successful, invalidating queries");
      queryClient.invalidateQueries({ queryKey: "authenticated" });
      refetch();
    },
  });

  const {
    data: user,
    refetch,
    isLoading: isUserLoading,
  } = useQuery({
    queryKey: ["authenticated"],
    queryFn: async () => {
      console.log("[useTurnkeyAuth] Fetching current user...");
      try {
        const result = await turnkey!.getCurrentUser();
        console.log("[useTurnkeyAuth] Current user result:", result);
        return result ?? null;
      } catch (error) {
        console.error("[useTurnkeyAuth] Error fetching current user:", error);
        throw error;
      }
    },
    enabled: !!turnkey,
  });

  const { data: wallets } = useQuery({
    queryKey: ["wallets"],
    queryFn: async () => {
      console.log("[useTurnkeyAuth] Fetching wallets...");
      try {
        const currentUserSession = await turnkey!.currentUserSession();
        console.log("[useTurnkeyAuth] Current user session:", !!currentUserSession);
        
        const wallets = await currentUserSession!.getWallets();
        console.log("[useTurnkeyAuth] Fetched wallets:", wallets);
        
        const walletsWithAccounts = await Promise.all(
          wallets.wallets
            .map((wallet) => wallet.walletId)
            .map(async (walletId) => {
              console.log("[useTurnkeyAuth] Fetching accounts for wallet:", walletId);
              const accounts = await currentUserSession!.getWalletAccounts({
                walletId,
              });
              console.log("[useTurnkeyAuth] Wallet accounts:", accounts);
              return accounts;
            })
        );
        
        const flattenedAccounts = walletsWithAccounts.flatMap((wallet) => wallet.accounts);
        console.log("[useTurnkeyAuth] All wallet accounts:", flattenedAccounts);
        return flattenedAccounts;
      } catch (error) {
        console.error("[useTurnkeyAuth] Error fetching wallets:", error);
        throw error;
      }
    },
    enabled: !!turnkey && !!user,
  });

  console.log("[useTurnkeyAuth] Auth state:", {
    authenticated: !!user,
    user,
    wallets,
    isUserLoading,
    turnkeyReady: !!turnkey,
  });

  return {
    logout: turnkey ? () => logout(turnkey) : () => Promise.resolve(),
    authenticated: !!user,
    user,
    wallets: wallets,
    isUserLoading,
    refreshAuthStatus: refetch,
  };
};

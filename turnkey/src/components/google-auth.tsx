"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/providers/auth-provider"
import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google"
import { uncompressRawPublicKey } from "@turnkey/crypto"
import { useTurnkey } from "@turnkey/sdk-react"
import { sha256, toHex } from "viem"

import { env } from "@/env.mjs"

import { Skeleton } from "./ui/skeleton"

const GoogleAuth = () => {
  const { client, indexedDbClient } = useTurnkey()
  const clientId = env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID

  const [nonce, setNonce] = useState("")
  const authContext = useAuth()
  const { loginWithGoogle } = authContext
  
  console.log("[GoogleAuth] Auth context:", {
    hasLoginWithGoogle: !!loginWithGoogle,
    authContextKeys: Object.keys(authContext),
    contextState: authContext.state
  })

  useEffect(() => {
    const initializeKeyPairAndGetPublicKey = async () => {
      console.log("[GoogleAuth] Initializing key pair for OAuth")
      console.log("[GoogleAuth] IndexedDB client available:", !!indexedDbClient)
      
      try {
        // For OAuth, always start with a fresh key pair to avoid conflicts
        console.log("[GoogleAuth] Creating fresh key pair for OAuth")
        await indexedDbClient?.resetKeyPair()
        const publicKey = await indexedDbClient?.getPublicKey()
        console.log("[GoogleAuth] Fresh public key created:", publicKey ? publicKey.substring(0, 20) + "..." : "null")

        if (publicKey) {
          const hashedPublicKey = sha256(publicKey as `0x${string}`).replace(
            /^0x/,
            ""
          )
          console.log("[GoogleAuth] Generated nonce:", hashedPublicKey.substring(0, 20) + "...")
          setNonce(hashedPublicKey)
        } else {
          console.error("[GoogleAuth] Failed to get public key")
        }
      } catch (error) {
        console.error("[GoogleAuth] Error initializing key pair:", error)
      }
    }

    if (indexedDbClient) {
      initializeKeyPairAndGetPublicKey()
    } else {
      console.log("[GoogleAuth] IndexedDB client not yet available")
    }
  }, [indexedDbClient])

  const onSuccess = async (credentialResponse: CredentialResponse) => {
    console.log("[GoogleAuth] Google OAuth success callback triggered")
    console.log("[GoogleAuth] Credential response:", {
      hasCredential: !!credentialResponse.credential,
      credentialLength: credentialResponse.credential?.length,
      clientId: credentialResponse.clientId,
    })
    
    if (credentialResponse.credential) {
      console.log("[GoogleAuth] Valid credential received, starting login process")
      try {
        // Check if public key is still available
        const publicKey = await indexedDbClient?.getPublicKey()
        console.log("[GoogleAuth] Public key check before login:", publicKey ? "available" : "missing")
        
        if (!publicKey) {
          console.error("[GoogleAuth] Public key missing during login attempt")
          return
        }
        
        console.log("[GoogleAuth] About to call loginWithGoogle")
        console.log("[GoogleAuth] loginWithGoogle function:", typeof loginWithGoogle)
        console.log("[GoogleAuth] loginWithGoogle function name:", loginWithGoogle.name)
        
        const result = loginWithGoogle(credentialResponse.credential as string)
        console.log("[GoogleAuth] loginWithGoogle returned:", result)
        console.log("[GoogleAuth] loginWithGoogle result type:", typeof result)
        
        result
          .then(() => {
            console.log("[GoogleAuth] loginWithGoogle completed successfully")
          })
          .catch((error) => {
            console.error("[GoogleAuth] loginWithGoogle failed:", error)
            console.error("[GoogleAuth] loginWithGoogle error stack:", error.stack)
          })
        console.log("[GoogleAuth] loginWithGoogle call initiated")
      } catch (error) {
        console.error("[GoogleAuth] Error during Google login:", error)
      }
    } else {
      console.error("[GoogleAuth] No credential received in success callback")
    }
  }

  const onError = () => {
    console.error("[GoogleAuth] Google OAuth failed or was cancelled")
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {nonce ? (
        <GoogleLogin
          nonce={nonce}
          width={235}
          containerProps={{
            className: "w-full bg-white flex justify-center rounded-md",
          }}
          onSuccess={onSuccess}
          onError={onError}
          useOneTap={false}
          auto_select={false}
        />
      ) : (
        <Skeleton className="h-10 w-full" />
      )}
    </GoogleOAuthProvider>
  )
}

export default GoogleAuth

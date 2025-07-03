import { Address } from "viem";

interface PredictAddressRequest {
  sessionAddress: Address;
  adminAddress: Address;
}

export const fetchPredictAddress = (
  addressRequest: PredictAddressRequest,
  {
    apiKey,
    apiUrl,
  }: {
    apiKey: string;
    apiUrl: string;
  }
): Promise<{
  predictedAddress: Address;
}> => {
  // const config = getRuntimeConfig();
  // const url = new URL(
  //   "/api/account/predict-address",
  //   config.VITE_ONEBALANCE_API
  // );
  const body = JSON.stringify({
    sessionAddress: addressRequest.sessionAddress,
    adminAddress: addressRequest.adminAddress,
  });
  
  console.log("[fetchPredictAddress] Body:", body);
  
  return fetch("/api/predict-address", {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let error;
      if (contentType && contentType.includes('application/json')) {
        error = await response.json();
      } else {
        const text = await response.text();
        error = { message: text, status: response.status };
      }
      throw error;
    }
    return response.json();
  });
};

// export const fetchPredictAddress = (
//   addressRequest: PredictAddressRequest,
//   {
//     apiKey,
//     apiUrl,
//   }: {
//     apiKey: string;
//     apiUrl: string;
//   }
// ): Promise<{
//   predictedAddress: Address;
// }> => {
//   const url = new URL("/api/account/predict-address", apiUrl);
//   console.log("[fetchPredictAddress] Making request to:", url.toString());
//   console.log("[fetchPredictAddress] Request payload:", {
//     sessionAddress: addressRequest.sessionAddress,
//     adminAddress: addressRequest.adminAddress,
//   });
//   console.log("[fetchPredictAddress] API key present:", !!apiKey);
//
//   return fetch(url, {
//     method: "post",
//     body: JSON.stringify({
//       sessionAddress: addressRequest.sessionAddress,
//       adminAddress: addressRequest.adminAddress,
//     }),
//     headers: {
//       "x-api-key": apiKey,
//       "Content-Type": "application/json",
//     },
//   }).then(async (response) => {
//     console.log("[fetchPredictAddress] Response status:", response.status);
//     console.log("[fetchPredictAddress] Response ok:", response.ok);
//     console.log("[fetchPredictAddress] Response headers:", Object.fromEntries(response.headers.entries()));
//
//     const responseText = await response.text();
//     console.log("[fetchPredictAddress] Response text:", responseText);
//
//     if (!response.ok) {
//       let errorData;
//       try {
//         errorData = JSON.parse(responseText);
//       } catch (e) {
//         errorData = { message: responseText };
//       }
//       console.error("[fetchPredictAddress] Error response:", errorData);
//       throw errorData;
//     }
//
//     let jsonData;
//     try {
//       jsonData = JSON.parse(responseText);
//       console.log("[fetchPredictAddress] Success response:", jsonData);
//       return jsonData;
//     } catch (e) {
//       console.error("[fetchPredictAddress] Failed to parse response as JSON:", responseText);
//       throw new Error("Invalid JSON response");
//     }
//   }).catch((error) => {
//     console.error("[fetchPredictAddress] Network or other error:", error);
//     throw error;
//   });
// };

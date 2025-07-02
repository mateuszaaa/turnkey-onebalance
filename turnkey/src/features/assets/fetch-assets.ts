import { Asset } from "./assets";

export const fetchAssets = ({
  apiUrl,
  apiKey,
}: {
  apiUrl: string;
  apiKey: string;
}): Promise<Asset[]> => {
  return fetch("/api/assets/list", {
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    if (!response.ok) throw await response.json();
    return response.json();
  });
};

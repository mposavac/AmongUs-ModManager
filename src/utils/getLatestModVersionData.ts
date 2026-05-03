import axios from "axios";

export const getLatestModVersionData = async () => {
  const repoUrl = import.meta.env.VITE_MOD_API_URL;
  const { data: allData } = await axios.get(repoUrl);

  const latestReleaseData = allData.find((release) =>
    release.assets.some((asset) => asset.name.includes("steam-itch.zip")),
  );

  return latestReleaseData;
};

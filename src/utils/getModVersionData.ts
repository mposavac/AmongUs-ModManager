import axios from "axios";

export const getModVersionData = async (modVersion: string) => {
  const repoUrl = import.meta.env.VITE_MOD_API_URL;
  const { data: allData } = await axios.get(repoUrl);

  const latestReleaseData = allData.find((release) =>
    release?.assets?.some((asset) => asset.name.includes("steam-itch.zip")),
  );

  const targetReleaseData = allData.find((release) =>
    release?.assets?.some((asset) =>
      asset.name.includes(`${modVersion}-x86-steam-itch.zip`),
    ),
  );

  return modVersion === "latest" ? latestReleaseData : targetReleaseData;
};

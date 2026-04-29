import axios from "axios";

export const getLatestModVersion = async () => {
  const { data } = await axios.get(process.env.MOD_API_URL || "");
  return data.name || "Not found";
};

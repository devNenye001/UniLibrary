import axiosClient from "./axiosClient.js";
import { extractPayload, extractMaterials } from "./apiUtils.js";

export async function sendMessage(message, previousMessages = []) {
  const response = await axiosClient.post("/chatbot", { message, previousMessages });
  const payload = extractPayload(response) ?? {};

  return {
    reply: payload?.reply ?? payload?.message ?? payload?.response ?? "",
    materials: extractMaterials({ data: payload?.materials ?? [] }),
  };
}

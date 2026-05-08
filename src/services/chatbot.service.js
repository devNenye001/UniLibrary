import axiosClient from "./axiosClient.js";
import { wait } from "./_helpers.js";

export async function sendMessage(message, previousMessages = []) {
  try {
    const data = await axiosClient.post("/chatbot", { message, previousMessages });
    return {
      reply: data?.reply ?? data?.message ?? data?.response ?? "Here's what I found for you.",
      materials: data?.materials ?? [],
    };
  } catch {
    await wait(400);
    return {
      reply: mockReply(message),
      materials: mockMaterials(message),
    };
  }
}

function mockReply(text) {
  const q = text.toLowerCase();
  if (q.includes("past question")) {
    return "I found past questions that match your search. Here are the most relevant results from the library:";
  }
  if (q.includes("engineering") || q.includes("2022")) {
    return "Here are Engineering materials available in our library. Click any card below to view the full document.";
  }
  if (q.includes("department")) {
    return "I can help you find materials for your department. Try browsing by department on the Browse page, or tell me your specific department and I'll search for you.";
  }
  if (q.includes("computer science") || q.includes("csc")) {
    return "I found Computer Science materials that might help. Here are the top results:";
  }
  return "I searched the library for your query. You can also use the Search page for advanced filtered searches, or Browse to explore all available materials by department and level.";
}

function mockMaterials(text) {
  const q = text.toLowerCase();
  if (q.includes("past question") || q.includes("gst")) {
    return [{ id: "doc-2", title: "GST 102 Past Questions and Answers", courseCode: "GST 102" }];
  }
  if (q.includes("machine learning") || q.includes("csc 401") || q.includes("computer science")) {
    return [{ id: "doc-1", title: "CSC 401 Machine Learning Lecture Notes", courseCode: "CSC 401" }];
  }
  if (q.includes("linear algebra") || q.includes("mth")) {
    return [{ id: "doc-3", title: "MTH 201 Linear Algebra Revision Pack", courseCode: "MTH 201" }];
  }
  return [];
}

import axiosClient from "./axiosClient.js";
import { wait } from "./_helpers.js";

export async function getStats() {
  try {
    return await axiosClient.get("/admin/stats");
  } catch {
    await wait(300);
    const now = new Date();
    const dayLabel = (offset) => {
      const d = new Date(now);
      d.setDate(d.getDate() - offset);
      return d.toLocaleDateString("en-GB", { weekday: "short" });
    };
    return {
      materialsByDepartment: [
        { department: "Computer Science", count: 28 },
        { department: "Mathematics", count: 19 },
        { department: "Elec. Engineering", count: 15 },
        { department: "Civil Engineering", count: 12 },
        { department: "Economics", count: 10 },
        { department: "General Studies", count: 22 },
        { department: "Physics", count: 8 },
        { department: "Law", count: 6 },
      ],
      usersByRole: [
        { role: "Student", count: 145 },
        { role: "Lecturer", count: 23 },
        { role: "Admin", count: 4 },
      ],
      searchesOverTime: [
        { date: dayLabel(6), count: 42 },
        { date: dayLabel(5), count: 58 },
        { date: dayLabel(4), count: 35 },
        { date: dayLabel(3), count: 72 },
        { date: dayLabel(2), count: 68 },
        { date: dayLabel(1), count: 29 },
        { date: dayLabel(0), count: 44 },
      ],
      mostDownloaded: { title: "CSC 401 Machine Learning Lecture Notes", downloads: 234 },
      mostSearched: "past questions 300 level",
      searchesToday: 44,
      topMaterials: [
        { id: "doc-1", title: "CSC 401 Machine Learning Lecture Notes", courseCode: "CSC 401", downloads: 234 },
        { id: "doc-2", title: "GST 102 Past Questions and Answers", courseCode: "GST 102", downloads: 187 },
        { id: "doc-3", title: "MTH 201 Linear Algebra Revision Pack", courseCode: "MTH 201", downloads: 156 },
        { id: "doc-4", title: "EEE 301 Circuit Analysis Notes", courseCode: "EEE 301", downloads: 134 },
        { id: "doc-5", title: "ECO 201 Microeconomics Past Questions", courseCode: "ECO 201", downloads: 112 },
      ],
    };
  }
}

export async function getUsers() {
  try {
    const data = await axiosClient.get("/admin/users");
    return data?.users ?? data?.data ?? data ?? [];
  } catch {
    await wait(300);
    return [
      { id: "u-1", name: "Alice Johnson", email: "alice@uni.edu", role: "student", status: "active", createdAt: "2026-01-10" },
      { id: "u-2", name: "Dr. Ibrahim Musa", email: "ibrahim@uni.edu", role: "lecturer", status: "active", createdAt: "2026-01-05" },
      { id: "u-3", name: "Bob Smith", email: "bob@uni.edu", role: "student", status: "pending", createdAt: "2026-02-14" },
      { id: "u-4", name: "Amina Yusuf", email: "amina@uni.edu", role: "student", status: "active", createdAt: "2026-02-20" },
      { id: "u-5", name: "Dr. Grace Obi", email: "grace@uni.edu", role: "lecturer", status: "pending", createdAt: "2026-03-01" },
    ];
  }
}

export async function approveUser(userId) {
  try {
    return await axiosClient.patch(`/admin/users/${userId}/approve`);
  } catch {
    await wait(300);
    return { success: true, mode: "demo" };
  }
}

export async function rejectUser(userId) {
  try {
    return await axiosClient.patch(`/admin/users/${userId}/reject`);
  } catch {
    await wait(300);
    return { success: true, mode: "demo" };
  }
}

export async function approveMaterial(materialId) {
  try {
    return await axiosClient.patch(`/admin/materials/${materialId}/approve`);
  } catch {
    await wait(300);
    return { success: true, mode: "demo" };
  }
}

export async function rejectMaterial(materialId) {
  try {
    return await axiosClient.patch(`/admin/materials/${materialId}/reject`);
  } catch {
    await wait(300);
    return { success: true, mode: "demo" };
  }
}

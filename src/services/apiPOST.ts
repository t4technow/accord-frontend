import axiosInstance from "@/config/axiosInstance";
import { ServerCreationInfo } from "@/lib/Types";

const handleRequest = async (request: Promise<any>) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addToGroupRequest = async (groupId: number, userIds: number[]) => {
  return await handleRequest(axiosInstance.post(`add-to-group/${groupId}/`, {
    members: userIds,
  }));
};

export const createServerRequest = async(serverInfo: ServerCreationInfo) => {
  return await handleRequest(axiosInstance.post("server/create/", serverInfo, {
      headers: { "Content-Type": "multipart/form-data" },
    }))
}


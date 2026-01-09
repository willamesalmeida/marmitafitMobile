// src/services/secureStore.js
import * as SecureStore from "expo-secure-store";
import { ACCESS_KEY, REFRESH_KEY, DEVICE_ID_KEY } from "../config/storageKeys";

export const setAccessToken = async (token) => {
  try {
    await SecureStore.setItemAsync(ACCESS_KEY, token);
  } catch (error) {
    console.warn("setAccessToken", error);
  }
};
export const getAccessToken = async () => {
  try {
    return await SecureStore.getItemAsync(ACCESS_KEY);
  } catch (error) {
    console.warn("getAccessToken", error);
    return null;
  }
};
export const setRefreshToken = async (token) => {
  try {
    await SecureStore.setItemAsync(REFRESH_KEY, token);
  } catch (error) {
    console.warn("setRefreshToken", error);
  }
};
export const getRefreshToken = async () => {
  try {
    return await SecureStore.getItemAsync(REFRESH_KEY);
  } catch (error) {
    console.warn("getRefreshToken", error);
    return null;
  }
};
export const clearTokens = async () => {
  try {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  } catch (error) {
    console.warn("clearTokens", error);
  }
};

export const setDeviceId = async (id) => {
  try {
    await SecureStore.setItemAsync(DEVICE_ID_KEY, id);
  } catch (error) {
    console.warn("setDeviceId", error);
  }
};
export const getDeviceId = async () => {
  try {
    return await SecureStore.getItemAsync(DEVICE_ID_KEY);
  } catch (error) {
    console.warn("getDeviceId", error);
    return null;
  }
};

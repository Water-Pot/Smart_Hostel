"use client";

import { useState } from "react";
import { isTokenExpired } from "@/lib/request-helpers";

export const TOKEN_KEY = "smart_hostel_token";
const STATUS_KEY = "smart_hostel_status";
const RESPONSE_KEY = "smart_hostel_response";

const DEFAULT_STATUS = "Ready. Use the pages from the left menu.";
const DEFAULT_RESPONSE = "No response yet.";

function readValue(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return localStorage.getItem(key) ?? fallback;
}

function writeValue(key: string, value: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
}

export function useClientSession() {
  const [token, setTokenState] = useState(() => {
    const saved = readValue(TOKEN_KEY, "");
    if (!saved || isTokenExpired(saved)) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY);
      }
      return "";
    }
    return saved;
  });

  const [status, setStatusState] = useState(() => readValue(STATUS_KEY, DEFAULT_STATUS));
  const [responseText, setResponseTextState] = useState(() => readValue(RESPONSE_KEY, DEFAULT_RESPONSE));

  const setStatus = (value: string) => {
    setStatusState(value);
    writeValue(STATUS_KEY, value);
  };

  const setResponseText = (value: string) => {
    setResponseTextState(value);
    writeValue(RESPONSE_KEY, value);
  };

  const setToken = (value: string) => {
    setTokenState(value);
    if (typeof window === "undefined") return;
    if (value) {
      localStorage.setItem(TOKEN_KEY, value);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  return {
    token,
    status,
    responseText,
    setToken,
    setStatus,
    setResponseText,
  };
}

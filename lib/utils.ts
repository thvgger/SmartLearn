import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely parses the JSON response from a fetch request.
 * If parsing fails or the content is not JSON, returns null.
 */
export async function safeJson(response: Response) {
  try {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
  } catch (e) {
    // Ignore and return null
  }
  return null;
}

/**
 * Extracts a user-friendly error message from a fetch Response or an Error object.
 */
export async function getErrorMessage(
  errorOrResponse: any,
  defaultMessage = "An unexpected error occurred. Please try again."
): Promise<string> {
  if (errorOrResponse instanceof Response) {
    const data = await safeJson(errorOrResponse);
    if (data) {
      return data.error || data.message || defaultMessage;
    }
    
    // Status-based fallback messages
    if (errorOrResponse.status === 404) {
      return "Requested service was not found. Please contact support.";
    }
    if (errorOrResponse.status === 401) {
      return "Unauthorized access. Please log in again.";
    }
    if (errorOrResponse.status === 403) {
      return "You do not have permission to perform this action.";
    }
    if (errorOrResponse.status >= 500) {
      return "Our servers are experiencing issues. Please try again in a few moments.";
    }
    return defaultMessage;
  }

  if (errorOrResponse instanceof Error) {
    const msg = errorOrResponse.message;
    if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
      return "Network error: Please check your internet connection and try again.";
    }
    if (msg.includes("Unexpected token") || msg.includes("is not valid JSON") || msg.includes("JSON.parse")) {
      return "A server communication error occurred. Please try again later.";
    }
    return msg;
  }

  if (typeof errorOrResponse === "string") {
    return errorOrResponse;
  }

  return defaultMessage;
}

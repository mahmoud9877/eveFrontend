export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
  logoutCallback: () => void
): Promise<any> => {
  try {
    let accessToken = localStorage.getItem("accessToken");
    console.log("Access Token:", accessToken);

    let res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        authorization: `employee${accessToken}`,
        ...(options.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
      },
      credentials: "include",
    });

    // ✅ طبعنا الرد لو فيه مشكلة
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Initial fetch failed:", res.status, errorText);
    }

    if (res.ok) return await res.json();

    if (res.status === 401) {
      console.log("Access token expired, trying refresh...");

      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!refreshRes.ok) {
        console.log("Refresh failed, logging out...");
        logoutCallback();
        return null;
      }

      const { accessToken: newAccessToken } = await refreshRes.json();
      localStorage.setItem("accessToken", newAccessToken);
      accessToken = newAccessToken;

      const retryRes = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          authorization: `employee${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const retryText = await retryRes.text();
      if (!retryRes.ok) {
        console.error("Retry failed:", retryRes.status, retryText);
        return null;
      }

      try {
        return JSON.parse(retryText);
      } catch (err) {
        console.error("Failed to parse retry JSON:", retryText);
        return null;
      }
    }

    return null;
  } catch (err) {
    console.error("Error in fetchWithAuth:", err);
    logoutCallback();
    return null;
  }
};

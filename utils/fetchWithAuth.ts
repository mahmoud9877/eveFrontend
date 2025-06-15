export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
  logoutCallback: () => void
): Promise<any> => {
  let accessToken = localStorage.getItem("accessToken");

  const makeRequest = async (token: string) => {
    return await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        authorization: `employee${token}`,
        ...(options.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
      },
      credentials: "include",
    });
  };

  try {
    // 🟢 أول محاولة بالتوكن الحالي
    let res = await makeRequest(accessToken || "");

    const resText = await res.text();
    let json: any;
    try {
      json = JSON.parse(resText);
    } catch {
      json = {};
    }

    // ✅ لو التوكن شغالة رجّع الرد
    if (res.ok) return json;

    // ⛔ لو التوكن منتهية نبدأ بروسيجر الـ Refresh
    if (
      json?.message === "jwt expired" ||
      json?.error?.name === "TokenExpiredError"
    ) {
      console.log("Access token expired. Attempting to refresh...");

      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh-token`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      // لو فشل الـ Refresh → Logout
      if (!refreshRes.ok) {
        console.warn("Refresh token invalid or expired. Logging out.");
        logoutCallback();
        return null;
      }

      // ✅ جدد التوكن وخزنها
      const { accessToken: newAccessToken } = await refreshRes.json();
      localStorage.setItem("accessToken", newAccessToken);

      // 🔁 أعد إرسال نفس الريكوست بالتوكن الجديدة
      const retryRes = await makeRequest(newAccessToken);
      const retryText = await retryRes.text();

      try {
        return JSON.parse(retryText);
      } catch {
        console.error("Retry succeeded but JSON parsing failed:", retryText);
        return null;
      }
    }

    // ⛔ مشاكل تانية (مش Expired) → طبعها بس
    console.error("Initial fetch failed:", res.status, resText);
    return null;
  } catch (err) {
    console.error("Unexpected error in fetchWithAuth:", err);
    logoutCallback();
    return null;
  }
};

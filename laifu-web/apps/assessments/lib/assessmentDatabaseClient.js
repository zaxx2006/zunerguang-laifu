function getAssessmentApiUrl() {
  const value = process.env.NEXT_PUBLIC_ASSESSMENT_API_URL?.trim();
  if (!value) throw new Error("Missing NEXT_PUBLIC_ASSESSMENT_API_URL.");
  return value.replace(/\/+$/, "");
}

export async function submitAssessmentResult(payload) {
  try {
    const response = await fetch(`${getAssessmentApiUrl()}/v1/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        data: null,
        error: new Error(result?.error?.message || "提交失败。"),
      };
    }
    return { data: result.data ?? null, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error("提交失败。"),
    };
  }
}

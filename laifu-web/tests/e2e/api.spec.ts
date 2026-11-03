import { expect, test } from "@playwright/test";

const apiBaseUrl = "http://127.0.0.1:4175";
const adminHeaders = { Authorization: "Bearer laifu-e2e-admin-token-32-characters" };

test("Worker and D1 complete the submission management lifecycle", async ({ request }) => {
  test.skip(test.info().project.name !== "desktop", "API lifecycle runs once");
  const health = await request.get(`${apiBaseUrl}/health`);
  expect(health.status()).toBe(200);
  expect(await health.json()).toEqual({ ok: true, storage: "cloudflare-d1" });
  const blocked = await request.post(`${apiBaseUrl}/v1/submissions`, { data: {}, headers: { Origin: "https://blocked.example" } });
  expect(blocked.status()).toBe(403);
  const contactName = `端到端测试${Date.now()}`;
  const created = await request.post(`${apiBaseUrl}/v1/submissions`, {
    data: {
      assessment_type: "divorce_readiness",
      service_intent: "professional_support",
      total_score: 18,
      dynamic_full_score: 30,
      score_rate: 0.6,
      result_level: "medium",
      result_label: "需要进一步准备",
      child_gate_answer: true,
      cross_border_gate_answer: false,
      weaknesses: ["economic"],
      dimension_scores: { economic: 3 },
      answers: { q1: 3 },
      contact_name: contactName,
      contact_phone: "+86 138 0000 0000",
      contact_wechat: "laifu-e2e",
      submission_source: "playwright",
    },
    headers: { Origin: "http://127.0.0.1:4174" },
  });
  expect(created.status()).toBe(201);
  expect(created.headers()["access-control-allow-origin"]).toBe("http://127.0.0.1:4174");
  const createdBody = await created.json();
  const id = createdBody.data.id as string;
  expect(id).toBeTruthy();
  const unauthorized = await request.get(`${apiBaseUrl}/v1/admin/leads/${id}`);
  expect(unauthorized.status()).toBe(401);
  const detail = await request.get(`${apiBaseUrl}/v1/admin/leads/${id}`, { headers: adminHeaders });
  expect(detail.status()).toBe(200);
  expect((await detail.json()).data).toMatchObject({ id, contact_name: contactName, follow_up_status: "new" });
  const list = await request.get(`${apiBaseUrl}/v1/admin/leads?name=${encodeURIComponent(contactName)}`, { headers: adminHeaders });
  expect(list.status()).toBe(200);
  expect((await list.json()).data).toMatchObject({ count: 1, page: 1, pageSize: 20 });
  const updated = await request.patch(`${apiBaseUrl}/v1/admin/leads/${id}`, { data: { follow_up_status: "contacted", updated_by: "playwright" }, headers: adminHeaders });
  expect(updated.status()).toBe(200);
  expect((await updated.json()).data).toMatchObject({ follow_up_status: "contacted", updated_by: "playwright" });
  const preview = await request.post(`${apiBaseUrl}/v1/admin/leads/${id}/report-preview`, { headers: adminHeaders });
  expect(preview.status()).toBe(200);
  expect((await preview.json()).data).toMatchObject({ report_version: "v1" });
  const removed = await request.delete(`${apiBaseUrl}/v1/admin/leads`, { data: { ids: [id] }, headers: adminHeaders });
  expect(removed.status()).toBe(200);
  expect(await removed.json()).toEqual({ data: { deletedCount: 1 } });
  const missing = await request.get(`${apiBaseUrl}/v1/admin/leads/${id}`, { headers: adminHeaders });
  expect(missing.status()).toBe(404);
});

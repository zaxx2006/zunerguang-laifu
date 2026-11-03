import assert from "node:assert/strict";
import { test } from "node:test";
import { browserOrigins } from "./environment";

function withOrigins(cms: string, website: string, check: () => void) {
  const previousCMS = process.env.PAYLOAD_PUBLIC_SERVER_URL;
  const previousWebsite = process.env.LAIFU_WEB_URL;
  process.env.PAYLOAD_PUBLIC_SERVER_URL = cms;
  process.env.LAIFU_WEB_URL = website;
  try { check(); }
  finally {
    if (previousCMS === undefined) delete process.env.PAYLOAD_PUBLIC_SERVER_URL;
    else process.env.PAYLOAD_PUBLIC_SERVER_URL = previousCMS;
    if (previousWebsite === undefined) delete process.env.LAIFU_WEB_URL;
    else process.env.LAIFU_WEB_URL = previousWebsite;
  }
}

test("local CMS cookie authentication accepts localhost and 127.0.0.1 on the configured port", () => {
  withOrigins("http://127.0.0.1:5158", "http://127.0.0.1:3001", () => {
    const origins = browserOrigins();
    for (const origin of ["http://127.0.0.1:5158", "http://localhost:5158"]) {
      assert.ok(origins.includes(origin), origin);
    }
    for (const origin of ["https://untrusted.example", "http://localhost:5159", "http://192.168.1.20:5158"]) {
      assert.ok(!origins.includes(origin), origin);
    }
  });
});

test("configured localhost also accepts its numeric alias without duplicate origins", () => {
  withOrigins("http://localhost:5158/", "http://localhost:5158", () => {
    assert.deepEqual(browserOrigins().sort(), ["http://127.0.0.1:5158", "http://localhost:5158"].sort());
  });
});

test("production hosts keep exact origins and do not gain loopback access", () => {
  withOrigins("https://cms.example.com/", "https://www.example.com/", () => {
    assert.deepEqual(browserOrigins().sort(), ["https://cms.example.com", "https://www.example.com"].sort());
  });
});

import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl, normalizeIndiaPhoneForWaMe, resolveWhatsAppUrl } from "./business-contact";

describe("normalizeIndiaPhoneForWaMe", () => {
  it("normalizes 10-digit Indian mobile", () => {
    expect(normalizeIndiaPhoneForWaMe("8076577033")).toBe("918076577033");
  });

  it("keeps 91 prefix", () => {
    expect(normalizeIndiaPhoneForWaMe("+91 80765 77033")).toBe("918076577033");
  });
});

describe("resolveWhatsAppUrl", () => {
  it("prefers explicit whatsapp_url", () => {
    expect(
      resolveWhatsAppUrl({
        whatsapp_url: "https://wa.me/918076577033",
        contact_phone: "9999999999",
      }),
    ).toBe("https://wa.me/918076577033");
  });

  it("builds from contact_phone", () => {
    expect(resolveWhatsAppUrl({ contact_phone: "8076577033" })).toBe(
      buildWhatsAppUrl("918076577033"),
    );
  });
});

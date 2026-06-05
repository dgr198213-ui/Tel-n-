import { describe, it, expect, vi, beforeEach } from "vitest";
import { STRIPE_PRODUCTS, getPlanFeatures, getPlanPrice } from "./products";

describe("Stripe Products Configuration", () => {
  it("should define ESTANDAR plan with correct price", () => {
    expect(STRIPE_PRODUCTS.ESTANDAR.pricePerMonth).toBe(9.99);
    expect(STRIPE_PRODUCTS.ESTANDAR.name).toBe("Plan Estándar");
  });

  it("should define PREMIUM plan with correct price", () => {
    expect(STRIPE_PRODUCTS.PREMIUM.pricePerMonth).toBe(24.99);
    expect(STRIPE_PRODUCTS.PREMIUM.name).toBe("Plan Premium");
  });

  it("should return correct features for free plan", () => {
    const features = getPlanFeatures("free");
    expect(features.fotos).toBe(1);
    expect(features.videos).toBe(0);
    expect(features.analytics).toBe(false);
    expect(features.priority).toBe(false);
  });

  it("should return correct features for estandar plan", () => {
    const features = getPlanFeatures("estandar");
    expect(features.fotos).toBe(3);
    expect(features.videos).toBe(1);
    expect(features.analytics).toBe(true);
    expect(features.priority).toBe(false);
  });

  it("should return correct features for premium plan", () => {
    const features = getPlanFeatures("premium");
    expect(features.fotos).toBe(3);
    expect(features.videos).toBe(3);
    expect(features.analytics).toBe(true);
    expect(features.priority).toBe(true);
  });

  it("should return correct price for estandar plan", () => {
    const price = getPlanPrice("estandar");
    expect(price).toBe(9.99);
  });

  it("should return correct price for premium plan", () => {
    const price = getPlanPrice("premium");
    expect(price).toBe(24.99);
  });

  it("should have all required fields in ESTANDAR plan", () => {
    const plan = STRIPE_PRODUCTS.ESTANDAR;
    expect(plan).toHaveProperty("name");
    expect(plan).toHaveProperty("description");
    expect(plan).toHaveProperty("pricePerMonth");
    expect(plan).toHaveProperty("features");
  });

  it("should have all required fields in PREMIUM plan", () => {
    const plan = STRIPE_PRODUCTS.PREMIUM;
    expect(plan).toHaveProperty("name");
    expect(plan).toHaveProperty("description");
    expect(plan).toHaveProperty("pricePerMonth");
    expect(plan).toHaveProperty("features");
  });
});

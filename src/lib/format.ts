import { site } from "@/config/site";

const priceFormatter = new Intl.NumberFormat(site.currency.locale, {
  style: "currency",
  currency: site.currency.code,
  currencyDisplay: site.currency.display,
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number) {
  return priceFormatter.format(amount);
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

export function formatDate(iso: string) {
  return dateFormatter.format(new Date(`${iso}T00:00:00Z`));
}

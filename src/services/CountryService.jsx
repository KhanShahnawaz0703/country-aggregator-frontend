const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "http://country-aggregator-api-env.eba-6iq87h7d.us-east-1.elasticbeanstalk.com";

// Adjust this path to match your FastAPI router endpoint.
// Examples could be:
//   /countries/{countryName}
//   /countries/{countryName}/summary
//   /country?name=...
const buildUrl = (countryName) =>
  `${API_BASE_URL}/countries/${encodeURIComponent(countryName)}/summary`;

export const getCountrySummary = async (countryName) => {
  const res = await fetch(buildUrl(countryName), {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    // try to surface FastAPI's {"detail": "..."} message if present
    let detail = "";
    try {
      const body = await res.json();
      detail = body?.detail ? ` - ${body.detail}` : "";
    } catch {
      // ignore JSON parsing errors
    }
    throw new Error(`Failed to fetch country (${res.status})${detail}`);
  }

  const data = await res.json();

  // Normalize the response into the shape your UI expects
  // (your UI mock uses "timezones: [...]"; backend adds "timezone": "..."
  // and may also have original "timezones" from REST Countries)
  return {
    country: data?.name?.common ?? data?.country ?? countryName,
    capital: Array.isArray(data?.capital) ? data.capital[0] : data?.capital ?? null,
    region: data?.region ?? null,
    subregion: data?.subregion ?? null,
    population: data?.population ?? null,
    currency: data?.currency ?? null
  };
};
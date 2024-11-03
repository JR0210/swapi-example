export default function buildQuery(
  baseQuery: string,
  params: Record<string, string | number | undefined>
): string {
  const url = new URL(baseQuery);

  // Append all valid params to the URLSearchParams object of the URL
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.append(key, value.toString());
    }
  });

  // Remove the dummy origin before returning
  return baseQuery.includes("?")
    ? baseQuery + "&" + url.searchParams.toString()
    : baseQuery + "?" + url.searchParams.toString();
}

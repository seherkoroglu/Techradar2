export async function getAIOneriler(company, sector, subfields) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/ai/suggestions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ company, sector, subfields }),
  });

  const data = await res.json();
  return data.suggestions;
}

import { IPerson } from "@/types/global";

export default async function useFetchFavourites(
  ids: string[]
): Promise<IPerson[]> {
  try {
    const promises = ids.map((id) =>
      fetch(`https://swapi.dev/api/people/${id}/`)
    );
    const responses = await Promise.all(promises);
    const data = await Promise.all(
      responses.map((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch character data for URL: ${response.url}`
          );
        }
        return response.json();
      })
    );
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

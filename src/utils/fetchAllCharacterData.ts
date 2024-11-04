import { IPerson, IPlanet, IFilm, IStarship } from "@/types/global";
import { CharacterDetails } from "@/types/formatted";

export default async function fetchCharacterDetails(
  slug: string
): Promise<CharacterDetails> {
  try {
    // Fetch character basic details
    const personResponse = await fetch(`https://swapi.dev/api/people/${slug}/`);
    if (!personResponse.ok) {
      throw new Error(`Failed to fetch character data for slug: ${slug}`);
    }
    const data = (await personResponse.json()) as IPerson;

    // Fetch homeworld data
    const homeworldResponse = await fetch(data.homeworld);
    if (!homeworldResponse.ok) {
      throw new Error(`Failed to fetch homeworld data for: ${data.homeworld}`);
    }
    const homeworldData: IPlanet = await homeworldResponse.json();

    // Fetch films data
    const filmsPromises = data.films.map((filmUrl) => fetch(filmUrl));
    const filmsResponses = await Promise.all(filmsPromises);
    const filmsData: IFilm[] = await Promise.all(
      filmsResponses.map((filmResponse) => {
        if (!filmResponse.ok) {
          throw new Error(
            `Failed to fetch film data for URL: ${filmResponse.url}`
          );
        }
        return filmResponse.json();
      })
    );

    // Fetch starships data
    const starshipsPromises = data.starships.map((shipUrl) => fetch(shipUrl));
    const starshipsResponses = await Promise.all(starshipsPromises);
    const starshipsData: IStarship[] = await Promise.all(
      starshipsResponses.map((shipResponse) => {
        if (!shipResponse.ok) {
          throw new Error(
            `Failed to fetch starship data for URL: ${shipResponse.url}`
          );
        }
        return shipResponse.json();
      })
    );

    // Combine all data into a single object
    return {
      name: data.name,
      height: data.height,
      mass: data.mass,
      hair_color: data.hair_color,
      eye_color: data.eye_color,
      gender: data.gender,
      homeworld: homeworldData,
      films: filmsData,
      starships: starshipsData,
    };
  } catch (error) {
    console.error("Error fetching person details:", error);
    throw error;
  }
}

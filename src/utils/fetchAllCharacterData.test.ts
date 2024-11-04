import fetchCharacterDetails from "./fetchAllCharacterData";
import { IPerson, IPlanet, IFilm, IStarship } from "@/types/global";

describe("fetchCharacterDetails", () => {
  let mockPerson: IPerson;
  let mockHomeworld: IPlanet;
  let mockFilms: IFilm[];
  let mockStarships: IStarship[];

  beforeEach(() => {
    global.fetch = jest.fn();

    // Mock data
    mockPerson = {
      name: "Luke Skywalker",
      height: "172",
      mass: "77",
      hair_color: "blond",
      eye_color: "blue",
      gender: "male",
      skin_color: "fair",
      birth_year: "19BBY",
      species: ["https://swapi.dev/api/species/1/"],
      vehicles: ["https://swapi.dev/api/vehicles/14/"],
      homeworld: "https://swapi.dev/api/planets/1/",
      films: [
        "https://swapi.dev/api/films/1/",
        "https://swapi.dev/api/films/2/",
      ],
      starships: ["https://swapi.dev/api/starships/12/"],
      created: "2014-12-09T13:50:51.644000Z",
      edited: "2014-12-20T21:17:56.891000Z",
      url: "https://swapi.dev/api/people/1/",
    };

    mockHomeworld = {
      name: "Tatooine",
      climate: "arid",
      population: "200000",
      terrain: "desert",
      diameter: "10465",
      gravity: "1 standard",
      orbital_period: "304",
      rotation_period: "23",
      surface_water: "1",
      residents: ["https://swapi.dev/api/people/1/"],
      films: ["https://swapi.dev/api/films/1/"],
      created: "2014-12-09T13:50:49.641000Z",
      edited: "2014-12-20T20:58:18.411000Z",
      url: "https://swapi.dev/api/planets/1/",
    };

    mockFilms = [
      {
        title: "A New Hope",
        release_date: "1977-05-25",
        director: "George Lucas",
        episode_id: 4,
        opening_crawl: "It is a period of civil war...",
        producer: "Gary Kurtz, Rick McCallum",
        characters: ["https://swapi.dev/api/people/1/"],
        planets: ["https://swapi.dev/api/planets/1/"],
        starships: ["https://swapi.dev/api/starships/12/"],
        vehicles: ["https://swapi.dev/api/vehicles/4/"],
        species: ["https://swapi.dev/api/species/1/"],
        created: "2014-12-10T14:23:31.880000Z",
        edited: "2014-12-20T19:49:45.256000Z",
        url: "https://swapi.dev/api/films/1/",
      },
      {
        title: "The Empire Strikes Back",
        release_date: "1980-05-17",
        director: "Irvin Kershner",
        episode_id: 5,
        opening_crawl: "It is a dark time for the Rebellion...",
        producer: "Gary Kurtz, Rick McCallum",
        characters: ["https://swapi.dev/api/people/1/"],
        planets: ["https://swapi.dev/api/planets/1/"],
        starships: ["https://swapi.dev/api/starships/12/"],
        vehicles: ["https://swapi.dev/api/vehicles/15/"],
        species: ["https://swapi.dev/api/species/1/"],
        created: "2014-12-12T11:26:24.656000Z",
        edited: "2014-12-15T13:07:53.386000Z",
        url: "https://swapi.dev/api/films/2/",
      },
    ];

    mockStarships = [
      {
        name: "X-wing",
        model: "T-65 X-wing",
        manufacturer: "Incom Corporation",
        cost_in_credits: "149999",
        length: "12.5",
        max_atmosphering_speed: "1050",
        crew: "1",
        passengers: "0",
        cargo_capacity: "110",
        consumables: "1 week",
        hyperdrive_rating: "1.0",
        MGLT: "100",
        starship_class: "Starfighter",
        pilots: ["https://swapi.dev/api/people/1/"],
        films: ["https://swapi.dev/api/films/1/"],
        created: "2014-12-12T11:19:05.340000Z",
        edited: "2014-12-20T21:23:49.886000Z",
        url: "https://swapi.dev/api/starships/12/",
      },
    ];
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should successfully fetch character details and combine all data", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPerson,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockHomeworld,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockFilms[0],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockFilms[1],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStarships[0],
      });

    const result = await fetchCharacterDetails("1");

    expect(result).toEqual({
      name: "Luke Skywalker",
      height: "172",
      mass: "77",
      hair_color: "blond",
      eye_color: "blue",
      gender: "male",
      homeworld: mockHomeworld,
      films: mockFilms,
      starships: mockStarships,
    });

    expect(global.fetch).toHaveBeenCalledTimes(5);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://swapi.dev/api/people/1/"
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "https://swapi.dev/api/planets/1/"
    );
    expect(global.fetch).toHaveBeenCalledWith("https://swapi.dev/api/films/1/");
    expect(global.fetch).toHaveBeenCalledWith("https://swapi.dev/api/films/2/");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://swapi.dev/api/starships/12/"
    );
  });

  it("should throw an error if character data cannot be fetched", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(fetchCharacterDetails("unknown")).rejects.toThrow(
      "Failed to fetch character data for slug: unknown"
    );

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://swapi.dev/api/people/unknown/"
    );
  });

  it("should throw an error if homeworld data cannot be fetched", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPerson,
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

    await expect(fetchCharacterDetails("1")).rejects.toThrow(
      `Failed to fetch homeworld data for: ${mockPerson.homeworld}`
    );

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://swapi.dev/api/people/1/"
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "https://swapi.dev/api/planets/1/"
    );
  });

  it("should throw an error if a film data cannot be fetched", async () => {
    mockPerson.films = [
      "https://swapi.dev/api/films/1/",
      "https://swapi.dev/api/films/999/",
    ];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPerson,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockHomeworld,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockFilms[0],
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        url: "https://swapi.dev/api/films/999/",
      });

    await expect(fetchCharacterDetails("1")).rejects.toThrow(
      "Failed to fetch film data for URL: https://swapi.dev/api/films/999/"
    );

    expect(global.fetch).toHaveBeenCalledTimes(4);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://swapi.dev/api/films/999/"
    );
  });
});

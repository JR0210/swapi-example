import { render, waitFor, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import PersonCard from "../PersonCard";

const personData = {
  name: "Luke Skywalker",
  height: "172",
  mass: "77",
  hair_color: "blond",
  skin_color: "fair",
  eye_color: "blue",
  birth_year: "19BBY",
  gender: "male",
  homeworld: "https://swapi.dev/api/planets/1/",
  films: [
    "https://swapi.dev/api/films/1/",
    "https://swapi.dev/api/films/2/",
    "https://swapi.dev/api/films/3/",
    "https://swapi.dev/api/films/6/",
  ],
  species: [],
  vehicles: [
    "https://swapi.dev/api/vehicles/14/",
    "https://swapi.dev/api/vehicles/30/",
  ],
  starships: [
    "https://swapi.dev/api/starships/12/",
    "https://swapi.dev/api/starships/22/",
  ],
  created: "2014-12-09T13:50:51.644000Z",
  edited: "2014-12-20T21:17:56.891000Z",
  url: "https://swapi.dev/api/people/1/",
};

const homeworldData = {
  name: "Tatooine",
  rotation_period: "23",
  orbital_period: "304",
  diameter: "10465",
  climate: "arid",
  gravity: "1 standard",
  terrain: "desert",
  surface_water: "1",
  population: "200000",
  url: "https://swapi.dev/api/planets/1/",
};

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      json: () => Promise.resolve(homeworldData),
      headers: new Headers(),
      ok: true,
      redirected: false,
      status: 200,
      statusText: "OK",
      type: "basic",
      url: "",
    }) as Promise<Response>
);

describe("PersonCard Component", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it("should render all person data", async () => {
    await act(async () => {
      render(<PersonCard person={personData} />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", { name: /Luke Skywalker/i })
    ).toBeInTheDocument();

    expect(screen.getByTestId("person-gender")).toHaveTextContent(
      "Gender: Male"
    );

    expect(screen.getByTestId("person-homeworld")).toHaveTextContent(
      "Homeworld: Tatooine"
    );
  });

  it("should render loading spinner when homeworld data is being fetched", async () => {
    jest.spyOn(global, "fetch").mockImplementationOnce(
      () =>
        new Promise(() => {
          // Never resolves for testing load state
        })
    );

    await act(async () => {
      render(<PersonCard person={personData} />);
    });

    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });

  it("should render error message when homeworld data fetch fails", async () => {
    jest
      .spyOn(global, "fetch")
      .mockImplementationOnce(() =>
        Promise.reject(new Error("Failed to fetch data"))
      );

    await act(async () => {
      render(<PersonCard person={personData} />);
    });

    const errorMessage = await screen.findByTestId("error-message");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent("Failed to fetch homeworld data");
  });

  it("should have accessible role attributes for headings", async () => {
    await act(async () => {
      render(<PersonCard person={personData} />);
    });

    const headingElement = await screen.findByRole("heading", {
      name: /Luke Skywalker/i,
    });
    expect(headingElement).toBeInTheDocument();
    expect(headingElement.tagName).toBe("H2");
  });
});

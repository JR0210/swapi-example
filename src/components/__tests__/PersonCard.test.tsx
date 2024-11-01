import { render, waitFor, screen } from "@testing-library/react";
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

describe("PersonCard Component", () => {
  it("should render all person data", async () => {
    render(<PersonCard person={personData} />);

    // Wait for the person data to be rendered & homeworld data to be fetched
    await waitFor(() => {
      expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
    });

    // Expect name, gender, and homeworld to be rendered
    expect(
      screen.getByRole("heading", { name: /Luke Skywalker/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId("person-gender")).toHaveTextContent("male");
    expect(screen.getByTestId("person-homeworld")).toHaveTextContent(
      "Tatooine"
    );
  });

  it("should render loading spinner when homeworld data is being fetched", async () => {
    render(<PersonCard person={personData} />);

    // Wait for loading spinner to be in the document
    const loadingSpinner = await screen.findByTestId("loading-skeleton");
    expect(loadingSpinner).toBeInTheDocument();
  });

  it("should render error message when homeworld data fetch fails", async () => {
    jest
      .spyOn(global, "fetch")
      .mockImplementation(() =>
        Promise.reject(new Error("Failed to fetch data"))
      );

    render(<PersonCard person={personData} />);

    // Wait for the error message to appear
    const errorMessage = await screen.findByText(
      /Failed to fetch homeworld data/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should have accessible role attributes for headings", () => {
    render(<PersonCard person={personData} />);

    const headingElement = screen.getByRole("heading", {
      name: /Luke Skywalker/i,
    });
    expect(headingElement).toBeInTheDocument();
    expect(headingElement.tagName).toBe("H2");
  });
});

import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import Page from "./page";
import React from "react";

const mockPersonData = {
  name: "Luke Skywalker",
  height: "172",
  gender: "male",
  homeworld: "https://swapi.dev/api/planets/1/",
  url: "https://swapi.dev/api/people/1/",
};

const mockHomeworldData = {
  name: "Tatooine",
  climate: "arid",
  population: "200000",
  terrain: "desert",
  diameter: "10465",
  gravity: "1 standard",
  orbital_period: "304",
  rotation_period: "23",
  surface_water: "1",
};

describe("Favourites Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("should render the favourites correctly", async () => {
    localStorage.setItem("favourites", JSON.stringify([1]));

    global.fetch = jest.fn((url) => {
      if (url.includes("people/1")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => mockPersonData,
        });
      }
      if (url.includes("planets/1")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => mockHomeworldData,
        });
      }
      return Promise.reject(new Error("not found"));
    }) as jest.Mock;

    await act(async () => {
      render(<Page />);
    });

    await waitFor(() =>
      expect(screen.getByText("Favourites")).toBeInTheDocument()
    );

    expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
    expect(screen.getByTestId("person-height")).toBeInTheDocument();
    expect(screen.getByTestId("person-gender")).toBeInTheDocument();
    expect(screen.getByTestId("person-homeworld")).toBeInTheDocument();
  });

  it("should render the favourites correctly when there are no favourites", async () => {
    await act(async () => {
      render(<Page />);
    });

    await waitFor(() =>
      expect(screen.getByText("No favourites added")).toBeInTheDocument()
    );
  });

  it("should allow the user to remove a favourite", async () => {
    localStorage.setItem("favourites", JSON.stringify([1]));

    global.fetch = jest.fn((url) => {
      if (url.includes("people/1")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => mockPersonData,
        });
      }
      if (url.includes("planets/1")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => mockHomeworldData,
        });
      }
      return Promise.reject(new Error("not found"));
    }) as jest.Mock;

    await act(async () => {
      render(<Page />);
    });

    await waitFor(() =>
      expect(screen.getByText("Luke Skywalker")).toBeInTheDocument()
    );

    const removeButton = screen.getByTestId("delete-button");
    expect(removeButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(removeButton);
    });

    await waitFor(() => {
      const favourites = JSON.parse(localStorage.getItem("favourites") || "[]");
      expect(favourites).toEqual([]);
      expect(screen.getByText("No favourites added")).toBeInTheDocument();
    });
  });

  it('should render a "Back" button', async () => {
    await act(async () => {
      render(<Page />);
    });

    await waitFor(() =>
      expect(screen.getByText("Favourites")).toBeInTheDocument()
    );

    expect(screen.getByTestId("back-button")).toBeInTheDocument();
  });
});

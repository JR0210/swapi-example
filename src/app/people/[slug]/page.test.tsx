import fetchAllCharacterData from "@/utils/fetchAllCharacterData";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import Page from "./page";

jest.mock("../../../utils/fetchAllCharacterData");

const mockData = {
  name: "Luke Skywalker",
  height: "172",
  mass: "77",
  hair_color: "blond",
  eye_color: "blue",
  gender: "male",
  homeworld: { name: "Tatooine" },
  films: [{ title: "A New Hope" }, { title: "The Empire Strikes Back" }],
  starships: [{ name: "X-wing" }, { name: "Imperial shuttle" }],
};

describe("Person Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("should render the person details correctly", async () => {
    (fetchAllCharacterData as jest.Mock).mockResolvedValueOnce(mockData);
    const pageComponent = await Page({ params: { slug: "1" } });
    render(pageComponent);

    await waitFor(() =>
      expect(screen.getByText("Luke Skywalker")).toBeInTheDocument()
    );

    expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
    expect(screen.getByText("Height:")).toBeInTheDocument();
    expect(screen.getByText("172 cm")).toBeInTheDocument();
    expect(screen.getByText("Mass:")).toBeInTheDocument();
    expect(screen.getByText("77 kg")).toBeInTheDocument();
    expect(screen.getByText("Hair Color:")).toBeInTheDocument();
    expect(screen.getByText("blond")).toBeInTheDocument();
    expect(screen.getByText("Eye Color:")).toBeInTheDocument();
    expect(screen.getByText("blue")).toBeInTheDocument();
    expect(screen.getByText("Gender:")).toBeInTheDocument();
    expect(screen.getByText("male")).toBeInTheDocument();
    expect(screen.getByText("Homeworld:")).toBeInTheDocument();
    expect(screen.getByText("Tatooine")).toBeInTheDocument();
    expect(screen.getByText("Films")).toBeInTheDocument();
    expect(screen.getByText("A New Hope")).toBeInTheDocument();
    expect(screen.getByText("The Empire Strikes Back")).toBeInTheDocument();
    expect(screen.getByText("Starships")).toBeInTheDocument();
    expect(screen.getByText("X-wing")).toBeInTheDocument();
    expect(screen.getByText("Imperial shuttle")).toBeInTheDocument();
  });

  it("should render a back button", async () => {
    (fetchAllCharacterData as jest.Mock).mockResolvedValueOnce(mockData);
    const pageComponent = await Page({ params: { slug: "1" } });
    render(pageComponent);

    await screen.findByText("Luke Skywalker");

    expect(screen.getByTestId("back-button")).toBeInTheDocument();
  });

  it('should render a "Favourite" button', async () => {
    (fetchAllCharacterData as jest.Mock).mockResolvedValueOnce(mockData);
    const pageComponent = await Page({ params: { slug: "1" } });
    render(pageComponent);

    await screen.findByText("Luke Skywalker");

    expect(screen.getByTestId("favourite-button")).toBeInTheDocument();
  });

  it('should favourite the person when the "Favourite" button is clicked', async () => {
    (fetchAllCharacterData as jest.Mock).mockResolvedValueOnce(mockData);
    const pageComponent = await Page({ params: { slug: "1" } });
    render(pageComponent);

    await waitFor(() =>
      expect(screen.getByText("Luke Skywalker")).toBeInTheDocument()
    );

    const favouriteButton = screen.getByTestId("favourite-button");
    await act(async () => {
      fireEvent.click(favouriteButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Remove from favourites")).toBeInTheDocument();
    });
  });

  it('should unfavourite the person when the "Favourite" button is clicked twice', async () => {
    (fetchAllCharacterData as jest.Mock).mockResolvedValueOnce(mockData);
    const pageComponent = await Page({ params: { slug: "1" } });
    render(pageComponent);

    await waitFor(() =>
      expect(screen.getByText("Luke Skywalker")).toBeInTheDocument()
    );

    const favouriteButton = screen.getByTestId("favourite-button");
    await act(async () => {
      fireEvent.click(favouriteButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Remove from favourites")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(favouriteButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Add to favourites")).toBeInTheDocument();
    });
  });

  it("should render an error message when the data fetching fails", async () => {
    (fetchAllCharacterData as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch data")
    );

    const pageComponent = await Page({ params: { slug: "1" } });
    render(pageComponent);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch data")).toBeInTheDocument();
    });
  });
});

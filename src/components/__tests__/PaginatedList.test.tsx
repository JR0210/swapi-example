import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PaginatedList from "../PaginatedList";
import { IPerson } from "../../types/global";

// Mock data
const mockPersonData = {
  results: [
    {
      name: "Luke Skywalker",
      height: "172",
      gender: "male",
      homeworld: "Tatooine",
    },
  ],
};

const queryClient = new QueryClient();

const renderWithQueryClient = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  );
};

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      json: () => Promise.resolve(mockPersonData),
      headers: new Headers(),
      ok: true,
      redirected: false,
      status: 200,
      statusText: "OK",
      type: "basic",
      url: "",
    }) as Promise<Response>
);

describe("PaginatedList Component", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    queryClient.clear();
    jest.restoreAllMocks();
  });

  it("should render loading state initially", () => {
    renderWithQueryClient(
      <PaginatedList
        query="https://swapi.dev/api/people"
        renderItem={() => <div data-testid="mock-item">Loading...</div>}
        dataExtractor={(data) => data.results}
      />
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should render a list of items", async () => {
    renderWithQueryClient(
      <PaginatedList
        query="https://swapi.dev/api/people"
        renderItem={(item: IPerson) => (
          <div data-testid="mock-item">{item.name}</div>
        )}
        dataExtractor={(data) => data.results}
      />
    );

    const items = await screen.findAllByTestId("mock-item");
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toHaveTextContent("Luke Skywalker");
  });

  it("should render pagination controls", async () => {
    renderWithQueryClient(
      <PaginatedList
        query="https://swapi.dev/api/people"
        renderItem={() => <div data-testid="mock-item">Item</div>}
        dataExtractor={(data) => data.results}
      />
    );

    const nextPageButton = await screen.findByRole("button", { name: /next/i });
    const prevPageButton = screen.queryByRole("button", { name: /previous/i });

    expect(prevPageButton).toBeNull();
    expect(nextPageButton).toBeInTheDocument();
  });

  it("should navigate to the next page when 'Next' button is clicked", async () => {
    renderWithQueryClient(
      <PaginatedList
        query="https://swapi.dev/api/people"
        renderItem={(item: IPerson) => (
          <div data-testid="mock-item">{item.name}</div>
        )}
        dataExtractor={(data) => data.results}
      />
    );

    const nextPageButton = await screen.findByRole("button", { name: /next/i });
    fireEvent.click(nextPageButton);

    const items = await screen.findAllByTestId("mock-item");
    expect(items.length).toBeGreaterThan(0);
  });

  it("should show an error message if data fetching fails", async () => {
    jest
      .spyOn(global, "fetch")
      .mockImplementationOnce(() =>
        Promise.reject(new Error("Failed to fetch data"))
      );

    renderWithQueryClient(
      <PaginatedList
        query="https://swapi.dev/api/people"
        renderItem={() => <div data-testid="mock-item">Item</div>}
        dataExtractor={(data) => data.results}
      />
    );

    const errorMessage = await screen.findByText(/failed to fetch data/i);
    expect(errorMessage).toBeInTheDocument();
  });
});

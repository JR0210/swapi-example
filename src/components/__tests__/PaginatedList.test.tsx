import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PaginatedList from "../PaginatedList";
import { IPerson } from "../../types/global";

// Mock data
const mockPersonData = {
  count: 10,
  results: [
    {
      name: "Luke Skywalker",
      height: "172",
      gender: "male",
      homeworld: "Tatooine",
    },
  ],
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const TestQueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

const defaultProps = {
  query: "https://swapi.dev/api/people",
  renderItem: (item: IPerson) => <div data-testid="mock-item">{item.name}</div>,
  dataExtractor: (data: any) => data.results,
  paginationExtractor: (data: any) => ({ totalCount: data.count }),
};

describe("PaginatedList Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render loading state initially", async () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;

    render(
      <TestQueryClientProvider>
        <PaginatedList {...defaultProps} />
      </TestQueryClientProvider>
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should render a list of items", async () => {
    // Mock fetch to return successful data
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: async () => mockPersonData,
      })
    ) as jest.Mock;

    render(
      <TestQueryClientProvider>
        <PaginatedList {...defaultProps} />
      </TestQueryClientProvider>
    );

    // Wait for the items to be rendered
    const items = await screen.findAllByTestId("mock-item");
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toHaveTextContent("Luke Skywalker");
  });

  it("should handle empty data", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ count: 0, results: [] }),
      })
    ) as jest.Mock;

    render(
      <TestQueryClientProvider>
        <PaginatedList {...defaultProps} />
      </TestQueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    await waitFor(() => {
      const items = screen.queryByTestId("mock-item");
      expect(items).not.toBeInTheDocument();
    });

    const noItemsMessage = await screen.findByTestId("empty-message");
    expect(noItemsMessage).toBeInTheDocument();

    const nextPageButton = screen.queryByRole("button", { name: /next/i });
    expect(nextPageButton).not.toBeInTheDocument();
  });

  it("should render pagination controls", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: async () => mockPersonData,
      })
    ) as jest.Mock;

    render(
      <TestQueryClientProvider>
        <PaginatedList {...defaultProps} />
      </TestQueryClientProvider>
    );

    const nextPageButton = await screen.findByRole("button", { name: /next/i });
    const prevPageButton = screen.getByRole("button", { name: /previous/i });

    expect(prevPageButton).toBeDisabled();
    expect(nextPageButton).toBeInTheDocument();
  });

  it("should navigate to the next page when 'Next' button is clicked", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: async () => mockPersonData,
      })
    ) as jest.Mock;

    render(
      <TestQueryClientProvider>
        <PaginatedList {...defaultProps} />
      </TestQueryClientProvider>
    );

    const nextPageButton = await screen.findByRole("button", { name: /next/i });
    await act(async () => {
      fireEvent.click(nextPageButton);
    });

    await waitFor(() => {
      const items = screen.getAllByTestId("mock-item");
      expect(items.length).toBeGreaterThan(0);
    });
  });

  it("should disable the next button on the last page", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: async () => mockPersonData,
      })
    ) as jest.Mock;

    render(
      <TestQueryClientProvider>
        <PaginatedList {...defaultProps} />
      </TestQueryClientProvider>
    );

    const nextPageButton = await screen.findByRole("button", { name: /next/i });
    const prevPageButton = screen.getByRole("button", { name: /previous/i });

    expect(nextPageButton).toBeDisabled();
    expect(prevPageButton).toBeDisabled();
  });

  it("should show an error message if data fetching fails", async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error("Failed to fetch data"))
    ) as jest.Mock;

    render(
      <TestQueryClientProvider>
        <PaginatedList {...defaultProps} />
      </TestQueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
    });

    const items = screen.queryByTestId("mock-item");
    expect(items).not.toBeInTheDocument();
  });

  it("should show an error message if response is not ok", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        json: async () => ({}),
      })
    ) as jest.Mock;

    render(
      <TestQueryClientProvider>
        <PaginatedList {...defaultProps} />
      </TestQueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
    });

    const items = screen.queryByTestId("mock-item");
    expect(items).not.toBeInTheDocument();
  });

  it("should filter the list when a search term is entered", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: async () => mockPersonData,
      })
    ) as jest.Mock;

    render(
      <TestQueryClientProvider>
        <PaginatedList {...defaultProps} searchKey="name" />
      </TestQueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    const searchInput = await screen.findByTestId("paginated-search-input");

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "Luke" } });
    });

    const items = await screen.findAllByTestId("mock-item");
    expect(items.length).toBe(1);
    expect(items[0]).toHaveTextContent("Luke Skywalker");
  });

  it("should show no items message when search term does not match", async () => {
    // Mock fetch to return empty data based on search term
    global.fetch = jest.fn((url) => {
      if (url.includes("Anakin")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ count: 0, results: [] }),
        });
      }

      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => mockPersonData,
      });
    }) as jest.Mock;

    render(
      <TestQueryClientProvider>
        <PaginatedList {...defaultProps} searchKey="name" />
      </TestQueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    const searchInput = await screen.findByTestId("paginated-search-input");

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "Anakin" } });
    });

    const noItemsMessage = await screen.findByTestId("empty-message");
    expect(noItemsMessage).toBeInTheDocument();
  });
});

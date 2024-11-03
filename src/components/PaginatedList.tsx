"use client";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Button } from "flowbite-react";

import useDebounce from "@/hooks/useDebounce";
import buildQuery from "@/utils/buildQuery";

async function fetchData<T>({ query }: { query: string }): Promise<T> {
  try {
    const response = await fetch(query);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
}

type PaginatedListProps<T> = {
  query: string;
  renderItem: (item: T) => React.ReactNode;
  dataExtractor: (data: any) => T[];
  paginationExtractor: (data: any) => { totalCount: number };
  pageSize?: number;
  searchKey?: string;
};

export default function PaginatedList<T>({
  query,
  renderItem,
  dataExtractor,
  paginationExtractor,
  pageSize = 10,
  searchKey,
}: PaginatedListProps<T>) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);

  const updatedQuery = buildQuery(query, {
    [searchKey ?? ""]: debouncedSearchTerm,
    page,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["paginated", updatedQuery, page],
    queryFn: () => fetchData({ query: updatedQuery }),
    placeholderData: keepPreviousData,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to the first page whenever search term changes
  };

  if (isLoading) {
    return <div data-testid="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div data-testid="error-message">Failed to fetch data</div>;
  }

  const items = dataExtractor(data);
  const { totalCount } = paginationExtractor(data);
  const totalPages = Math.ceil(totalCount / pageSize);

  const ulClass =
    items.length === 0 ? "flex justify-center" : "grid grid-cols-3 gap-4";

  function renderItems() {
    if (items.length === 0 || totalCount === 0) {
      return <div data-testid="empty-message">No items found</div>;
    }
    return items.map((item, index) => <li key={index}>{renderItem(item)}</li>);
  }

  return (
    <div className="w-full">
      {searchKey && (
        <>
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-1/3 mx-auto"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search..."
            data-testid="paginated-search-input"
          />
        </>
      )}
      <ul className={`${ulClass} my-4`}>{renderItems()}</ul>
      {totalPages > 0 && (
        <div className="flex flex-row gap-2 justify-center">
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

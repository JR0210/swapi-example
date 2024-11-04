"use client";

import { Button } from "flowbite-react";
import PaginatedList from "@/components/PaginatedList";
import QueryWrapper from "../components/QueryWrapper";
import { IPerson, IPeopleResponse } from "@/types/global";
import PersonCard from "@/components/PersonCard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-6 relative">
      <Button
        as="a"
        href="/favourites"
        className="mt-4 absolute right-20 top-10"
      >
        Favourites
      </Button>
      <QueryWrapper>
        <h1 className="text-5xl font-bold">SWAPI Example</h1>
        <PaginatedList
          query="https://swapi.dev/api/people"
          renderItem={(person: IPerson) => <PersonCard person={person} />}
          dataExtractor={(data: IPeopleResponse) => data.results}
          paginationExtractor={(data: IPeopleResponse) => ({
            totalCount: data.count,
          })}
          searchKey="search"
        />
      </QueryWrapper>
    </main>
  );
}

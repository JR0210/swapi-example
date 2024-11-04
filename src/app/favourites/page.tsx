"use client";

import { Button } from "flowbite-react";
import useFetchFavourites from "@/hooks/useFetchFavourites";
import PersonCard from "@/components/PersonCard";
import extractPersonId from "@/utils/extractPersonId";
import { useEffect, useState } from "react";
import { IPerson } from "@/types/global";

export default function Page() {
  const [favourites, setFavourites] = useState<IPerson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      setIsLoading(true);
      const storedFavourites = localStorage.getItem("favourites");
      if (storedFavourites) {
        const favouriteIds = JSON.parse(storedFavourites);
        const data = await useFetchFavourites(favouriteIds);
        setFavourites(data);
      }
      setIsLoading(false);
    };
    fetchFavourites();
  }, []);

  function handleDelete(id: string): void {
    const updatedFavourites = favourites.filter(
      (favourite) => extractPersonId(favourite.url) !== id
    );

    setFavourites(updatedFavourites);
    localStorage.setItem(
      "favourites",
      JSON.stringify(updatedFavourites.map((fav) => extractPersonId(fav.url)))
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-6 relative">
      <Button
        data-testid="back-button"
        as="a"
        href="/"
        className="mt-4 absolute right-20 top-10"
      >
        Go back
      </Button>
      <h1 className="text-5xl font-bold">Favourites</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : favourites.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
          {favourites.map((favourite) => (
            <PersonCard
              key={extractPersonId(favourite.url)}
              person={favourite}
              deleteFn={() => handleDelete(extractPersonId(favourite.url))}
            />
          ))}
        </ul>
      ) : (
        <p>No favourites added</p>
      )}
    </main>
  );
}

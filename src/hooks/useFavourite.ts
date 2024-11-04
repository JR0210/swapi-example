import { useEffect, useState } from "react";

export default function useFavourite(
  id: string
): readonly [boolean, () => void] {
  const [favourites, setFavourites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedFavourites = localStorage.getItem("favourites");
    if (storedFavourites) {
      setFavourites(new Set(JSON.parse(storedFavourites)));
    } else {
      localStorage.setItem("favourites", JSON.stringify([]));
    }
  }, []);

  const isFavourite = favourites.has(id);

  function toggleFavourite() {
    const updatedFavourites = new Set(favourites);

    if (updatedFavourites.has(id)) {
      updatedFavourites.delete(id);
    } else {
      updatedFavourites.add(id);
    }

    setFavourites(updatedFavourites);
    localStorage.setItem(
      "favourites",
      JSON.stringify(Array.from(updatedFavourites))
    );
  }

  return [isFavourite, toggleFavourite] as const;
}

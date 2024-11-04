import { useEffect, useState } from "react";

export default function useFavourite(
  id: string
): readonly [boolean, () => void] {
  const [favourites, setFavourites] = useState<Set<string>>(new Set());
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    const storedFavourites = localStorage.getItem("favourites");
    if (storedFavourites) {
      setFavourites(new Set(JSON.parse(storedFavourites)));
      setIsFavourite(new Set(JSON.parse(storedFavourites)).has(id));
    } else {
      localStorage.setItem("favourites", JSON.stringify([]));
    }
  }, []);

  function toggleFavourite() {
    const updatedFavourites = new Set(favourites);

    if (updatedFavourites.has(id)) {
      updatedFavourites.delete(id);
      setIsFavourite(false);
    } else {
      updatedFavourites.add(id);
      setIsFavourite(true);
    }

    setFavourites(updatedFavourites);
    localStorage.setItem(
      "favourites",
      JSON.stringify(Array.from(updatedFavourites))
    );
  }

  return [isFavourite, toggleFavourite] as const;
}

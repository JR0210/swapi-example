"use client";

import { Button } from "flowbite-react";

import FavouriteIcon from "@/components/FavouriteIcon";
import useFavourite from "@/hooks/useFavourite";

export default function FavouriteButton({ id }: { id: string }) {
  const [isFavourite, setIsFavourite] = useFavourite(id);

  return (
    <Button
      color={isFavourite ? "failure" : "success"}
      size="lg"
      onClick={() => setIsFavourite()}
      data-testid="favourite-button"
    >
      <div className="flex items-center justify-center gap-1">
        <FavouriteIcon value={isFavourite} />
        {isFavourite ? "Remove from favourites" : "Add to favourites"}
      </div>
    </Button>
  );
}

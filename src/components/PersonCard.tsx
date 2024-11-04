"use client";

import { useEffect, useState } from "react";
import { Card } from "flowbite-react";

import { type IPerson, type IPlanet } from "../types/global";
import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";
import extractPersonId from "@/utils/extractPersonId";
import DeleteButton from "./DeleteButton";

interface IPersonCardProps {
  person: IPerson;
  deleteFn?: (personId: string) => void;
}

export default function PersonCard({ person, deleteFn }: IPersonCardProps) {
  const [homeworld, setHomeworld] = useState<IPlanet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const personId = extractPersonId(person.url);

  useEffect(() => {
    async function fetchHomeworld() {
      try {
        const response = await fetch(person.homeworld);
        if (!response.ok) {
          throw new Error("Failed to fetch homeworld data");
        }
        const data = (await response.json()) as IPlanet;
        setHomeworld(data);
      } catch (error) {
        setFetchError("Failed to fetch homeworld data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchHomeworld();
  }, [person.homeworld]);

  function renderHomeWorld() {
    if (isLoading) {
      return <div data-testid="loading-skeleton">Loading...</div>;
    }
    if (fetchError) {
      return <p data-testid="error-message">{fetchError}</p>;
    }
    if (homeworld) {
      return <p data-testid="person-homeworld">Homeworld: {homeworld.name}</p>;
    }
  }

  function handleDeleteClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    deleteFn && deleteFn(personId);
  }

  return (
    <Card href={`/people/${personId}`}>
      {deleteFn && (
        <DeleteButton onClick={handleDeleteClick} className="w-12" />
      )}
      <h2 className="font-semibold text-lg">{person.name}</h2>
      <div className="flex flex-row justify-between">
        <p data-testid="person-height">Height: {person.height} cm</p>
        <p data-testid="person-gender">
          Gender: {capitalizeFirstLetter(person.gender)}
        </p>
        {renderHomeWorld()}
      </div>
    </Card>
  );
}

"use client";

import { useEffect, useState } from "react";
import { type IPerson, type IPlanet } from "../types/global";
import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";

import { Card } from "flowbite-react";

export default function PersonCard({ person }: { person: IPerson }) {
  const [homeworld, setHomeworld] = useState<IPlanet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

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

  return (
    <Card href="#">
      <h2 className="font-semibold text-lg">{person.name}</h2>
      <div className="flex flex-row justify-between">
        <p data-testid="person-gender">
          Gender: {capitalizeFirstLetter(person.gender)}
        </p>
        {renderHomeWorld()}
      </div>
    </Card>
  );
}

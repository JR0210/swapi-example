import { Button, Card } from "flowbite-react";
import fetchAllCharacterData from "@/utils/fetchAllCharacterData";
import FavouriteButton from "@/components/FavouriteButton";

export default async function Page({ params }: { params: { slug: string } }) {
  try {
    const data = await fetchAllCharacterData(params.slug);

    return (
      <div className="flex justify-center p-6">
        <Card className="w-full max-w-3xl bg-white shadow-md rounded-md p-6">
          <Button as="a" href="/" className="mb-6" data-testid="back-button">
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{data.name}</h1>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-lg">
                <span className="font-semibold">Height:</span> {data.height} cm
              </p>
              <p className="text-lg">
                <span className="font-semibold">Mass:</span> {data.mass} kg
              </p>
              <p className="text-lg">
                <span className="font-semibold">Hair Color:</span>{" "}
                {data.hair_color}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Eye Color:</span>{" "}
                {data.eye_color}
              </p>
              <p className="text-lg">
                <span className="font-semibold">Gender:</span> {data.gender}
              </p>
            </div>
            <div>
              <p className="text-lg">
                <span className="font-semibold">Homeworld:</span>{" "}
                {data.homeworld.name}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Films</h2>
            <ul className="list-disc ml-6">
              {data.films.map((film, index) => (
                <li key={index} className="text-lg">
                  {film.title}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">
              Starships
            </h2>
            {data.starships.length > 0 ? (
              <ul className="list-disc ml-6">
                {data.starships.map((ship, index) => (
                  <li key={index} className="text-lg">
                    {ship.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg text-gray-600">No starships piloted</p>
            )}
          </div>

          <FavouriteButton id={params.slug} />
        </Card>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="flex flex-col justify-center items-center w-screen h-screen">
        <h1>Something went wrong</h1>
        <p>{error?.message}</p>
        <Button as="a" href="/" className="mt-4">
          Go back
        </Button>
      </div>
    );
  }
}

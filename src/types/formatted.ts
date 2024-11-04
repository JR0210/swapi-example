import { IPlanet, IFilm, IStarship } from "./global";

export interface CharacterDetails {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  eye_color: string;
  gender: string;
  homeworld: IPlanet;
  films: IFilm[];
  starships: IStarship[];
}

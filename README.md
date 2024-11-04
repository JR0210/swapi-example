This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

# Notes

Install dependencies -

```bash
npm i
```

Run development server locally (localhost:3000 by default) -

```bash
npm run dev
```

To run unit tests -

```bash
npm run test
```

Unit tests (watch mode) -

```bash
npm run test:watch
```

E2E tests (incomplete) -

```bash
npm run test:e2e
```

## Todo/Remaining

- Edit person functionality, preferably if SWAPI allowed for editing through the API or forked repo. Use optimistic updates and control users expectations/knowledge through toast notifications.
- E2E tests, currently using playwright to run headless/faster. Little bit rusty on testing generally, especially TDD focused.
- Favouriting functionality has a relatively major issue when opening a single person page, since the main page is SSR and the favourite status can only be calculated from local storage for now. The user can inadvertently overwrite all over favourites since it reads it as empty initially. Having this within the API would entirely negate this.
- Improve styling/theming throughout, as well as improving any accessibility issues.

## Test Coverage

| File                         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| ---------------------------- | ------- | -------- | ------- | ------- | ----------------- |
| All files                    | 97.25   | 93.87    | 87.5    | 97.25   |                   |
| app                          | 93.93   | 100      | 33.33   | 93.93   |                   |
| ├── page.tsx                 | 93.93   | 100      | 33.33   | 93.93   | 26-27             |
| app/favourites               | 100     | 100      | 100     | 100     |                   |
| ├── page.tsx                 | 100     | 100      | 100     | 100     |                   |
| app/people/[slug]            | 100     | 100      | 100     | 100     |                   |
| ├── page.tsx                 | 100     | 100      | 100     | 100     |                   |
| components                   | 99.31   | 97.87    | 87.5    | 99.31   |                   |
| ├── DeleteButton.tsx         | 100     | 100      | 100     | 100     |                   |
| ├── FavouriteButton.tsx      | 100     | 100      | 100     | 100     |                   |
| ├── FavouriteIcon.tsx        | 100     | 100      | 100     | 100     |                   |
| ├── PaginatedList.tsx        | 100     | 100      | 71.42   | 100     |                   |
| ├── PersonCard.tsx           | 97.26   | 93.33    | 100     | 97.26   | 27-28             |
| └── QueryWrapper.tsx         | 100     | 100      | 100     | 100     |                   |
| hooks                        | 89.28   | 80       | 100     | 89.28   |                   |
| ├── useDebounce.ts           | 100     | 100      | 100     | 100     |                   |
| ├── useFavourite.ts          | 94.73   | 83.33    | 100     | 94.73   | 12-13             |
| └── useFetchFavourites.ts    | 73.07   | 60       | 100     | 73.07   | 14-17,23-25       |
| utils                        | 94.5    | 90       | 100     | 94.5    |                   |
| ├── buildQuery.ts            | 94.44   | 75       | 100     | 94.44   | 16                |
| ├── capitalizeFirstLetter.ts | 100     | 100      | 100     | 100     |                   |
| ├── extractPersonId.ts       | 100     | 100      | 100     | 100     |                   |
| └── fetchAllCharacterData.ts | 93.93   | 92.85    | 100     | 93.93   | 42-45             |

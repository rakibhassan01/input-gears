import {
  createSerializer,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  createSearchParamsCache,
} from "nuqs/server";

export const searchParamsCache = createSearchParamsCache({
  q: parseAsString.withDefault(""),
  category: parseAsString.withDefault(""),
  brand: parseAsString.withDefault(""),
  minPrice: parseAsFloat,
  maxPrice: parseAsFloat,
  sort: parseAsString.withDefault("newest"),
  page: parseAsInteger.withDefault(1),
});

export const serialize = createSerializer({
  q: parseAsString,
  category: parseAsString,
  brand: parseAsString,
  minPrice: parseAsFloat,
  maxPrice: parseAsFloat,
  sort: parseAsString,
  page: parseAsInteger,
});

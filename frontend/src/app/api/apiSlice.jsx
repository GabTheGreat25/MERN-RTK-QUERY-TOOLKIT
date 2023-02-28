import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RESOURCE } from "@/constants";

export const apiSlice = createApi({
  // Define a baseQuery property with a fetchBaseQuery function that sets the base URL to "http://localhost:4000"
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000" }),
  // Define an array of strings that represent the types of entities that can be tagged in the responses.
  tagTypes: [RESOURCE.NOTE, RESOURCE.USER],
  // Define the API endpoints that can be called by the client using the endpoints function that returns an empty object indicating no endpoints have been defined yet.
  endpoints: (builder) => ({}),
});

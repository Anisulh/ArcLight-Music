import React, { useState } from "react";
import { fetchSearch } from "../services/spotifyServices";

function SearchMusic({ setSearchResults, setResultModalOpen }) {
  const [searchFormData, setSearchData] = useState({
    query: "",
    type: "track",
  });
  const { query, type } = searchFormData;
  const onFormChange = (e) => {
    setSearchData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const onSearchSubmit = async (e) => {
    e.preventDefault();
    const response = await fetchSearch(query, type);
    if (response.ok) {
      const data = await response.json();
      if (data.tracks) {
        setSearchResults(data.tracks.items);
      } else {
        setSearchResults(data.artists.items);
      }
      setResultModalOpen(true);
    }
    setSearchData({ query: "", type: "track" });
  };
  return (
    <div>
      <form onSubmit={onSearchSubmit}>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
        >
          Search
        </label>
        <div className="relative flex mx-10  md:mx-30  lg:mx-40 my-5">
          <div className=" flex items-center text-sm text-gray-800 bg-gray-50 border-r-0 rounded-l-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <select
              name="type"
              value={type}
              onChange={onFormChange}
              className="h-full rounded-l-lg text-gray-800 bg-gray-50"
            >
              <option value="artist">Artist</option>
              <option value="track">Track</option>
            </select>
          </div>
          <input
            type="search"
            id="default-search"
            className="block p-4 pl-10 w-full text-sm text-gray-800 bg-gray-50 rounded-r-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search Music, Artists..."
            required
            name="query"
            value={query}
            onChange={onFormChange}
          />
          <button
            type="submit"
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 md:px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchMusic;

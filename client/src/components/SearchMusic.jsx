import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { fetchSearch } from "../services/spotifyServices";
import SearchResult from "../components/SearchResult";
import Error from "./Error";

function SearchMusic({ guest_id, chatSocket }) {
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
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
    const response = await fetchSearch(query, type, setError);
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
    <>
    {error && <Error message={error}/>}
    <div className="fixed top-36 sm:top-30 md:right-36 z-10 xl:right-auto ">
        <form onSubmit={onSearchSubmit}>
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
          >
            Search
          </label>
          <div className="relative flex text-center my-5">
            <input
              type="search"
              id="default-search"
              className="block p-4 text-sm text-gray-800 bg-gray-50 rounded-lg shadow-md border-gray-300 dark:border-gray-600 w-96
            focus:outline-none
            "
              placeholder="Search Music"
              required
              name="query"
              value={query}
              onChange={onFormChange}
            />
            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-2 md:px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </form>
        <div className="relative">
          {resultModalOpen && (
          <Transition.Root show={resultModalOpen} as={Fragment}>
            <Dialog
              as="div"
              id="wrapper"
              onClose={() => setResultModalOpen(false)}
            >
              <div className="fixed mt-3 top-52 sm:top-30 search-right z-10  ">
                <div className="text-center sm:p-0 w-fit">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Dialog.Panel className="max-h-52 overflow-y-auto bg-white text-left  shadow-md  transition-all max-w-3xl w-fit">
                      <div className="bg-white px-4 pb-4  ">
                        {searchResults.map((result, index) => (
                          <SearchResult
                            key={index}
                            result={result}
                            setResultModalOpen={setResultModalOpen}
                            guest_id={guest_id}
                            chatSocket={chatSocket}
                          />
                        ))}
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
        )}
        </div>
        
      </div>
    </>
    
  );
}

export default SearchMusic;

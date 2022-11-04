import React from "react";

function SearchResult({ result, setCurrentlyPlaying, setResultModalOpen }) {
  const onResultClick = async (result) => {
    const array = [];
    array.push(result);
    setCurrentlyPlaying(array);
    setResultModalOpen(false);
  };
  return (
    <div
      className="h-16 border rounded-lg flex items-center cursor-pointer"
      onClick={() => onResultClick(result)}
    >
      <img
        src={result.image ? result.image[0].url : result.album.images[0].url}
        className="w-12 h-12 mx-6"
      />
      <div>
        <p className="text-black  text-sm md:text-base">{result.name}</p>
        <div className="flex text-xs md:text-sm">
          {result.artists &&
            result.artists.map((artist) => (
              <p key={artist.name}>{artist.name}</p>
            ))}
        </div>
      </div>
    </div>
  );
}

export default SearchResult;

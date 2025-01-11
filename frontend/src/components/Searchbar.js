import React from "react";
import  { useState,useRef,useEffect } from "react";
import { SearchBar_2 } from "./Searchbar_2";
import { SearchResultsList } from "./SearchResultsList";

function SearchBar() {
  const [results, setResults] = useState([]);
  const searchBarRef = useRef(null);

   // Function to close the suggestion box when clicking outside
   const handleClickOutside = (event) => {
    if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
      setResults([]); // Close search results
    }
  };

  useEffect(() => {
    // Attach event listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    // <div className="App">
      <div ref={searchBarRef} className="search-bar-container">
      <SearchBar_2 setResults={setResults} />
      {results && results.length > 0 && (
        <div className="search-results">
          <SearchResultsList results={results} />
        </div>
      )}
    </div>
    // </div>
  );
}


export default SearchBar;

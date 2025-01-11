import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios"
import "./SearchBar.css";
const backend_url=process.env.REACT_APP_BACKEND_URL


export const SearchBar_2 = ({ setResults }) => {
  const [input, setInput] = useState("");

  const fetchData = (value) => {
    // fetch("https://jsonplaceholder.typicode.com/users")
    axios.get(`${backend_url}/api/searchbar/getsearchdata`)
    .then((response) => {
        // console.log("Fetched data:",response.data)
        const results = response.data.filter((item) => {
          return (
            value &&
            ((item.user && item.user.name && item.user.name.toLowerCase().includes(value.toLowerCase())) ||
             (item.title && item.title.toLowerCase().includes(value.toLowerCase())))
          );
        });
        // console.log("Filtered results:", results);
        setResults(results);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input

        // className="search-bar"
        placeholder="Type to search..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};
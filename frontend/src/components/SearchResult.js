import {useNavigate} from "react-router-dom"
import "./SearchResult.css";
import {useEffect} from "react"
import axios from "axios"

export const SearchResult = ({ result }) => {
  let navigate=useNavigate()
  const searchResults = async (result) => {
    try {
        // const response = await axios.get(`/api/searchbar/getsearchdata?q=${query}`);
        // return response.data; 
        navigate(`/videosearched/${result}`)
    } catch (error) {
        console.error("Error fetching search results:", error);
        return [];
    }
};

const handleKeyPress = (event) => {
  if (event.key === "Enter") {
    searchResults(result); // Navigate when "Enter" is pressed
  }
};

useEffect(() => {
  // Attach the keydown event listener when the component mounts
  document.addEventListener("keydown", handleKeyPress);

  // Clean up the event listener when the component unmounts
  return () => {
    document.removeEventListener("keydown", handleKeyPress);
  };
}, [result]);


  return (
    <div
      className="search-result"
      // onClick={(e) => alert(`You selected ${result}!`)}
      onClick={(e)=>searchResults(result)}
    >
      {result}
    </div>
  );
};

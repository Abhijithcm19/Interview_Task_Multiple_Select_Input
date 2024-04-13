import { useEffect, useState,useRef } from "react";
import "./App.css";
import Pill from "./components/Pill";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserSet,setSelectedUserSet] = useState(new Set());

  const inputRef = useRef(null)

  useEffect(() => {
    const fetchUsers = () => {
      if (searchTerm.trim() === "") {
        setSuggestions([]);
        return;
      }
      fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
        .then((res) => res.json())
        .then((data) => setSuggestions(data.users)) 
        .catch((err) => {
          console.error(err);
        });
    };
    fetchUsers();
  }, [searchTerm]);

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    selectedUserSet(new Set([...selectedUserSet, user.email]))
    setSearchTerm("");
    setSuggestions([]);
    inputRef.current.focus()
  };

  const handleRemoveUser = (user) => {
    const updatedUsers = selectedUsers.filter(
      (selectedUser) => selectedUser.id !== user.id
    );
    setSelectedUsers(updatedUsers);

    const updatedEmails = new Set(selectedUserSet);
    updatedEmails.delete(user.email);
    setSelectedUserSet(updatedEmails);
  };

  const handleKeyDown = (e)=> {
    if(e.key === 'Backspace'&& e.target.value === "" && selectedUsers.length > 0){
      const lastUser = selectedUsers[selectedUsers.length-1]
      handleRemoveUser(lastUser)
      setSuggestions([])

    }
  }
  console.log(selectedUsers);
  console.log("suggestions", suggestions);

  return (
    <div className="user-search-container">
      <div className="user-search-input">
        {/* Pills */}
        {selectedUsers.map((user) => {
          return (
            <Pill
              key={user.email}
              image={user.image}
              text={`${user.firstName} ${user.lastName}`}
              onClick={() => handleRemoveUser(user)}
            />
          );
        })}
        <div>
          <input
          ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="search for user"
            onKeyDown={handleKeyDown}
          />
          <ul className="suggestions-list">
            {suggestions.map((user) => {
              return !selectedUserSet.has(user.email)?(
              <li key={user.email} onClick={() => handleSelectUser(user)}>
                <img src={user.image} alt={`${user.firstName} ${user.lastName}`} />
                <span>{user.firstName} {user.lastName}</span>
              </li>
              ):(<></>)
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

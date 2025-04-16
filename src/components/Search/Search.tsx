import React from "react";
import styles from "./Search.module.css";

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
}

const Search: React.FC<SearchProps> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      className={styles.search}
      placeholder="Search by Name or Email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default Search;
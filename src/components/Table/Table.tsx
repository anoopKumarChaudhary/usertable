import React from "react";
import styles from "./Table.module.css";

interface User {
  name: string;
  email: string;
  role: string;
  status: string;
}

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

interface TableProps {
  data: User[];
  onSort: (config: SortConfig) => void;
  sortConfig: SortConfig;
}

const Table: React.FC<TableProps> = ({ data, onSort, sortConfig }) => {
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    onSort({ key, direction });
  };

  const getIcon = (key: string) => {
    if (sortConfig.key !== key) return "⇅";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  return (
    <div className={styles.main}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>Name {getIcon("name")}</th>
            <th onClick={() => handleSort("email")}>
              Email {getIcon("email")}
            </th>
                      <th onClick={() => handleSort("role")} className={ styles.head1}>Role {getIcon("role")} </th>
            <th className={ styles.head1}>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? styles.row1 : styles.row2}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td className={ styles.head1}>{user.role}</td>
              <td className={ styles.head1}>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
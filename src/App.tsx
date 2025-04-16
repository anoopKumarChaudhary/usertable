import React, { useEffect, useState } from "react";
import styles from "./App.module.css";
import Table from "./components/Table/Table";
import Search from "./components/Search/Search";
import Pagination from "./components/Pagination/Pagination";
import Footer from "./components/Footer/Footer.tsx";
import Header from "./components/Header/Header.tsx";

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

const App: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10); // Now dynamic

  useEffect(() => {
    fetch("https://dummyjson.com/users?limit=100")
      .then((res) => res.json())
      .then(
        (res: {
          users: {
            firstName: string;
            lastName: string;
            email: string;
            company?: { title: string };
            gender: string;
          }[];
        }) => {
          const users: User[] = res.users.map((user) => ({
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.company?.title || "Employee",
            status: user.gender === "male" ? "Active" : "Inactive",
          }));
          setData(users);
          setFiltered(users);
        }
      );
  }, []);

  useEffect(() => {
    let updated: User[] = [...data];
    if (searchQuery) {
      updated = updated.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortConfig.key) {
      updated.sort((a, b) => {
        const aVal = a[sortConfig.key as keyof User].toLowerCase();
        const bVal = b[sortConfig.key as keyof User].toLowerCase();
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    setFiltered(updated);
    setCurrentPage(1);
  }, [searchQuery, sortConfig, data, rowsPerPage]);

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const paginatedData: User[] = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages: number = Math.ceil(filtered.length / rowsPerPage);

  return (
    <div className={styles.app}>
      <Header />
      <div>
        {" "}
        <div className={styles.controls}>
          <Search value={searchQuery} onChange={setSearchQuery} />
          <div className={styles.rowsPerPage}>
            <label htmlFor="rowsPerPage" className={styles.label}>
              Rows per page:{" "}
            </label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className={styles.select}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
        </div>
        <Table
          data={paginatedData}
          onSort={setSortConfig}
          sortConfig={sortConfig}
        />
        {filtered.length === 0 && <p>No matching records found.</p>}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filtered.length}
          rowsPerPage={rowsPerPage}
        />
      </div>
      <Footer />
    </div>
  );
};

export default App;

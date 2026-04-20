import { FormEvent, useState } from "react";

type SearchBarProps = {
  initialValue?: string;
  onSearch: (query: string) => void;
};

export function SearchBar({ initialValue = "", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        className="search-input"
        type="text"
        placeholder="Busque por um anime..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="button" type="submit">
        Buscar
      </button>
    </form>
  );
}
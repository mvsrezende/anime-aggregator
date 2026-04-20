import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AnimeDetailPage } from "./pages/AnimeDetailPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { HomePage } from "./pages/HomePage";
import { SearchHistoryPage } from "./pages/SearchHistoryPage";
import { SearchPage } from "./pages/SearchPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="anime/:id" element={<AnimeDetailPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="history" element={<SearchHistoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
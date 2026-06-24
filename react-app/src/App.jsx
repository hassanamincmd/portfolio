import { Navigate, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Layout } from "./components/Layout";
import { AboutPage } from "./pages/AboutPage";
import { BlogPage } from "./pages/BlogPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PostPage } from "./pages/PostPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { WorkPage } from "./pages/WorkPage";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/work/:slug" element={<WorkPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<PostPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/case/:slug" element={<Navigate to="/projects" replace />} />
          <Route path="/notes" element={<Navigate to="/blog" replace />} />
          <Route path="/notes/:slug" element={<Navigate to="/blog" replace />} />
          <Route path="/work" element={<Navigate to="/projects" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Analytics />
    </>
  );
}

export default App;

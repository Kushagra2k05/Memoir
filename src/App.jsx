import { useLocation, Routes, Route } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import NavBar from './components/NavBar.jsx'
import LandingPage from './pages/LandingPage.jsx'
import RecordMemory from './pages/RecordMemory.jsx'
import StoryGeneration from './pages/StoryGeneration.jsx'
import StorybookPage from './pages/StorybookPage.jsx'
import ChildResponse from './pages/ChildResponse.jsx'
import FamilyLibrary from './pages/FamilyLibrary.jsx'
import CreateStory from './pages/CreateStory.jsx'
import StoryDetailPage from './pages/StoryDetailPage.jsx'
import FamilyLegacy from './pages/FamilyLegacy.jsx'
import { db } from "./firebase";

function App() {
  console.log("APP LOADED");
  console.log("Firebase Connected:", db);
  const location = useLocation()

  return (
    <div className="app-shell">
      <NavBar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          className="page-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/record" element={<RecordMemory />} />
            <Route path="/record-memory" element={<RecordMemory />} />
            <Route path="/generating" element={<StoryGeneration />} />
            <Route path="/storybook/:storyId" element={<StorybookPage />} />
            <Route path="/child-response/:storyId" element={<ChildResponse />} />
            <Route path="/family-library" element={<FamilyLibrary />} />
            <Route path="/create-story" element={<CreateStory />} />
            <Route path="/family-library/:storyId" element={<StoryDetailPage />} />
            <Route path="/family-legacy" element={<FamilyLegacy />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
    </div>
  )
}

export default App

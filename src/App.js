
import { Routes, Route } from "react-router-dom";
import Register from "./components/register";
import Login from "./components/login";
import Dashboard from './components/Dashboard';
import NotFound from "./components/NotFound";
function App() {

  
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/*' element={ <NotFound /> } />
      </Routes>
    </>
  );
}

export default App;

import Login from "./Components/Login/Login";
import { Route, Routes } from 'react-router'
import Register from "./Components/Register/Register";
import Home from "./Components/Home/Home";
import AddContact from "./Components/AddContact/AddContact";
import ContextApiStates from "./ContextApi/ContextApiStates";
function App() {
  return (
    <>
      <Routes>
        <Route exact path='/' element={<ContextApiStates><Login /></ContextApiStates>}></Route>
        <Route exact path='/register' element={<Register />}></Route>
        <Route exact path='/addContact/:id' element={<ContextApiStates><AddContact /></ContextApiStates>}></Route>
        <Route exact path='/home/:id/:reciever' element={
          <ContextApiStates>
            <Home />
          </ContextApiStates>}>
        </Route>
      </Routes>
    </>
  );
}

export default App;

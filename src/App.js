import React,{useState,useEffect, useMemo} from 'react';
import styles from './App.module.css';
import {BrowserRouter as Router, Routes, Route, Link, Outlet} from "react-router-dom";
import Profile from './features/todo/profile';
import Home from './features/todo/home';
import Todo from './features/todo/todo';
import { useSelector,useDispatch } from 'react-redux';
import {setusers,setTodos } from '../features/todo/taskSlice';

function App() {
  const [loading, setloading] = useState(false);
  const fakeRequest = () => {
    return new Promise(resolve => setTimeout(() => resolve(), 1000));
  };
  useEffect(()=>{
    async function getdata(){
      setloading(true);
      await fetch('http://localhost:3000/tododata')
      .then((response)=>response.json())
      .then((data)=>dispatch(setusers(data.users))
      )
      fetch('http://localhost:3000/tododata')
        .then((response)=>response.json())
        .then((data)=>dispatch(setTodos(data.todos)))
      fakeRequest().then(() => {
        const el = document.querySelector(".loader");
        if (el) {
          el.remove();
          setloading(false);
        }
      });
    }
    getdata();
  },[])
  
  const dispatch = useDispatch();
  const userState = useSelector((state)=>state.task.users);
  return (
      loading ? null:
      (<Router>
        <div className='App'>
          <div className={styles.Appnav}>
            {/* <Link to='/app' className={styles.Apphome}><h3>App Home</h3></Link> */}
            <Link to='/users' className={styles.Users}><h3><i className="fa-solid fa-users-viewfinder"></i> Users List</h3></Link>
          </div>
        </div>
        <Routes>
          <Route index element={<Users users={userState}/>}/>
          <Route path='/users' element={<Users users={userState}/>}/>
          <Route path='/users/:id' element={<User/>}>
            {/* <Route index element={<Home/>}/> */}
            <Route path='home' element={<Home/>}/>
            <Route path='profile' element={<Profile/>}/>
            <Route path='todo' element={<Todo/>}/>
            <Route path="*" element={<NotFound />}/>
          </Route>
            {/* <Route path=':id' element={<User user={userState}/>}> */}
              {/* <Route index element={<Home/>}/> */}
              {/* <Route path='home' element={<Home/>}/>
              <Route path='profile' element={<Profile/>}/>
              <Route path='todo' element={<Todo/>}/>
              <Route path="*" element={<NotFound />}/> */}
            {/* </Route> */}
            <Route path="*" element={<NotFound />}/>
        </Routes>
      </Router>)
  );
}

function Users(userState){
  const dispatch = useDispatch();
  useMemo(()=>{
    fetch('http://localhost:3000/tododata')
      .then((response)=>response.json())
      .then((data)=>dispatch(setusers(data.users))
      );
  },[])
  return(
    <div className={styles.Userspage}>
      <h2 style={{textAlign:"center",margin:0,padding:"10px"}}>Users Page</h2>
      <table className={styles.table}>
        <tr>
          <th className={styles.thead}>User Id</th>
          <th className={styles.thead}>User Name</th>
        </tr>
        {
          userState.users.map((item)=>(
            <tr key={item.id} className={styles.trow}>
              {/* <nav> */}
              <td className={styles.cell}>
                <Link to={`/users/${item.id}/home`} style={{textDecoration:"none"}} onClick={(e)=>{console.log('hello');}}>{item.id} </Link>
              </td>
              <td className={styles.cell}>
                <Link to={`/users/${item.id}/home `} style={{textDecoration:"none"}} >{item.Name}</Link>
              </td>
              {/* </nav> */}
            </tr>
            ))}
      </table>
      <Outlet/>
    </div>
  );
}
function User(){
  function someFun(){
    alert('dofjio')
  }
  return(
    <div className="User">
      <nav className={styles.Navigation}>
        <Link to='home' className={styles.home}><h3 ><i className="fa-solid fa-house-chimney"></i> Home Page</h3></Link>
        <Link to='profile' onClick={someFun} className={styles.profile}><h3><i className="fa-regular fa-id-card"></i> Profile Page</h3></Link>
        <Link to='todo' className={styles.todo}><h3><i className="fa-solid fa-clipboard-list"></i> Todo Page</h3></Link>
      </nav>
      <Outlet/>
    </div>
  )
}
function NotFound(){
  return(
    <h2>Not found</h2>
  )
}
export default App;

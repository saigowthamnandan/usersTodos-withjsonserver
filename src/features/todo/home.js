import styles from './home.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setId,setusers,setTodos } from '..todo/taskSlice';
import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
function Home(){
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const params = useParams();
    const usersState = useSelector((state)=>state.task);
    const users = usersState.users;
    const id = usersState.id;
    const user = users.filter((user)=>`${user.id}` === id)[0];
    const todos = usersState.todos;
    const userTodo = todos.filter((todo)=>`${todo.userId}` === id);
    useMemo(()=>{
        fetch('http://localhost:3000/tododata')
        .then((response)=>response.json())
        .then((data)=>dispatch(setusers(data.users))
        );
      fetch('http://localhost:3000/tododata')
        .then((response)=>response.json())
        .then((data)=>dispatch(setTodos(data.todos)))
        // if(window.location.href.includes('users/')){
        //     var endurl = window.location.href.split('users/')[1][0];
        // }
        // if(endurl!==undefined){
        //     dispatch(setId(endurl));
        // }
        dispatch(setId(params.id));
        setLoading(false);
    },[loading]);
    return(
        loading ? null :
        <div className={styles.home}>
            <h3 style={{margin:0,paddingTop:"10px"}}>Hello {user.Name}...!</h3>
            <p>This is a Todo list application that lets you manage your tasks.</p>
            <h4>Some of your tasks listed below :</h4>
            <table className={styles.todotab}>
                <tr>
                    <th className={styles.thead}>Sno.</th>
                    <th className={styles.thead}>Task</th>
                </tr>
                {
                    userTodo.map((item,index)=>(
                        (index<3)?
                        <tr key={item.id} className={styles.trow}>
                            <td className={styles.cell}>{index+1}</td>
                            <td className={styles.cell}>{item.title}</td>
                        </tr>:null
                ))}
            </table>
        </div>
    )
}
export default Home;
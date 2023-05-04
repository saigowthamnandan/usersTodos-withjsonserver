import {useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setId,setusers, setTodos } from './taskSlice';
import styles from './todo.module.css';
import ReactDOM from 'react-dom';
function Todo(){
    const dispatch = useDispatch();
    const usersState = useSelector((state)=>state.task);
    const id = usersState.id;
    const todos = usersState.todos;
    const userTodo = todos.filter((todo)=>`${todo.userId}` === id);
    const params =  useParams();
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [todoID, settodoID] = useState(null);
    const [newTodotitle,setNewTodotitle] = useState('');
    useMemo(()=>{
        fetch('http://localhost:3000/users')
        .then((response)=>response.json())
        .then((data)=>dispatch(setusers(data))
        );
        fetch('http://localhost:3000/todos')
        .then((response)=>response.json())
        .then((data)=>dispatch(setTodos(data)))
        dispatch(setId(params.id));
        setLoading(false);
    },[loading])
    function handleEdit(e){
        settodoID(e.target.className[e.target.className.length-1]);
        setShowModal(true);
    }
    const handleDeleteAsync = (Id) =>{
        fetch('http://localhost:3000/todos/'+Id,{method:'DELETE'})
        .then(()=>{
            fetch('http://localhost:3000/todos')
            .then((response)=>response.json())
            .then((data)=>dispatch(setTodos(data)))
        });
    }
    function handleDelete(e){
        settodoID(e.target.className[e.target.className.length-1]);
        handleDeleteAsync(e.target.className[e.target.className.length-1]);    
    }
    function handleChange(e){
        setNewTodotitle(e.target.value);
    }
    function handleAddtodo(){
        const allIds = [];
        todos.map((i)=>allIds.splice(allIds.length,0,i.id));
        const newTodo = {"userId":id,"id":Math.max(...allIds)+1,"title":`${newTodotitle}`,"completed":false};
        fetch('http://localhost:3000/todos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(newTodo)})
        .then(()=>{
            fetch('http://localhost:3000/todos')
            .then((response)=>response.json())
            .then((data)=>dispatch(setTodos(data)))
        })
    }
    const handleCheckAsync = (Id) => {
        const currentTodo = userTodo.filter((each)=>`${each.id}`===Id)[0];
        fetch('http://localhost:3000/todos/'+Id,{
            method:'PUT',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({...currentTodo,completed:!(currentTodo.completed)})})
    }
    function handleCheck(e){
        settodoID(e.target.className[e.target.className.length-1]);
        handleCheckAsync(e.target.className[e.target.className.length-1]);      
    }
    return(
        loading ? null :
        <div className={styles.todo}>
            <h3 className={styles.todohead}>Todo List</h3>
            <table className={styles.todotab}>
                <tr>
                    <th className={styles.thead}>Sno.</th>
                    <th className={styles.thead}>Task</th>
                    <th className={styles.thead}>Completed</th>
                    <th className={styles.thead}>Handle tasks</th>
                </tr>
                {
                    userTodo.map((item,index)=>(
                        <tr key={item.id} className={styles.trow}>
                            <td className={styles.cell}>{index+1}</td>
                            <td className={styles.cell}>{item.title}</td>
                            <td className={styles.cell}>
                                <input type='checkbox' className={`checkbox ${item.id}`} defaultChecked={item.completed} onChange={handleCheck}></input>
                            </td>
                            <td className={styles.cell}>
                                <i className={`fa-solid fa-pen-to-square fa-beat ${item.id}`}  onClick={handleEdit}></i>
                                <i className={`fa-solid fa-trash-can fa-beat ${item.id}`} onClick={handleDelete}></i>
                            </td>
                        </tr>
                    ))
                }
            </table>
            <div className={styles.addtodo}>
                <h4 style={{margin:0,alignSelf :"center"}}>Add new task:</h4>
                <div>
                    <input type='text' placeholder='Enter your task' onChange={handleChange}></input>
                    <button className={styles.addbutton} onClick={handleAddtodo}>Add task</button>
                </div>
            </div>
        {showModal ? <Modal onClose={()=>setShowModal(false)} showModal={showModal} todoID={todoID} userTodo={userTodo}></Modal>:null}
        </div>
    )
}
function Modal(props){
    const dispatch = useDispatch();
    const toggleClassname = props.showModal ? 'block' : 'none';
    const [loading, setLoading] = useState(true);
    var curTodo = props.userTodo.filter((item)=>`${item.id}` === props.todoID)[0];
    const [val, setVal] = useState(curTodo);
    useEffect(() => {
        setLoading(false);
    },[loading])
    function handleChange(e){
        setVal({...curTodo,title:e.target.value});
    }
    function handleSubmit(){
        fetch('http://localhost:3000/todos/'+props.todoID,{method:'PUT',headers:{"Content-Type":"application/json"},body:JSON.stringify(val)})
        .then(()=>{
            fetch('http://localhost:3000/todos')
            .then((response)=>response.json())
            .then((data)=>dispatch(setTodos(data)))
        });
        props.onClose();
    }
    return loading ? null : ReactDOM.createPortal(
        <div className={styles.modalcon} style={{display:toggleClassname}}>
            <div className={styles.modal}>
                <h4 className={styles.efield}>Edit todo</h4>
                <div>Title :<input className={styles.input} type='text' value={val.title} onChange={handleChange}></input></div>
                <div>
                    <button className={styles.button} onClick={handleSubmit}>Save changes</button>
                    <button className={styles.button} onClick={()=>{setVal(curTodo);props.onClose();}}>Cancel</button>
                </div>
            </div>
        </div>,document.body.querySelector('.User')
    );
}
export default Todo;
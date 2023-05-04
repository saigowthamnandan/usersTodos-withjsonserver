import {useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import ReactDOM from 'react-dom';
import React, { useState, useEffect, useMemo } from 'react';
import styles from './profile.module.css';
import { setId,setusers,setTodos } from './taskSlice';
import { useParams } from 'react-router-dom';
function Profile(){
    const userState = useSelector((state)=>state.task);
    const params =useParams();
    const users = userState.users;
    const id = userState.id;
    const user = users.filter((user)=>`${user.id}` === id)[0]
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    useMemo(()=>{
        fetch('http://localhost:3000/tododata')
        .then((response)=>response.json())
        .then((data)=>dispatch(setusers(data.users))
        );
        fetch('http://localhost:3000/tododata')
        .then((response)=>response.json())
        .then((data)=>dispatch(setTodos(data.todos)))
        dispatch(setId(params.id));
        setLoading(false);
    },[loading])
    return(
        loading ? null :
        <div className={styles.profile}>
            <div className={styles.profhead}><h3>User details</h3><i className="fa-solid fa-pen-to-square fa-beat" onClick={()=>{setShowModal(true);}}></i></div>
            <table className={styles.table}>
                <tr><td className={styles.cell}>Name:  </td><td className={styles.cell}>{user.Name}</td></tr>
                <tr><td className={styles.cell}>Age:   </td><td className={styles.cell}>{user.Age}</td></tr>
                <tr><td className={styles.cell}>Email:   </td><td className={styles.cell}>{user.Email}</td></tr>
                <tr><td className={styles.cell}>Phone:   </td><td className={styles.cell}>{user.Phone}</td></tr>
            </table>
            {showModal ? <Modal onClose={()=>setShowModal(false)} showModal={showModal} user={user}></Modal> : null}
        </div>
    )
}
function Modal(props){
    const dispatch = useDispatch();
    const toggleClassname = props.showModal ? 'block' : 'none';
    const [loading, setLoading] = useState(true);
    const [val, setVal] = useState(props.user)
    useEffect(() => {
        setLoading(false);
    },[loading])
    function handleNameChange(e){
        setVal({...props.user,Name:e.target.value});
    }
    function handleAgeChange(e){
        setVal({...props.user,Age:e.target.value});
    }
    function handleEmailChange(e){
        setVal({...props.user,Email:e.target.value});
    }
    function handlePhoneChange(e){
        setVal({...props.user,Phone:e.target.value});
    }
    function handleSubmit(){
        fetch('http://localhost:3000/users/'+props.user.id, {method:'PUT',headers:{"Content-Type":"application/json"},body:JSON.stringify(val)})
        .then(()=>{
            fetch('http://localhost:3000/users')
            .then((response)=>response.json())
            .then((data)=>dispatch(setusers(data)))
        })
        props.onClose();
    }
    return loading ? null : ReactDOM.createPortal(
        <div className={styles.modalcon} style={{display:toggleClassname}}>
            <div className={styles.modal}>
                <h4 className={styles.efield}>Edit user details</h4>
                <table className={styles.modaltable}>
                    <tr className={styles.mcell}><td><label>Name <input className={styles.input} type='text' value={val.Name} onChange={handleNameChange}></input></label></td></tr>
                    <tr className={styles.mcell}><td><label>Age <input className={styles.input} type='text' value={val.Age} onChange={handleAgeChange}></input></label></td></tr>
                    <tr className={styles.mcell}><td><label>Email <input className={styles.input} type='text' value={val.Email} onChange={handleEmailChange}></input></label></td></tr>
                    <tr className={styles.mcell}><td><label>Phone <input className={styles.input} type='text' value={val.Phone} onChange={handlePhoneChange}></input></label></td></tr>
                </table>
                <div>
                    <button className={styles.button} onClick={handleSubmit}>Save changes</button>
                    <button className={styles.button} onClick={()=>{setVal(props.user);props.onClose();}}>Cancel</button>
                </div>
            </div>
        </div>,document.body.querySelector('.User')
    );
}
export default Profile;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useHistory } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Todo from "./Todo";
import {Grid} from "@mui/material";
import Card from "@mui/material/Card";
import styles from './ViewTodos.module.css';
function Todos({ isAuthenticated, setIsAuthenticated }) {
	const [todos, setTodos] = useState([]);
	const [changed, setChanged] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [pageNumber, setPageNumber] = useState(1);
	const [pageSize, setPageSize] = useState(5);
	const [inputPageNumber, setInputPageNumber] = useState(pageNumber);
	const [inputPageSize, setInputPageSize] = useState(pageSize);
	const [filter, setFilter] = useState("All");
	const [sortBy, setSortBy] = useState("Due Date");
	let history = useHistory();

	useEffect(() => {
		if(!isAuthenticated){
			history.push("/");
		}
	}, [isAuthenticated, history])

	useEffect(() => {
		const loadData = async () => {
			let response = null;
			try {
				let url = `http://localhost:3001/api/todo/${pageNumber - 1}/${pageSize}`;

				if (filter === 'Completed') {
					url = `http://localhost:3001/api/todo/${pageNumber - 1}/${pageSize}?isCompleted=true`;
				} else if (filter === 'Not Completed') {
					url = `http://localhost:3001/api/todo/${pageNumber - 1}/${pageSize}?isCompleted=false`;
				}

				response = await axios.get(url, { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}`, } });
			} catch (error) {
				if (error.response) {
					setErrorMessage(error.response.data.message);
				} else {
					setErrorMessage('Error: something happened');
				}
				return;
			}

			setErrorMessage('');

			// Sort todos based on selected option
			const sortedTodos = response.data.sort((a, b) => {
				if (sortBy === "Due Date") {
					return new Date(a.targetDate) - new Date(b.targetDate);
				}
				// Add more sorting options here if needed
			});

			setTodos(sortedTodos);
		}

		loadData();
	}, [changed, pageNumber, pageSize, filter, sortBy])

	const nextPage = () => {
		setPageNumber(pageNumber + 1);
		setInputPageNumber(pageNumber + 1);
	}

	const previousPage = () => {
		if(pageNumber > 1){
			setPageNumber(pageNumber - 1);
			setInputPageNumber(pageNumber - 1);
		}
	}

	const enterPageNumber = (enteredPageNumber) => {
		if(enteredPageNumber >= 1){
			setPageNumber(parseInt(enteredPageNumber));
		} else {
			setPageNumber(1);
			setInputPageNumber(1);
		}
	}

	const enterPageSize = (enteredPageSize) => {
		if(enteredPageSize >= 1){
			setPageSize(parseInt(enteredPageSize));
		} else {
			setPageSize(1);
			setInputPageSize(1);
		}
	}

	const pageNumberControl = () => {
		return <div>
			<center>
				<div className="input-group col-lg-4 col-md-6 col-sm-8 col-9">
					<div className="input-group-append">
						<button className="btn btn-outline-secondary" onClick={() => previousPage()} >Previous Page</button>
					</div>
					<input className="form-control text-center" type="number" value={inputPageNumber} onChange={e => setInputPageNumber(e.target.value)} onKeyPress={e => {
						if (e.key === 'Enter') {
							enterPageNumber(e.target.value)
						}
					}}/>
					<div className="input-group-append">
						<button className="btn btn-outline-secondary" onClick={() => nextPage()}>Next Page</button>
					</div>
				</div>
			</center>
		</div>
	}

	const pageSizeControl = () => {
		return <center>
			<div className="input-group col-xl-3 col-md-4 col-sm-5 col-6">
				<div className="input-group-append">
					<span className="input-group-text" id="">Todo per page: </span>
				</div>
				<input className="form-control text-center" type="number" value={inputPageSize} onChange={e => setInputPageSize(e.target.value)} onKeyPress={e => {
					if (e.key === 'Enter') {
						enterPageSize(e.target.value)
					}
				}}
				/>
			</div>
		</center>
	}

	const filterControl = () => {
		return <center>
			<div className="col-6 offset-8">
				<label>Show</label>
				<select value={filter} onChange={(e) => setFilter(e.target.value)}>
					<option value="All">All</option>
					<option value="Completed">Completed</option>
					<option value="Not Completed">Not Completed</option>
				</select>
			</div>
		</center>
	}

	const sortOptions = ["Due Date"]; // Add more options if needed

	const sortControl = () => {
		return <center>
			<div className="col-6 offset-8">
				<label>Sort by:</label>
				<select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
					{sortOptions.map((option) => (
						<option key={option} value={option}>{option}</option>
					))}
				</select>
			</div>
		</center>
	}

	const markCompleted = async (id) => {
		try {
			await axios.put(`http://localhost:3001/api/todo/${id}/markcomplete`, {}, {
				headers: {
					'Authorization': `Bearer ${sessionStorage.getItem('token')}`
				}
			});
		} catch(error){
			if (error.response) {
				setErrorMessage(error.response.data.message);
			} else {
				setErrorMessage('Error: something happened');
			}
			return;
		}
		setErrorMessage('');
		setChanged(!changed);
	}

	const deleteTodo = async (id) => {
		try {
			await axios.delete(`http://localhost:3001/api/todo/${id}`, {
				headers: {
					'Authorization': `Bearer ${sessionStorage.getItem('token')}`
				}
			});
		} catch(error){
			if (error.response) {
				setErrorMessage(error.response.data.message);
			} else {
				setErrorMessage('Error: something happened');
			}
			return;
		}
		setErrorMessage('');
		setChanged(!changed);
	}

	const showErrorMessage = () => {
		if(errorMessage === ''){
			return <div></div>
		}

		return <div className="alert alert-danger" role="alert">
			{errorMessage}
		</div>
	}

	return (
		<div className="container">
			<h1 className="text-center">Todo List</h1>
			{showErrorMessage()}

			{filterControl()}
			{sortControl()} {/* Add the new sort control here */}

			<Grid container spacing={3}>
				{todos.map((todo) => (
					<Grid item key={todo.id}>
						<Card className={`${styles.box} ${todo.isCompleted ? styles.completed : ''}`}>
							<Todo todo={todo} markCompleted={markCompleted} deleteTodo={deleteTodo}/>
						</Card>
					</Grid>
				))}
				<Grid item className={styles.add}>
					<Card className={styles.iconbox} onClick={() => history.push("/add")}>
						<div className={styles.iconContainer}>
							<AddIcon className={styles.addIcon} />
						</div>
					</Card>
				</Grid>
			</Grid>

			{/*{pageSizeControl()}*/}
			{/*{pageNumberControl()}*/}
		</div>
	);
}

export default Todos;


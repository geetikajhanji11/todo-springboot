import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Checkbox } from '@mui/material';
import Card from '@mui/material/Card';

import styles from './Todo.module.css';

function Todo({ todo, markCompleted, deleteTodo }) {
    return (
        // <Card className={styles.box}>
        <div className={styles.todoContainer}>

            <div className={styles.todo}>
                <div className={styles.header}>
                    <div className={styles.titleContainer}>
                        <strong className={styles.title}>{todo.title}</strong>
                        <span className={styles.dueDate}>{moment(todo.targetDate).format('ll')}</span>
                    </div>
                    <Checkbox onChange={() => markCompleted(todo.id)} checked={todo.isCompleted} color="success"
                              className={styles.checkbox}/>
                </div>

                <p className={styles.description}>{todo.description}</p>
            </div>

            <div className={styles.actions}>
                <Link to={{pathname: `/update/${todo.id}`}}>
                    <button className="btn btn-primary">
                        <EditIcon/>
                    </button>
                </Link>
                <button className="btn btn-danger" onClick={() => deleteTodo(todo.id)}>
                    <DeleteIcon/>
                </button>
            </div>
        </div>
        // </Card>
    );
}

export default Todo;

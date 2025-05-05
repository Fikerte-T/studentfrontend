import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {Container, Paper, Button} from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function Student() {
    
    const paperSytle = {padding:"50px 20px", width:"600px", margin:"20px auto", display:"flex", flexDirection:"column", alignItems:"center"}
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [students, setStudents] = useState([])
    const [editingId, seteditingId] = useState(null);

    const handleSubmit = e => {
        e.preventDefault()
        const student = {name, address}
        if(editingId === null) {
            fetch('http://localhost:8080/student/add', {
                method: "POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(student)
            })
            .then(() => {
                setName('')
                setAddress('')
            })
        } else {
            fetch(`http://localhost:8080/student/edit/${editingId}`, {
            method: "PUT",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(student)
        })
        .then(() => {
            setName('')
            setAddress('')
            seteditingId(null)
        })
        }
    }
    const handleDelete = id => {
        fetch('http://localhost:8080/student/' + id, {
            method: 'DELETE',
          })
          .then(res => {
            if(res.ok) {
                setStudents(students.filter(student => student.id !== id))
            } else {
                console.log("error deleting student")
            }
          })
          .catch(error => {
            console.error("error deleting student:", error)
          })
        }

    const handleUpdate = id => {
        const student = students.find(s => s.id === id)
        console.log(student)
        setName(student.name)
        setAddress(student.address)
        seteditingId(id)
    }

    useEffect(()=> {
        fetch('http://localhost:8080/student/getAll')
        .then(resp => resp.json())
        .then(result => setStudents(result))
    }, [students])
 return (
    
    <Container>
        <Paper elevation={3} style={paperSytle}>
            <h1 style={{color:"blue"}}><u>Add Student</u></h1>
        <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1 } }}
            noValidate
            autoComplete="off"
            >
            <TextField id="outlined-basic" label="Student Name" variant="outlined" fullWidth
            value={name}
            onChange={e => setName(e.target.value)}
            />
            <TextField id="outlined-basic" label="Student Address" variant="outlined" fullWidth
            value={address}
            onChange={e => setAddress(e.target.value)}
            />
        </Box>
        <Button variant="contained" onClick={handleSubmit}>{editingId === null ? "Submit" : "Update" }</Button>
        </Paper>
        <Paper elevation={3} style={paperSytle}>
            <h1>Students</h1>
            {students.map(student => (
                <Paper elevation={6} style={{width:"80%", margin:"10px", padding:"15px", textAlign:"left"}} key={student.id}>
                    id: {student.id} <br/>
                    Name: {student.name} <br/>
                    Address: {student.address}
                    <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => handleDelete(student.id)}>
                        Delete
                    </Button>
                    <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleUpdate(student.id)} >
                        Update
                    </Button>
                </Paper>
            ))}
        </Paper>
    </Container>
  
  );
}

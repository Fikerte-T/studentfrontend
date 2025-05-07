import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {Container, Paper, Button, CircularProgress, Typography} from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function Student() {
    
    const paperSytle = {padding:"50px 20px", width:"600px", margin:"20px auto", display:"flex", flexDirection:"column", alignItems:"center"}
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [students, setStudents] = useState([])
    const [editingId, seteditingId] = useState(null);
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [noStudents, setNoStudents] = useState(true)

    const handleSubmit = e => {
        e.preventDefault()
       
        
        if(editingId === null) {
            let student = null
            if(name.trim() === '' && address.trim() === '') {
                setError(true)
            } else {
                setError(false)
                student = {name, address}
                fetch('http://localhost:8080/student/add', {
                    method: "POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify(student)
                })
                .then(res => res.json())
                .then(addedStudent => {
                  // Add to local list without refetching
                    setStudents(prev => [...prev, addedStudent]);
                })
                .then(() => {
                    setName('')
                    setAddress('')
                })
            }
          
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
        setName(student.name)
        setAddress(student.address)
        seteditingId(id)
    }

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:8080/student/getAll')
          .then(resp => resp.json())
          .then(result => setStudents(result))
        //   .catch(err => console.error("Fetch error:", err))
          .finally(() => setLoading(false));
      }, []);
      useEffect(() => {
        setNoStudents(students.length === 0);
      }, [students]);
 return (
    
    <Container>
        <Paper elevation={3} style={paperSytle}>
            <h1>Add Student</h1>
        <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1 } }}
            noValidate
            autoComplete="off"
            >
            <TextField 
                error={error}
                id="outlined-error-helper-text"
                helperText= {error ? "Name is required" : ""}
                label="Student Name" 
                fullWidth
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <TextField 
                error={error}
                helperText= {error ? "Address is required" : ""}
                id="outlined-basic" 
                label="Student Address" 
                variant="outlined" 
                fullWidth 
                value={address}
                onChange={e => setAddress(e.target.value)}
            />
        </Box>
        <Button variant="contained" onClick={handleSubmit}>{editingId === null ? "Submit" : "Update" }</Button>
        </Paper>
        <Paper elevation={3} style={paperSytle}>
            <h1>Students</h1>
            {loading && <CircularProgress />}
            {!loading && noStudents && <Typography>No students found.</Typography>}
            {!loading && !noStudents && (
                students.map(student => (
                    <Paper elevation={6} style={{width:"80%", margin:"10px", padding:"15px", textAlign:"left"}} key={student.id}>
                        <Box><b>id: </b>{student.id}</Box> <br/>
                        <Box><b>Name: </b> {student.name} </Box><br/>
                        <Box><b>Address: </b> {student.address}</Box><br/>
                        <Button size='small' variant="outlined" startIcon={<DeleteIcon />} onClick={() => handleDelete(student.id)}>
                            Delete
                        </Button>
                        <Button size='small' variant="outlined" startIcon={<EditIcon />} onClick={() => handleUpdate(student.id)} >
                            Update
                        </Button>
                    </Paper>
                ))
            )}
            
            
        </Paper>
    </Container>
  
  );
}

import { 
    Dialog, 
    DialogTitle, 
    DialogContent,
    DialogActions, 
    Button, 
    TextField, 
    Select, 
    FormControl, 
    InputLabel, 
    MenuItem 
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/authContext';
import { Task } from '../homepage';

type MyDialogBoxProps = {
    open: boolean,
    title: string,
    setOpen: (open: boolean) => void,
    addTask: (newTask: any) => void
}

export function CreateTaskDialog(props: MyDialogBoxProps) {
    const [title, setTitle] = useState('');

    const {token} = useAuth();
  
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const accessToken = token;
  
        const response = await fetch('http://localhost:3000/tasks/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ title }),
        });
  
        const data = await response.json();
        props.addTask(data);
        props.setOpen(false);
        setTitle("");
    };
  
    return (
      <Dialog open={props.open} onClose={() => {props.setOpen(false), setTitle("")} } fullWidth maxWidth="sm">
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              margin="dense"
              id="title"
              label="Title"
              type="text"
              fullWidth
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <DialogActions>
              <Button onClick={() => props.setOpen(false)}>Cancel</Button>
              <Button type="submit">Create</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    );
}

type MyEditBoxProps = {
    task: Task | null,
    setTask: (e: any) => void,
    editTaskFunction: (newTask: any) => void,
    setActiveTask: (id: string) => void,
    setTimeSpent: (time: number) => void,
}

export function EditTaskDialog(props: MyEditBoxProps) {

    const [selectedStatus, setSelectedStatus] = useState("Finished");

    const [selectedLabel, setSelectedLabel] = useState("0");

    const {token} = useAuth();

    const handleChange = (event: any) => {
        setSelectedStatus(event.target.value);
    };

    const handleLabelChange = (event: any) => {
        setSelectedLabel(event.target.value);
    };

    useEffect(() => {
        if (props.task) {
            setSelectedStatus(props.task.status);
            setSelectedLabel(props.task.title);
        }
    }, [props.task]);

    const handleEdit = () => {
        const accessToken = token;

        fetch('http://localhost:3000/tasks/update', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({_id: props.task?._id, status: selectedStatus, title: selectedLabel})
        })
        .then(response => response.json())
        .then(updatedTask => {
            props.editTaskFunction(updatedTask);
            props.setTask(null);
            if (selectedStatus === "Active") {
                props.setActiveTask(updatedTask._id);
                props.setTimeSpent(updatedTask.timeSpent);
            }else {
                props.setActiveTask("");
                props.setTimeSpent(0);
            }
        });
    };

    const onClosed = () => {
        props.setTask(null);
        setSelectedStatus("");
        setSelectedLabel("");
    };
    
    return (
      <Dialog open={props.task !== null} onClose={onClosed} fullWidth maxWidth="sm">
            <DialogTitle>Edit Task</DialogTitle>
            <DialogContent>
                <TextField margin="dense"
                id="title"
                label="Title"
                onChange={handleLabelChange}
                type="text" sx={{marginBottom: "1rem"}} fullWidth
                value={selectedLabel}
                />
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Status</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Status"
                        onChange={handleChange}
                        value={selectedStatus}
                    >
                        {props.task && props.task.status === "Created" ? <MenuItem value={props.task.status}>{props.task.status}</MenuItem> : ""}
                        <MenuItem value={"Active"}>Active</MenuItem>
                        <MenuItem value={"Onhold"}>Onhold</MenuItem>
                        <MenuItem value={"Finished"}>Finished</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.setTask(null)}>Cancel</Button>
                <Button onClick={handleEdit}>Edit</Button>
            </DialogActions>
      </Dialog>
    )
}

export default CreateTaskDialog

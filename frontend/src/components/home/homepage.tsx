import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import CreateTaskDialog from './helper_components/dialogbox';
import { EditTaskDialog } from './helper_components/dialogbox';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authContext';

export type Task = {
    _id: string;
    title: string;
    owner: string;
    status: string;
    timeSpent: number;
};


function Homepage() {

    const {token, username, setToken, setUsername, setLoggedIn} = useAuth();

    const [openCreate, setOpenCreate] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTask, setActiveTask] = useState<string>("");
    const [prevTask, setPrevTask] = useState<string>(activeTask);
    const [editTask, setEditTask] = useState<Task | null>(null);
    const [timeSpent, setTimeSpent] = useState<number>(0);

    useEffect(() => {
        const accessToken = token;
      
        fetch('http://localhost:3000/tasks/all', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
          .then(response => response.json())
          .then(data => {
            setTasks(data);
            const activeTask = data.find((task: Task) => task.status === "Active");
            if (activeTask) {
                setActiveTask(activeTask._id);
                setTimeSpent(activeTask.timeSpent);
            }
        });
    }, []);

    useEffect(() => {
        let timer : any = null;
    
        if (activeTask) {
            timer = setInterval(() => {
                setTimeSpent(timeSpent => timeSpent + 1);
            }, 1000);
        }
    
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [activeTask]);

    useEffect(() => {
        const accessToken = token;
        if (activeTask) {
            if(activeTask && prevTask !== "" && prevTask !== activeTask) {
                fetch('http://localhost:3000/tasks/update', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify({_id: prevTask, status: "Onhold"})
                })
                .then(response => response.json())
                .then(updatedTask => {
                    editTaskFunction(updatedTask);
                });
            }
            setPrevTask(activeTask);
        }
    }, [activeTask]);

    const search = (event: React.ChangeEvent<HTMLInputElement>) => {
        const accessToken = token;

        fetch('http://localhost:3000/tasks/search', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({title: event.target.value})
        })
        .then(response => response.json())
        .then(data => setTasks(data));
    };

    const deleteFunction = (id: string) => {
        const accessToken = token;

        fetch('http://localhost:3000/tasks/delete', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({_id: id})
        })
        .then(response => {
            if (response.ok) {
              setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
            }
        });
    }

    const handleTask = (task: Task) => {

        const accessToken = token;

        if(activeTask === task._id) {

            fetch('http://localhost:3000/tasks/update', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({_id: task._id, status: "Onhold"})
            })
            .then(response => response.json())
            .then(updatedTask => {
                editTaskFunction(updatedTask);
            });


            setActiveTask("");
            setTimeSpent(0);
            return;
        }

        fetch('http://localhost:3000/tasks/update', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({_id: task._id, status: "Active"})
            })
            .then(response => response.json())
            .then(updatedTask => {
                editTaskFunction(updatedTask);
        });

        setActiveTask(task._id);
        setTimeSpent(task.timeSpent);
    }

    const addTask = (newTask: any) => {
        setTasks(prevTasks => [...prevTasks, newTask]);
    };

    const editTaskFunction = (newTask: any) => {
        setTasks(prevTasks => prevTasks.map(task => 
            task._id === newTask._id ? newTask : task
        ));
    };

    return (
        <div className="w-10/12 h-3/4">
            <CreateTaskDialog addTask={addTask} open={openCreate} title="Create Task" setOpen={setOpenCreate}/>
            <EditTaskDialog setActiveTask={setActiveTask} setTimeSpent={setTimeSpent} task={editTask} editTaskFunction={editTaskFunction} setTask={setEditTask}/>
            <h1 className="text-3xl mb-3">Tasks</h1>
            <div className='flex justify-between mb-2'>
                <div className='flex'>
                    <input type="text" onChange={search}  className='pl-3 border-2 h-8 rounded-md' placeholder='search ...'></input>
                </div>
                <button className='mr-2 text-green-500 hover:text-green-800' onClick={() => setOpenCreate(true)}><AddCircleOutlineIcon/></button>
            </div>
            <table className="min-w-full divide-y border divide-gray-200 overflow-x-auto">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className=" sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th scope="col" className="sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                        <th scope="col" className="sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
                        <th scope="col" className="sm:px-6 py-3 text-left text-xs sm:flex sm:justify-center font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {tasks.map((task, index) => (
                        <tr key={index}>
                        <td className="sm:px-6 px-1 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="text-xs sm:w-full sm:text-sm overflow-hidden w-7 overflow-ellipsis whitespace-nowrap font-medium text-gray-900">{task.title}</div>
                            </div>
                        </td>
                        <td className="sm:px-6 px-1 py-4">
                            <div className="text-xs sm:text-sm whitespace-nowrap overflow-ellipsis overflow-hidden w-8 sm:w-full text-gray-900">{username}</div>
                        </td>
                        <td className="sm:px-6 px-1 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs sm:text-sm leading-5 font-semibold rounded-full
                            ${task.status === "Created" ? "bg-yellow-100 text-yellow-800": 
                              task.status === "Active" ? "bg-green-100 text-green-800" :
                              task.status === "Finished" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`
                            }>
                                {task.status}
                            </span>
                        </td>
                        <td className="sm:px-6 px-4 py-4 whitespace-nowrap text-xs sm:text-base text-gray-500">
                            {Math.floor((task._id === activeTask ? timeSpent : task.timeSpent) / 3600) >= 10 ? "" : "0"}
                            {Math.floor((task._id === activeTask ? timeSpent : task.timeSpent) / 3600)}:
                            {Math.floor((task._id === activeTask ? timeSpent : task.timeSpent) % 3600 / 60) >= 10 ? "" : "0"}
                            {Math.floor((task._id === activeTask ? timeSpent : task.timeSpent) % 3600 / 60)}:
                            {Math.floor((task._id === activeTask ? timeSpent : task.timeSpent) % 3600 % 60) >= 10 ? "" : "0"}
                            {Math.floor((task._id === activeTask ? timeSpent : task.timeSpent) % 3600 % 60)}
                        </td>
                        <td className={`sm:px-6 px-1 py-4 whitespace-nowrap sm:flex sm:justify-around text-xs sm:text-sm font-medium`}>
                            <button onClick={() => handleTask(task)}  className={`${task._id === activeTask ? "text-green-500 hover:text-green-800" : "text-yellow-500 hover:text-yellow-600"} ${task.status === "Finished" ? "text-gray-300 hover:text-gray-300" : ""}`} disabled={task.status === "Finished"}> {activeTask === task._id ? <PauseCircleFilledIcon/> : <PlayCircleFilledWhiteIcon/>} </button>
                            <span>
                                <button className="text-indigo-600 sm:mr-2 hover:text-indigo-900" onClick={() => setEditTask(task)}><EditIcon/></button>
                                <button className=" text-red-600 hover:text-red-900" onClick={() => deleteFunction(task._id)}><DeleteIcon/></button>
                            </span>
                        </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='mt-4'>
                <button className='bg-blue-500 text-white rounded-md w-20 h-8 hover:bg-blue-700' onClick={() => {setToken(null); setUsername(null); setLoggedIn(false);}}>Log out</button>
            </div>
        </div>
    )
}

export default Homepage

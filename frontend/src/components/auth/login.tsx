import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";

function Login() {

    const [usernameForm, setUsernameForm] = useState("");
    const [password, setPassword] = useState("");

    const [usernameErrorMessage,  setUsernameErrorMessage] = useState("");
    const [passwordErrorMessage,  setPasswordErrorMessage] = useState("");

    const navigate = useNavigate();

    const {setToken, setLoggedIn, setUsername} = useAuth();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if(usernameForm === "") {
            setUsernameErrorMessage("username can't be empty");
            return false;
        }
    
        setUsernameErrorMessage("");
    
        if(password === "") {
            setPasswordErrorMessage("Please choose a password.");
            return false;
        }
    
        setPasswordErrorMessage("");


        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            username: usernameForm,
            password
            })
        });
    
        if (!response.ok) {
            // Handle error
            setPasswordErrorMessage("Error logging into your account, try again.");
            return;
        }
    
        const data = await response.json();
        setLoggedIn(true);
        setToken(data.access_token);
        setUsername(usernameForm);

        navigate('/');
    };

    return (
        <div className="w-10/12 sm:w-2/4">
            <h1 className="text-3xl mb-4">Sign In</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-xl border rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
                <div className="mb-4">
                <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="username">
                    Username
                </label>
                <input
                    className="shadow appearance-none mb-2 border rounded w-full py-2 px-3 text-grey-darker"
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={usernameForm}
                    onChange={(e) => setUsernameForm(e.target.value)}
                />
                <p className="text-red-500 text-xs italic">{usernameErrorMessage}</p>
                </div>
                <div className="mb-6">
                <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="password">
                    Password
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-2"
                    id="password"
                    type="password"
                    placeholder="******************"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-red-500 text-xs italic">{passwordErrorMessage}</p>
                </div>
                <div className="flex items-center justify-between">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
                    Sign In
                </button>
                <Link to="/signup" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                    Don't have an account ?
                </Link>
                </div>
            </form>
        </div>
    )
}

export default Login

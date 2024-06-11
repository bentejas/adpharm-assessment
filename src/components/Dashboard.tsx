import React, { useState, useEffect } from 'react';
import UserList from './UserList';

// dashboard component to display user progress and manager info
const Dashboard: React.FC = () => {
    // state to hold the manager's name
    const [managerName, setManagerName] = useState('');

    // effect to fetch the manager's name from a simulated backend (text file)
    useEffect(() => {
        fetch('/managerName.txt') // fetch the manager's name from a text file
            .then(response => response.text()) // convert the response to text
            .then(data => setManagerName(data.trim())) // set the manager's name in state
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-inter text-indigo-950">
            {/* header section with the dashboard title and manager's name */}
            <header className="w-full max-w-7xl mx-auto px-4 border-b border-gray-300 py-4 flex justify-between items-center shadow-md">
                <h1 className="text-2xl font-bold">User Progress Dashboard</h1>
                <div className="text-right">
                    <p className="text-sm text-gray-700">
                        Welcome, {managerName} <span role="img" aria-label="waving hand">👋</span>
                    </p>
                </div>
            </header>
            {/* main content section with the user list */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
                <UserList />
            </main>
            {/* footer section */}
            <footer className="w-full max-w-7xl mx-auto px-4 py-4 text-gray-500 text-sm">
                <p className="text-center">&copy; The Adpharm</p>
            </footer>
        </div>
    );
};

export default Dashboard;

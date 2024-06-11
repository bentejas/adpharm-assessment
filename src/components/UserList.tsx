import React, { useState, useRef, useEffect } from 'react';
import { usersProgress, UserProgress } from '../lib/data';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import Accordion from './Accordion';

// component to render the list of users and their progress
const UserList: React.FC = () => {
    return (
        <div className="container mx-auto p-4">
            {/* header for the user list */}
            <h2 className="text-2xl font-bold mb-4 text-center">User List</h2>
            <p className="text-xl mb-6 text-center">Summary of all employee progress found below.</p>
            <div className="flex flex-wrap -mx-4">
                {/* map through usersProgress to display each user's progress */}
                {usersProgress.map((user: UserProgress) => (
                    <div key={user.user_id} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
                        <UserCard user={user} />
                    </div>
                ))}
            </div>
        </div>
    );
};

// component to render individual user cards
const UserCard: React.FC<{ user: UserProgress }> = ({ user }) => {
    const [showDetails, setShowDetails] = useState(false); // state to manage whether the details section is shown
    const overallProgress = calculateOverallProgress(user.progress); // calculate the overall progress of the user
    const detailsRef = useRef<HTMLDivElement>(null); // reference to the details section

    // effect to handle the expansion and collapse of the details section with animation
    useEffect(() => {
        if (detailsRef.current) {
            if (showDetails) {
                detailsRef.current.style.maxHeight = `${detailsRef.current.scrollHeight}px`; // expand the details section to its full height
            } else {
                detailsRef.current.style.maxHeight = `${detailsRef.current.scrollHeight}px`; // set max height to current scroll height
                detailsRef.current.getBoundingClientRect(); // trigger reflow to apply the maxHeight change
                detailsRef.current.style.maxHeight = '0px'; // collapse the details section
            }
        }
    }, [showDetails]);

    // effect to handle the transition end event for the details section
    useEffect(() => {
        const handleTransitionEnd = () => {
            if (detailsRef.current && showDetails) {
                detailsRef.current.style.maxHeight = 'none'; // remove maxHeight restriction after expanding
            }
        };

        const detailsEl = detailsRef.current;
        if (detailsEl) {
            detailsEl.addEventListener('transitionend', handleTransitionEnd); // add event listener for transition end
        }

        return () => {
            if (detailsEl) {
                detailsEl.removeEventListener('transitionend', handleTransitionEnd); // clean up event listener
            }
        };
    }, [showDetails]);

    return (
        <div className="bg-indigo-100 text-indigo-950 rounded-[50px] shadow-lg p-6 flex flex-col items-center hover:transform-gpu hover:scale-[1.02] hover:shadow-2xl transition-transform duration-200">
            <h3 className="text-xl font-bold mb-2 text-center w-full">{user.name}</h3>
            <div className="w-full mb-4 rounded-[25px] p-5 bg-white">
                {/* render progress for each module */}
                {Object.keys(user.progress).map((module) => (
                    <div key={module} className="mb-2">
                        <p className="font-medium text-indigo-950 text-sm">{module}</p>
                        <ProgressBar progress={calculateModuleProgress(user.progress[module])} />
                    </div>
                ))}
                {/* render overall progress status */}
                <Status progress={overallProgress} />
                <div
                    ref={detailsRef}
                    className="mt-4 overflow-hidden transition-max-height duration-300 ease-in-out"
                    style={{ maxHeight: '0px' }} // initial maxHeight set to 0 to hide the details section
                >
                    <p className="pb-4">Questions and Answers:</p>
                    {/* render details for each module */}
                    {Object.keys(user.progress).map((module) => (
                        <Accordion key={module} title={module}>
                            {Object.keys(user.progress[module]).map((submodule) => (
                                <div key={submodule} className="mb-2">
                                    <p className="font-medium text-indigo-950 text-sm mb-1">{submodule}</p>
                                    {Object.keys(user.progress[module][submodule]).map((question) => (
                                        <div key={question} className="ml-4 mb-1">
                                            <p className="text-xs text-indigo-950"><strong>{question}</strong>: {user.progress[module][submodule][question] || 'N/A'}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </Accordion>
                    ))}
                </div>
            </div>
            <button
                onClick={() => setShowDetails(!showDetails)}
                className="rounded-full p-4 m-2 bg-indigo-700 text-white w-36 transition-all duration-300">
                {showDetails ? 'Hide Details' : 'See Details'}
            </button>
        </div>
    );
};

// component to render the progress bar for a module
const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
    const progressColor = '#565add'; // color for the progress bar
    const textColor = progress >= 50 ? 'text-white' : 'text-indigo-950'; // text color based on progress

    return (
        <div className="relative w-full h-4 bg-gray-200 rounded-full">
            <div className="absolute top-0 left-0 h-4 rounded-full"
                style={{ width: `${progress}%`, backgroundColor: progressColor }}>
            </div>
            <div
                className={`absolute top-0 left-0 w-full h-4 flex items-center justify-center text-xs font-bold ${textColor}`}>
                {progress}%
            </div>
        </div>
    );
};

// component to render the status of overall progress
const Status: React.FC<{ progress: number }> = ({ progress }) => {
    // completed status
    if (progress === 100) {
        return (
            <div className="flex items-center justify-center mt-4 text-indigo-700">
                <FaCheckCircle className="mr-2" />
                <span>Completed</span>
            </div>
        );
    // in progress status
    } else if (progress > 0) {
        return (
            <div className="flex items-center justify-center mt-4 text-cyan-500">
                <FaHourglassHalf className="mr-2" />
                <span>In Progress</span>
            </div>
        );
    // not started status
    } else {
        return (
            <div className="flex items-center justify-center mt-4 text-red-500">
                <FaTimesCircle className="mr-2" />
                <span>Not Started</span>
            </div>
        );
    }
};

// function to calculate progress for a module
const calculateModuleProgress = (module: { [submodule: string]: { [question: string]: string | null } }): number => {
    const totalQuestions = Object.values(module).reduce((acc, submodule) => acc + Object.keys(submodule).length, 0); // total number of questions in the module
    const answeredQuestions = Object.values(module).reduce(
        (acc, submodule) => acc + Object.values(submodule).filter(answer => answer !== null).length,
        0
    ); // total number of answered questions
    return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0; // calculate and return progress percentage
};

// function to calculate overall progress across all modules for a user
const calculateOverallProgress = (progress: { [module: string]: { [submodule: string]: { [question: string]: string | null } } }): number => {
    const totalModules = Object.keys(progress).length; // total number of modules
    const moduleProgresses = Object.values(progress).map(module => calculateModuleProgress(module)); // calculate progress for each module
    const overallProgress = moduleProgresses.reduce((acc, progress) => acc + progress, 0) / totalModules; // calculate overall progress
    return Math.round(overallProgress); // round and return the overall progress
};

export default UserList;

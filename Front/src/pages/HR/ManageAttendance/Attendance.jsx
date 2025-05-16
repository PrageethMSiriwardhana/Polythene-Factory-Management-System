import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AttendanceComponent = () => {
    const [attendance, setAttendance] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isArchived, setIsArchived] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAttendance();
    }, [currentPage, isArchived]);

    // Add this useEffect to check for midnight refresh
    useEffect(() => {
        const checkMidnight = setInterval(() => {
            const now = new Date();
            if (now.getHours() === 0 && now.getMinutes() === 0) {
                window.location.reload(); // Refresh the page at midnight
            }
        }, 60000); // Check every minute

        return () => clearInterval(checkMidnight); // Cleanup the interval on unmount
    }, []);

    const fetchAttendance = async () => {
        try {
            let url = 'http://localhost:3000/attendance/showattendance';
            if (isArchived) {
                url = `http://localhost:3000/attendance/get-attendance?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`;
            }
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            setAttendance(data);
        } catch (error) {
            console.error('Error fetching attendance:', error);
        }
    };

    const handleViewArchived = () => {
        setIsArchived(!isArchived);
        setCurrentPage(1);  // Reset to the first page
    };

    const handlePrevPage = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
    const handleNextPage = () => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));

    const handleTimeIn = async (userId, name, role) => {
        const timeIn = new Date().toLocaleTimeString();
        const updatedAttendance = attendance.map(att => {
            if (att.userId === userId) {
                return { ...att, timeIn: timeIn };
            }
            return att;
        });
        setAttendance(updatedAttendance);

        try {
            await fetch(`http://localhost:3000/attendance/updateattendance/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, name, role, timeIn })
            });
        } catch (error) {
            console.error('Failed to update time in:', error);
        }
    };

    const handleTimeOut = async (userId, name, role) => {
        const timeOut = new Date().toLocaleTimeString();
        const updatedAttendance = attendance.map(att => {
            if (att.userId === userId) {
                return { ...att, timeOut: timeOut };
            }
            return att;
        });
        setAttendance(updatedAttendance);

        const existingAttendance = attendance.find(att => att.userId === userId);
        const { timeIn } = existingAttendance || {};

        try {
            await fetch(`http://localhost:3000/attendance/updateattendance/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, name, role, timeIn, timeOut })
            });
            window.location.reload();
        } catch (error) {
            console.error('Failed to update time out:', error);
        }
    };

    const handleGenerateReport = async () => {
        try {
            const response = await fetch(`http://localhost:3000/attendance/generatereport`, { method: 'GET' });
            if (!response.ok) {
                throw new Error('Failed to generate report');
            }
            const blob = await response.blob();
            const currentDate = new Date();
            const formattedDate = currentDate.getFullYear() + '-' + ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' + ('0' + currentDate.getDate()).slice(-2);
            const fileName = `attendance_report_${formattedDate}.xlsx`;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Failed to generate report:', error);
        }
    };
    
    const filteredAttendance = Array.isArray(attendance)
        ? attendance.filter(att =>
            (att.userId && att.userId.toString().includes(searchTerm)) ||
            (att.name && att.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (att.role && att.role.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : [];

    const totalPages = Math.ceil(filteredAttendance.length / rowsPerPage);
    const indexFrom = (currentPage - 1) * rowsPerPage;
    const indexTo = currentPage * rowsPerPage;

    return (
        <div className="attendance-container">
            <h2 className="text-3xl text-black pl-1 pt-2">Attendance Records</h2>
            <div className="mb-2 mt-5 flex items-center">
                <button onClick={handleViewArchived} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ">
                    {isArchived ? 'View Current Attendance' : 'View Archived Attendance'}
                </button>
                <button onClick={handleGenerateReport} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4">
                    Generate Report
                </button>
                <div className="relative ml-4">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 19-4-4m0-7A7 7 0 1 1 1 8 a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="block w-80 h-10 pl-10 pr-3 py-2 text-ml border border-[#54db93] rounded-lg text-blue-500 focus:ring-[#54db93]"
                        placeholder="Search by User ID or Name"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {isArchived && (
                <div className="mt-4">
                    <label className="mr-2">Start Date: </label>
                    <DatePicker selected={startDate} onChange={date => setStartDate(date)} className="border border-gray-300 rounded" />
                    <label className="ml-4 mr-2">End Date: </label>
                    <DatePicker selected={endDate} onChange={date => setEndDate(date)} className="border border-gray-300 rounded" />
                    <button onClick={fetchAttendance} className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Fetch Archived Attendance
                    </button>
                </div>
            )}

            <table className="w-full text-sm text-left text-gray-500 mt-4">
                <thead className="text-xs text-black uppercase bg-[#54db93]">
                    <tr>
                        <th scope="col" className="px-6 py-3">User ID</th>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Role</th>
                        <th scope="col" className="px-6 py-3">Date In</th>
                        <th scope="col" className="px-6 py-3">Time In</th>
                        <th scope="col" className="px-6 py-3">Time Out</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        {!isArchived && (
                            <th scope="col" className="px-6 py-3">Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody className="text-xs text-black bg-[#cdf8da]">
                {filteredAttendance.slice(indexFrom, indexTo).map((att, index) => (
                    <tr key={index} className="hover:bg-[#a1f0c6]">
                        <td className="px-6 py-4">{att.userId}</td>
                        <td className="px-6 py-4">{att.name}</td>
                        <td className="px-6 py-4">{att.role}</td>
                        <td className="px-6 py-4">
                            {new Date(att.dateIn).toISOString().split('T')[0]}
                        </td>
                        <td className="px-6 py-4">{att.timeIn}</td>
                        <td className="px-6 py-4">{att.timeOut}</td>
                        <td className="px-6 py-4">{att.status}</td>
                        {!isArchived && (
                            <td className="px-6 py-4">
                                <button onClick={() => handleTimeIn(att.userId, att.name, att.role)} className="px-2 py-1 mr-2 bg-green-500 text-white rounded" disabled={!!att.timeIn}>
                                    Time In
                                </button>
                                <button onClick={() => handleTimeOut(att.userId, att.name, att.role)} className="px-2 py-1 bg-red-500 text-white rounded" disabled={!!att.timeOut}>
                                    Time Out
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>

            </table>

            <div className="flex justify-between mt-4">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Previous
                </button>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Next
                </button>
            </div>
        </div>
    );
};

export default AttendanceComponent;

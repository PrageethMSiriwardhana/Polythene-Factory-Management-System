import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button } from "flowbite-react";
import { IoIosAddCircle } from "react-icons/io";
import AllowanceCard001 from './Cards/AllowanceCard001';
import { useNavigate } from 'react-router-dom';
import { TiArrowBackOutline } from "react-icons/ti";
import AddFoodAllowancomp from '../Addition/componets/AddFoodAllowancomp';
import EdditFoodAllowancomp from '../Addition/componets/EdditFoodAllowancomp';
import RemoveFoodAllowancecomp from '../Addition/componets/RemoveFoodAllowancecomp';
import { motion } from 'framer-motion';

const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delay: 0.2,
            when: "beforeChildren",
            staggerChildren: 0.2,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const MySwal = withReactContent(Swal);

export default function FoodAllowance() {
    const [allowances, setAllowances] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentDateTime, setCurrentDateTime] = useState('');
    
    const [addfoodallowancecomponet, setAddFoodAllowancecomponet] = useState(false);
    const [editfoodallowancecomponet, setEditFoodAllowancecomponet] = useState(false);
    const [idToEdit, setIdToEdit] = useState(null);
    const [handleRemovecomponet, setHandleRemovecomponet] = useState(false);
    const [idToRemove, setIdToRemove] = useState(null);

    const navigate = useNavigate();

    const handleMonthFoodAllowance = () => {
        navigate('/finance?tab=monthfoodAllwance');
    };

    const handleAddtion = () => {
        navigate('/finance?tab=additiondash');
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const dateString = now.toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
            const timeString = now.toLocaleTimeString('en-US', {
                hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true
            });
            setCurrentDateTime(`${dateString}, ${timeString}`);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchAllowances();
        handleMonthCount();
        handleSubmit();
        handleSubmitEarning();
        handleSubmitUserLoan();
        handleSubmitDeduct();
        handleSubmitEpsEtf();
        handleSubmitMonthFoodAllwance();
        handleSubmitMonthOT();
        handleSubmitAdditon();
        handleSubmitNetPay();
        handleSubmitMonthSalarySheet();
        handleSubmitSubMonthSalarySheet();
        handleSubmitAllMonthSalarySheet();
    }, []);

    
    const handleMonthCount = async (event) => {
        //Fetch the data from the API  run to post: http://localhost:3000/salary/addmonthattempcount
        const response = await axios.post('http://localhost:3000/salary/addmonthattempcount', {
        });
        console.log(response);
    };


    const fetchRoleIncomes = async () => {
        try {
            const response = await axios.get('http://localhost:3000/salary/showallroleincome');
            setRoleIncomes(response.data);
        } catch (error) {
            console.error('Failed to fetch role incomes:', error);
        }
    };

    const handleSubmit = async (event) => {
        //Fetch the data from the API  run to post: http://localhost:3000/salary/addsalary
        const response = await axios.post('http://localhost:3000/salary/addsalary', {
        });
        console.log(response);
    };


    const handleSubmitEarning = async (event) => {

        const response = await axios.post('http://localhost:3000/salary/addearning', {
        });
        console.log(response);
    };




    const handleSubmitUserLoan = async (event) => {

        const response = await axios.post('http://localhost:3000/salary/autoaddusermonthloan', {
        });
        console.log(response);
    };

    const handleSubmitDeduct = async (event) => {

        const response = await axios.post('http://localhost:3000/salary/autoadddeduction', {
        });
        console.log(response);
    };


    const handleSubmitEpsEtf = async (event) => {

        const response = await axios.post('http://localhost:3000/salary/autoaddmonthepfetf', {
        });
        console.log(response);
    };



    const handleSubmitMonthFoodAllwance = async (event) => {

        const response = await axios.post('http://localhost:3000/salary/autoaddmonthfoodallowance', {
        });
        console.log(response);
    };



    const handleSubmitMonthOT = async (event) => {

        const response = await axios.post('http://localhost:3000/salary/autoaddmonthot', {
        });
        console.log(response);
    };


    const handleSubmitAdditon = async (event) => {

        const response = await axios.post('http://localhost:3000/salary/addadditions', {
        });
        console.log(response);
    };


    const handleSubmitNetPay = async (event) => {

        const response = await axios.post('http://localhost:3000/salary/addusernetpay', {
        });
        console.log(response);
    };


    const handleSubmitMonthSalarySheet = async (event) => {

        const response = await axios.post('http://localhost:3000/salary/addmonthsalarysheet', {
        });
        console.log(response);
    };

    const handleSubmitSubMonthSalarySheet = async (event) => {

        const response = await axios.post('http://localhost:3000/salary/addsubtotalmonthsalarysheet', {
        });
        console.log(response);
    };


    const handleSubmitAllMonthSalarySheet = async (event) => {

        const response = await axios.post('http://localhost:3000/salary/addallmonthsalarysheet', {
        });
        console.log(response);
    };


    const fetchAllowances = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:3000/salary/showfoodallowance');
            setAllowances(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch allowances:', error);
            setError('Failed to fetch allowances');
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const filteredAllowances = searchTerm
        ? allowances.filter(allowance =>
            (allowance.id && allowance.id.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        )
        : allowances;

    const totalAllowance = filteredAllowances.reduce((total, allowance) => total + allowance.allowance, 0);

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredAllowances.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredAllowances.length / rowsPerPage);

    const handlePrevPage = () => setCurrentPage(prev => prev > 1 ? prev - 1 : prev);
    const handleNextPage = () => setCurrentPage(prev => prev < totalPages ? prev + 1 : prev);

    const handleAddFoodAlawnace = () => {
        fetchAllowances();
        handleSubmit();
        handleSubmitEarning();
        handleSubmitUserLoan();
        handleSubmitDeduct();
        handleSubmitEpsEtf();
        handleSubmitMonthFoodAllwance();
        handleSubmitMonthOT();
        handleSubmitAdditon();
        handleSubmitNetPay();
        handleSubmitMonthSalarySheet();
        handleSubmitSubMonthSalarySheet();
        handleSubmitAllMonthSalarySheet();

        setAddFoodAllowancecomponet(true);
    }

    const handleEdit = (id) => {
        fetchAllowances();
        handleSubmit();
        handleSubmitEarning();
        handleSubmitUserLoan();
        handleSubmitDeduct();
        handleSubmitEpsEtf();
        handleSubmitMonthFoodAllwance();
        handleSubmitMonthOT();
        handleSubmitAdditon();
        handleSubmitNetPay();
        handleSubmitMonthSalarySheet();
        handleSubmitSubMonthSalarySheet();
        handleSubmitAllMonthSalarySheet();

        setEditFoodAllowancecomponet(true);
        setIdToEdit(id);
    }

    const handleRemove = (id) => {
        fetchAllowances();
        handleSubmit();
        handleSubmitEarning();
        handleSubmitUserLoan();
        handleSubmitDeduct();
        handleSubmitEpsEtf();
        handleSubmitMonthFoodAllwance();
        handleSubmitMonthOT();
        handleSubmitAdditon();
        handleSubmitNetPay();
        handleSubmitMonthSalarySheet();
        handleSubmitSubMonthSalarySheet();
        handleSubmitAllMonthSalarySheet();

        setHandleRemovecomponet(true);
        setIdToRemove(id);
    }

    const handleEditOnClose = () => {
        fetchAllowances();
        handleSubmit();
        handleSubmitEarning();
        handleSubmitUserLoan();
        handleSubmitDeduct();
        handleSubmitEpsEtf();
        handleSubmitMonthFoodAllwance();
        handleSubmitMonthOT();
        handleSubmitAdditon();
        handleSubmitNetPay();
        handleSubmitMonthSalarySheet();
        handleSubmitSubMonthSalarySheet();
        handleSubmitAllMonthSalarySheet();

        setEditFoodAllowancecomponet(false);
    }

    const handleOnClose = () => {
        fetchAllowances();
        handleSubmit();
        handleSubmitEarning();
        handleSubmitUserLoan();
        handleSubmitDeduct();
        handleSubmitEpsEtf();
        handleSubmitMonthFoodAllwance();
        handleSubmitMonthOT();
        handleSubmitAdditon();
        handleSubmitNetPay();
        handleSubmitMonthSalarySheet();
        handleSubmitSubMonthSalarySheet();
        handleSubmitAllMonthSalarySheet();

        setAddFoodAllowancecomponet(false);
    }

    const handleRemoveClose = () => {
        fetchAllowances();
        handleSubmit();
        handleSubmitEarning();
        handleSubmitUserLoan();
        handleSubmitDeduct();
        handleSubmitEpsEtf();
        handleSubmitMonthFoodAllwance();
        handleSubmitMonthOT();
        handleSubmitAdditon();
        handleSubmitNetPay();
        handleSubmitMonthSalarySheet();
        handleSubmitSubMonthSalarySheet();
        handleSubmitAllMonthSalarySheet();

        setHandleRemovecomponet(false);
    }

    return (
        <motion.div
            className='w-full'
            variants={container}
            initial='hidden'
            animate='visible'
            exit='hidden'
        >
            <div className="relative overflow-x-auto sm:rounded-lg">
                <div className='w-full'>
                    <div className='flex gap-4 '>
                        <div className='p-4 mt-3'>
                            <AllowanceCard001 />
                        </div>
                    </div>
                </div>

                <div className='p-5'>
                    <h1 className="text-3xl text-green-700">Food Allowance</h1>
                    <div className='mb-2 mt-5 flex items-center'>
                        <Button onClick={handleAddFoodAlawnace} className='bg-green-600'>
                            <IoIosAddCircle className="mr-2 h-5 w-5" />
                            Add Food Allowance
                        </Button>

                        <div className="relative ml-4">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="w-80 h-10 pl-10 pr-3 py-2 border border-blue-400 rounded-lg text-blue-500"
                                placeholder="Search by ID"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <Button.Group outline className='ml-2'>
                                <Button color="gray" onClick={handleMonthFoodAllowance}>
                                    <TiArrowBackOutline className="mr-3 h-4 w-4 mt-0.5" />
                                    Back
                                </Button>
                                <Button color="gray" onClick={handleAddtion}>
                                    <TiArrowBackOutline className="mr-3 h-4 w-4 mt-0.5" />
                                    Dashboard
                                </Button>
                            </Button.Group>
                        </div>
                    </div>

                    <div className="relative overflow-x-auto sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-white uppercase bg-green-600">
                                <tr>
                                    <th scope="col" className="px-6 py-7">ID</th>
                                    <th scope="col" className="px-6 py-3">Allowance Date</th>
                                    <th scope="col" className="px-6 py-3">Allowance Amount</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentRows.map((allowance) => (
                                    <tr key={allowance.id} className="bg-[#cdf8da] text-black border-b border-[#4bf885] hover:bg-[#a1f0c6]">
                                        <td className="px-6 py-4">{allowance.id}</td>
                                        <td className="px-6 py-4">{formatDate(allowance.allowanceDate)}</td>
                                        <td className="px-6 py-4">Rs. {allowance.allowance.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <a href="#" className="font-medium text-white hover:underline" style={{ marginRight: '10px' }} onClick={() => handleEdit(allowance.id)}>Edit</a>
                                            <a href="#" className="font-medium text-white hover:underline" onClick={() => handleRemove(allowance.id)}>Remove</a>
                                        </td>
                                    </tr>
                                ))}

                                <tr className="bg-green-800 text-white">
                                    <td className="px-20 py-2 text-right font-bold" colSpan="2">Sub Total (Rs.) :</td>
                                    <td className="px-6 font-bold" colSpan="2">Rs. {totalAllowance.toFixed(2)}</td>
                                </tr>
                                <tr className="bg-green-800 text-white">
                                    <td className="px-20 pb-3 text-right font-bold" colSpan="2">Total (Rs.) :</td>
                                    <td className="px-6 font-bold" colSpan="2">Rs. {totalAllowance.toFixed(4)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <nav className="flex items-center justify-between pt-2">
                    <span className="pl-10 text-sm font-normal text-gray-500">
                        Showing <span className="font-semibold text-gray-900">{indexOfFirstRow + 1}-{indexOfLastRow > filteredAllowances.length ? filteredAllowances.length : indexOfLastRow}</span> of <span className="font-semibold text-gray-900">{filteredAllowances.length}</span>
                    </span>
                    <ul className="pr-10 inline-flex -space-x-px text-sm">
                        <li>
                            <button onClick={handlePrevPage} className="px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100" disabled={currentPage === 1}>
                                Previous
                            </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li key={index}>
                                <button onClick={() => setCurrentPage(index + 1)} className={`px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100`}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                        <li>
                            <button onClick={handleNextPage} className="px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100" disabled={currentPage === totalPages}>
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {addfoodallowancecomponet && <AddFoodAllowancomp onClose={handleOnClose} />}
            {editfoodallowancecomponet && idToEdit && <EdditFoodAllowancomp onClose={handleEditOnClose} id={idToEdit} />}
            {handleRemovecomponet && idToRemove && <RemoveFoodAllowancecomp id={idToRemove} onClose={handleRemoveClose} />}
        </motion.div>
    );
}

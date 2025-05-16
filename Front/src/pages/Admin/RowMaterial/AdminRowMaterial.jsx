import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
//import './Button.css';

const MySwal = withReactContent(Swal);

export default function AdminRowMaterial() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/adminmaterial/view");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleAdd = async () => {
    const { value: formValues } = await MySwal.fire({
      title: "Add New Material",
      html: `
                <input id="swal-input1" class="swal2-input" placeholder="Material ID">
                <input id="swal-input2" class="swal2-input" placeholder="Material Name">
                <input id="swal-input3" class="swal2-input" placeholder="Quantity (kg)" type="number">
                <input id="swal-input4" class="swal2-input" placeholder="Unit Price (Rs)" type="number">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#008000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Add",
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
          document.getElementById("swal-input3").value,
          document.getElementById("swal-input4").value,
        ];
      },
    });

    if (formValues) {
      try {
        await fetch(`http://localhost:3000/adminmaterial/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            materialid: formValues[0],
            materialname: formValues[1],
            quantity: parseFloat(formValues[2]),
            price: parseFloat(formValues[3]),
          }),
        });
        MySwal.fire({
          icon: "success",
          title: "Added!",
          text: "New product has been added.",
        });
        fetchProducts();
      } catch (error) {
        console.error("Failed to add product:", error);
        MySwal.fire({
          icon: "error",
          title: "Failed to add!",
          text: "Adding new product failed.",
        });
      }
    }
  };

  const handleEdit = async (id, currentData) => {
    const { value: formValues } = await MySwal.fire({
      title: "Edit Material",
      html: `
               <label for="swal-input1">Material ID:</label>
<input id="swal-input1" class="swal2-input" value="${currentData.materialid}">
<label for="swal-input2">Material Name:</label>
<input id="swal-input2" class="swal2-input" value="${currentData.materialname}">
<label for="swal-input3">Quantity (Kg):</label>
<input id="swal-input3" class="swal2-input" value="${currentData.quantity}" type="number">
<label for="swal-input4">Price (Rs):</label>
<input id="swal-input4" class="swal2-input" value="${currentData.price}" type="number">
`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#008000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Save Changes",
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
          document.getElementById("swal-input3").value,
          document.getElementById("swal-input4").value,
        ];
      },
    });

    if (formValues) {
      try {
        await fetch(`http://localhost:3000/adminmaterial/update/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            materialid: formValues[0],
            materialname: formValues[1],
            quantity: parseFloat(formValues[2]),
            price: parseFloat(formValues[3]),
          }),
        });
        MySwal.fire({
          icon: "success",
          title: "Updated!",
          text: "Product has been updated.",
        });
        fetchProducts();
      } catch (error) {
        console.error("Failed to update product:", error);
        MySwal.fire({
          icon: "error",
          title: "Failed to update!",
          text: "Product update failed.",
        });
      }
    }
  };

  const handleRemove = async (id) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#008000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await fetch(`http://localhost:3000/adminmaterial/delete/${id}`, {
          method: "DELETE",
        });
        MySwal.fire({
          title: "Deleted!",
          text: "Product has been deleted.",
          icon: "success",
        });
        fetchProducts();
      } catch (error) {
        console.error("Failed to delete product:", error);
        MySwal.fire({
          title: "Failed!",
          text: "Failed to delete product.",
          icon: "error",
        });
      }
    }
  };

  const filteredProducts = searchTerm
    ? products.filter(
        (product) =>
          product.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.p_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredProducts.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  const handlePrevPage = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const handleNextPage = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

  return (
    <div className="p-4 ">
      <div className="pt-0 pl-5 pr-5 bg-white drop-shadow-[1px_10px_10px_rgba(0,0,0,0.20)] rounded-lg">
        <div className="relative overflow-x-auto l:rounded-lg">
          <div className="flex items-center mt-5 mb-2">
            <button
              onClick={handleAdd}
              className="px-4 py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700"
            >
              Add Material
            </button>
            <div className="relative ml-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8 a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="h-10 py-2 pl-10 pr-3 text-blue-500 border border-blue-400 rounded-lg w-80 focus:ring-blue-500 focus:border-red-500"
                placeholder="Search by Material ID or Material Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="relative overflow-x-auto sm:rounded-lg">
        <table className="w-full text-sm text-left text-blue-100 dark:text-blue-100">
          <thead className="text-xs text-white uppercase bg-green-600 border-b border-blue-400">
              <tr>
                <th scope="col" className="px-6 py-5">
                  Material ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Material Name
                </th>
                <th scope="col" className="px-6 py-3">
                Available Quantity (Kg)
                </th>
                <th scope="col" className="px-6 py-3">
                Unit Price (Rs)
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((product) => (
                <tr
                  key={product.id}
                  className="text-black bg-[#cdf8da] border-b border-[#4bf885] hover:bg-[#a1f0c6]"
                >
                  <td className="px-6 py-3">{product.materialid}</td>
                  <td className="px-6 py-3">{product.materialname}</td>
                  <td className="px-6 py-3">{product.quantity}</td>
                  <td className="px-6 py-3">{product.price}</td>
                  <td className="px-6 py-3">
                    <button
                      className="px-3 py-1 mr-2 font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600"
                      onClick={() => handleEdit(product.id, product)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 font-medium text-white bg-red-600 rounded hover:bg-red-700"
                      onClick={() => handleRemove(product.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <nav
            className="flex items-center justify-between pt-2"
            aria-label="Table navigation"
          >
            <span className="block w-full pl-10 mb-4 text-sm font-normal text-gray-500 dark:text-gray-400 md:mb-0 md:inline md:w-auto">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-black">
                {indexOfFirstRow + 1}-
                {indexOfLastRow > filteredProducts.length
                  ? filteredProducts.length
                  : indexOfLastRow}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-black">
                {filteredProducts.length}
              </span>
            </span>

            <ul className="inline-flex h-10 pr-10 -space-x-px text-sm rtl:space-x-reverse">
              <li>
                <button
                  onClick={handlePrevPage}
                  className="flex items-center justify-center h-8 px-3 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index}>
                  <button
                    onClick={() => setCurrentPage(index + 1)}
                    className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 ${
                      currentPage === index + 1 ? "bg-gray-200" : ""
                    } hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={handleNextPage}
                  className="flex items-center justify-center h-8 px-3 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

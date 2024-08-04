import React, { useState, useEffect } from 'react';
import AddButton from '@components/Commun/Buttons/AddButton';
import deleteW from '@public/assets/Table/deleteW.svg';
import Pagination from '@components/Commun/Pagination';
import DropdownFilter from '../../commun/fliter';
import SearchBar from '@components/Commun/search'; 
import DeleteAllButton from '@components/Commun/Buttons/DeleteAllButton';
import DeleteConfirmation from '@components/Commun/Popups/DeleteAllConfirmation';
import TableHeaderU from '@components/Commun/Units/TabHeaderU'; 
import TableBodyU from '@components/Commun/Units/TabBodyU'; 
import AddUnit from '@components/Commun/Popups/Units/addUnit';
import { fetchUnits, updateUnitById, deleteUnitById } from '@app/utils/apis/units'; 

const TableU = () => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 11;
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [refresh, setRefresh] = useState(false); 
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    fetchUnitData();
    const ws = new WebSocket('ws://localhost:3004'); 

    ws.onmessage = (event) => {
      console.log('Raw WebSocket message:', event.data); 

      // Check if the message is in JSON format
      if (isJson(event.data)) {
        try {
          const message = JSON.parse(event.data);
          if (message.message === 'Unit created' || message.message === 'Unit updated') {
            fetchUnitData();
          } else if (message.message === 'Unit deleted') {
            fetchUnitData();
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      } else {
        console.warn('Received non-JSON WebSocket message:', event.data);
      }
    };

    return () => {
      ws.close();
    };
  }, [refresh]);

  const isJson = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const fetchUnitData = async () => {
    try {
      const units = await fetchUnits();
      setTableData(units);
      filterData(units, searchTerm);
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const filterData = (data, searchTerm) => {
    if (searchTerm) {
      const filtered = data.filter(unit =>
        Object.values(unit).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase()) ||
          (typeof value === 'number' && value.toString().includes(searchTerm))
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleDelete = async (id) => {
    try {
      await deleteUnitById(id);
      setRefresh(!refresh); 
    } catch (error) {
      console.error('Error deleting unit:', error);
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      await updateUnitById(id, updatedData);
      setRefresh(!refresh); 
    } catch (error) {
      console.error('Error updating unit:', error);
    }
  };

  const handleCheckboxChange = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleHeaderCheckboxChange = () => {
    setAllSelected(!allSelected);
    setSelectedRows(allSelected ? [] : tableData.map((row) => row._id));
  };  

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    filterData(tableData, value);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = currentPage * rowsPerPage;
  const filterOptions = ['Option 1', 'Option 2', 'Option 3'];

  const handleDeleteSelected = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      const selectedIds = selectedRows;
      await Promise.all(selectedIds.map(id => deleteUnitById(id)));
      setRefresh(!refresh); 
      setShowDeleteConfirmation(false);
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting selected units:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <div className="container-tab">
      <div className="top-container flex justify-between">
        <div className="top-left-text nunito f30 "></div>
        <div className="top-right-container flex">
          <SearchBar onChange={handleSearchChange} />
          <AddButton text="Add Unit" onClick={toggleForm} />
        </div>
      </div>
      <div className="mt-5 table-container">
        <div className="filters-container flex justify-between">
          <div className="delete-button-container">
            {selectedRows.length > 0 && (
              <DeleteAllButton
                onClick={handleDeleteSelected}
                hovered={hovered}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                buttonText="Delete Selected"
                imageSrc={deleteW}
                altText="delete"
              />
            )}
          </div>
          <div className="">
            <DropdownFilter options={filterOptions} onChange={(option) => console.log('Selected option:', option)} />
          </div>
        </div>
        <table className="table-auto">
          <TableHeaderU handleHeaderCheckboxChange={handleHeaderCheckboxChange} allSelected={allSelected} />
          <TableBodyU
            tableData={filteredData.slice(startIndex, endIndex)}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            selectedRows={selectedRows}
            handleCheckboxChange={handleCheckboxChange}
          />
        </table>
        <div className="pagination-container">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredData.length / rowsPerPage)}
            onPageChange={onPageChange}
          />
        </div>
        {isFormOpen && <AddUnit isOpen={isFormOpen} onClose={toggleForm} onUnitAdded={() => setRefresh(!refresh)} />}
        {isFormOpen && <div className="table-overlay"></div>}
      </div>
      {showDeleteConfirmation && (
        <DeleteConfirmation
          item={deleteItem}
          onConfirmDelete={confirmDelete}
          onCancelDelete={cancelDelete}
        />
      )}
    </div>
  );
};

export default TableU;

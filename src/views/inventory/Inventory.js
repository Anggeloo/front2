import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import {
    CTable, CCol, CRow, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CContainer,
    CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CSpinner,
    CToast, CToastBody, CToastHeader, CToaster, CCard, CCardHeader, CCardBody, CPagination, CPaginationItem
} from "@coreui/react";

import {
    cilTrash,
    cilExternalLink,
    cilPlus
} from '@coreui/icons'

import { useNavigate } from "react-router-dom";

import HistoryService from '../../services/HistoryService';
import InventoryService from '../../services/InventoryService';
import Pagination from '../../components/Pagination';


const Inventory = () => {

    const navigate = useNavigate();

    const [toast, setToast] = useState(null);
    const [list, setList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectData, setSelectedData] = useState(null);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(list.length / itemsPerPage);


    const handleAdd = () => {
        navigate("/inventory/add");
    };

    const handleUpdate = (codice) => {
        navigate(`/inventory/${codice}`);
    };

    const handleDeleteClick = (product) => {
        setSelectedData(product);
        setModalVisible(true);
    };

    const confirmDelete = async () => {
        console.log("Inventory delete:", selectData.inventoryCode);
        try {
            setModalVisible(false);
            setLoading(true)
            await InventoryService.delete(selectData.inventoryCode)
            await HistoryService.add(`delete inventory ${selectData.inventoryCode}`)
            setToast(
                <CToast autohide={3000} visible className="text-dark">
                    <CToastHeader closeButton className="text-white bg-secondary">
                        <strong className="me-auto">Success</strong>
                    </CToastHeader>
                    <CToastBody>
                        Inventory deleted successfully.
                    </CToastBody>
                </CToast>
            );
            await getData()
        } catch (error) {
            console.error(error);
            setToast(
                <CToast autohide={3000} visible className="text-dark">
                    <CToastHeader closeButton className="text-white bg-danger">
                        <strong className="me-auto">Error</strong>
                    </CToastHeader>
                    <CToastBody>
                        We are sorry, an error has occurred, please try again later..
                    </CToastBody>
                </CToast>
            );
        } finally {
            setLoading(false)
        }
    };

    const getData = async () => {
        try {
            setLoading(true)
            const result = await InventoryService.getAll();
            await HistoryService.add('list of all inventories')
            setList(result.data);
        } catch (error) {
            console.error("Failed to fetch products");
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <CContainer>
            {loading ? (
                <div className='spinner-loading'>
                    <CSpinner color="primary" variant="grow" size="lg" />
                </div>
            ) : (
                <>
                    <CCard>
                        <CCardHeader>
                            <CRow className=" align-items-center">
                                <CCol md={6}>
                                    <h3>List Inventory</h3>
                                </CCol>
                                <CCol md={6} className="text-end">
                                    <CButton color="primary" onClick={handleAdd}>
                                        <CIcon icon={cilPlus} />
                                        Add
                                    </CButton>
                                </CCol>
                            </CRow>
                        </CCardHeader>

                        <CCardBody>
                            <CTable hover responsive className='p-2'>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>Inventory Code</CTableHeaderCell>
                                        <CTableHeaderCell>Quantity</CTableHeaderCell>
                                        <CTableHeaderCell>Product Code</CTableHeaderCell>
                                        <CTableHeaderCell>Actions</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {currentItems.map((data, index) => (
                                        <CTableRow key={index}>
                                            <CTableDataCell>{data.inventoryCode}</CTableDataCell>
                                            <CTableDataCell>{data.availableQuantity}</CTableDataCell>
                                            <CTableDataCell>{data.productCode}</CTableDataCell>
                                            <CTableDataCell>
                                                <CButton color="info" variant="outline" size="sm" onClick={() => handleUpdate(data.inventoryCode)} >
                                                    <CIcon icon={cilExternalLink} />
                                                </CButton>
                                                <CButton color="danger" variant="outline" size="sm" className="ms-2" onClick={() => handleDeleteClick(data)}>
                                                    <CIcon icon={cilTrash} />
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        </CCardBody>
                    </CCard>

                    <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                        <CModalHeader>
                            <CModalTitle>Confirm</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            Are you sure you want to delete <strong>{selectData?.inventoryCode}</strong>?
                        </CModalBody>
                        <CModalFooter>
                            <CButton color="secondary" onClick={() => setModalVisible(false)}>Cancel</CButton>
                            <CButton color="danger" onClick={confirmDelete}>Delete</CButton>
                        </CModalFooter>
                    </CModal>
                    <CToaster push={toast} placement="bottom-end" />
                </>
            )}
        </CContainer>

    );
}

export default Inventory

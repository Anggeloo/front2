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
import ProductService from '../../services/ProductService';
import HistoryService from '../../services/HistoryService';
import Pagination from '../../components/Pagination';
import TeamPerformanceService from '../../services/TeamPerformanceService';
import RawMaterialManagementService from '../../services/RawMaterialManagementService';


const RawMaterialManagement = () => {

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


    const handleAddMaterial = () => {
        navigate("/rawMaterialManagement/add");
    };

    const handleUpdateMaterial = (codice) => {
        navigate(`/rawMaterialManagement/${codice}`);
    };

    const handleDeleteClick = (product) => {
        setSelectedData(product);
        setModalVisible(true);
    };

    const confirmDelete = async () => {
        console.log("Raw material management delete:", selectData.materialCode);
        try {
            setModalVisible(false);
            setLoading(true)
            await RawMaterialManagementService.delete(selectData.materialCode)
            await HistoryService.add(`delete raw material management ${selectData.materialCode}`)
            setToast(
                <CToast autohide={3000} visible className="text-dark">
                    <CToastHeader closeButton className="text-white bg-secondary">
                        <strong className="me-auto">Success</strong>
                    </CToastHeader>
                    <CToastBody>
                        Raw material management deleted successfully.
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
            const result = await RawMaterialManagementService.getAll();
            await HistoryService.add('list raw material management')
            setList(result.data);
        } catch (error) {
            console.error("Failed to fetch");
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
                                    <h3>List raw material management</h3>
                                </CCol>
                                <CCol md={6} className="text-end">
                                    <CButton color="primary" onClick={handleAddMaterial}>
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
                                        <CTableHeaderCell>Material Code</CTableHeaderCell>
                                        <CTableHeaderCell>Inventory Code</CTableHeaderCell>
                                        <CTableHeaderCell>Material Name</CTableHeaderCell>
                                        <CTableHeaderCell>Available Quantity</CTableHeaderCell>
                                        <CTableHeaderCell>Total Used Cost</CTableHeaderCell>
                                        <CTableHeaderCell>Quantity</CTableHeaderCell>
                                        <CTableHeaderCell>Actions</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {currentItems.map((data, index) => (
                                        <CTableRow key={index}>
                                            <CTableDataCell>{data.materialCode}</CTableDataCell>
                                            <CTableDataCell>{data.inventoryCode}</CTableDataCell>
                                            <CTableDataCell>{data.materialName}</CTableDataCell>
                                            <CTableDataCell>{data.availableQuantity}</CTableDataCell>
                                            <CTableDataCell>{data.totalUsedCost}</CTableDataCell>
                                            <CTableDataCell>{data.usedQuantity}</CTableDataCell>
                                            <CTableDataCell>
                                                <CButton color="info" variant="outline" size="sm" onClick={() => handleUpdateMaterial(data.materialCode)} >
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
                            Are you sure you want to delete <strong>{selectData?.materialName}</strong>?
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

export default RawMaterialManagement

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


const TeamPerformance = () => {

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


    const handleAddTeamPerformance = () => {
        navigate("/teamPerformance/add");
    };

    const handleUpdateTeamPerformance = (codice) => {
        navigate(`/teamPerformance/${codice}`);
    };

    const handleDeleteClick = (product) => {
        setSelectedData(product);
        setModalVisible(true);
    };

    const confirmDelete = async () => {
        console.log("Team Performance delete:", selectData.teamPerformanceCode);
        try {
            setModalVisible(false);
            setLoading(true)
            await TeamPerformanceService.delete(selectData.teamPerformanceCode)
            await HistoryService.add(`delete team performance ${selectData.teamPerformanceCode}`)
            setToast(
                <CToast autohide={3000} visible className="text-dark">
                    <CToastHeader closeButton className="text-white bg-secondary">
                        <strong className="me-auto">Success</strong>
                    </CToastHeader>
                    <CToastBody>
                        Team performance deleted successfully.
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
            const result = await TeamPerformanceService.getAll();
            await HistoryService.add('list of all team performance')
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
                                    <h3>List of team performance</h3>
                                </CCol>
                                <CCol md={6} className="text-end">
                                    <CButton color="primary" onClick={handleAddTeamPerformance}>
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
                                        <CTableHeaderCell>Performance Code</CTableHeaderCell>
                                        {/* <CTableHeaderCell>Team Code</CTableHeaderCell> */}
                                        <CTableHeaderCell>Team Name</CTableHeaderCell>
                                        <CTableHeaderCell>Completed Orders</CTableHeaderCell>
                                        <CTableHeaderCell>Pending Orders</CTableHeaderCell>
                                        <CTableHeaderCell>Avg Completion Time</CTableHeaderCell>
                                        <CTableHeaderCell>Avg Quality</CTableHeaderCell>
                                        <CTableHeaderCell>Efficiency</CTableHeaderCell>
                                        <CTableHeaderCell>Actions</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {currentItems.map((data, index) => (
                                        <CTableRow key={index}>
                                            <CTableDataCell>{data.teamPerformanceCode}</CTableDataCell>
                                            {/* <CTableDataCell>{data.teamCode}</CTableDataCell> */}
                                            <CTableDataCell>{data.teamName}</CTableDataCell>
                                            <CTableDataCell>{data.completedOrders}</CTableDataCell>
                                            <CTableDataCell>{data.pendingOrders}</CTableDataCell>
                                            <CTableDataCell>{data.avgCompletionTime}</CTableDataCell>
                                            <CTableDataCell>{data.avgQuality}</CTableDataCell>
                                            <CTableDataCell>{data.efficiency}</CTableDataCell>
                                            <CTableDataCell>
                                                <CButton color="info" variant="outline" size="sm" onClick={() => handleUpdateTeamPerformance(data.teamPerformanceCode)} >
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
                            Are you sure you want to delete <strong>{selectData?.name}</strong>?
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

export default TeamPerformance

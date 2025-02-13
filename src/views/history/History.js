import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import {
    CTable, CCol, CRow, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CContainer,
    CSpinner, CCard, CCardHeader, CCardBody, CPagination, CPaginationItem
} from "@coreui/react";

import HistoryService from '../../services/HistoryService';
import Pagination from '../../components/Pagination';

const History = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const getAll = async () => {
        try {
            setLoading(true);
            const result = await HistoryService.getAll();
            setList(result.data);
        } catch (error) {
            console.error("Failed to fetch history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAll();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(list.length / itemsPerPage);

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
                            <CRow className="align-items-center">
                                <CCol md={6}>
                                    <h3>User Activity History</h3>
                                </CCol>
                            </CRow>
                        </CCardHeader>

                        <CCardBody>
                            <CTable hover responsive className='p-2'>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>User</CTableHeaderCell>
                                        <CTableHeaderCell>Activity</CTableHeaderCell>
                                        <CTableHeaderCell>Date</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {currentItems.map((x, index) => (
                                        <CTableRow key={index}>
                                            <CTableDataCell>{x.user_code}</CTableDataCell>
                                            <CTableDataCell>{x.history_action}</CTableDataCell>
                                            <CTableDataCell>
                                                {new Date(Number(x.created_at)).toLocaleString('en-US', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                    hour12: false
                                                })}
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>

                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

                        </CCardBody>
                    </CCard>
                </>
            )}
        </CContainer>
    );
}

export default History;

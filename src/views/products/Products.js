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


const Products = () => {

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


    const handleAddProduct = () => {
        navigate("/products/add");
    };

    const handleUpdateProduct = (codice) => {
        navigate(`/products/${codice}`);
    };

    const handleDeleteClick = (product) => {
        setSelectedData(product);
        setModalVisible(true);
    };

    const confirmDelete = async () => {
        console.log("Product delete:", selectData.product_code);
        try {
            setModalVisible(false);
            setLoading(true)
            await ProductService.delete(selectData.product_code)
            await HistoryService.add(`delete product ${selectData.product_code}`)
            setToast(
                <CToast autohide={3000} visible className="text-dark">
                    <CToastHeader closeButton className="text-white bg-secondary">
                        <strong className="me-auto">Success</strong>
                    </CToastHeader>
                    <CToastBody>
                        Product deleted successfully.
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
            const result = await ProductService.getAll();
            await HistoryService.add('list of all products')
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
                                    <h3>List of products</h3>
                                </CCol>
                                <CCol md={6} className="text-end">
                                    <CButton color="primary" onClick={handleAddProduct}>
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
                                        <CTableHeaderCell>Code</CTableHeaderCell>
                                        <CTableHeaderCell>Name</CTableHeaderCell>
                                        <CTableHeaderCell>Category</CTableHeaderCell>
                                        <CTableHeaderCell>Material</CTableHeaderCell>
                                        <CTableHeaderCell>Color</CTableHeaderCell>
                                        <CTableHeaderCell>Price</CTableHeaderCell>
                                        <CTableHeaderCell>Actions</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {currentItems.map((product, index) => (
                                        <CTableRow key={index}>
                                            <CTableDataCell>{product.product_code}</CTableDataCell>
                                            <CTableDataCell>{product.name}</CTableDataCell>
                                            <CTableDataCell>{product.category}</CTableDataCell>
                                            <CTableDataCell>{product.material}</CTableDataCell>
                                            <CTableDataCell>{product.color}</CTableDataCell>
                                            <CTableDataCell>${product.price}</CTableDataCell>
                                            <CTableDataCell>
                                                <CButton color="info" variant="outline" size="sm" onClick={() => handleUpdateProduct(product.product_code)} >
                                                    <CIcon icon={cilExternalLink} />
                                                </CButton>
                                                <CButton color="danger" variant="outline" size="sm" className="ms-2" onClick={() => handleDeleteClick(product)}>
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

export default Products

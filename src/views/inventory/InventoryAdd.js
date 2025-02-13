import React, { useEffect, useState } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CRow,
    CContainer,
    CToast, CToastBody, CToastHeader, CToaster, CSpinner
} from '@coreui/react'
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { setTimeout } from 'core-js';
import HistoryService from '../../services/HistoryService';
import InventoryService from '../../services/InventoryService';
import ProductService from '../../services/ProductService';

const InventoryAdd = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [productList, setProductList] = useState([]);

    const defaultValues = {
        product_code: "",
        availableQuantity: "",
        status: true,
    };

    const handleGoInventory = () => {
        navigate("/inventory");
    };

    const handleFormSubmit = async (data) => {
        try {
            console.log("Form Data:", data);
            setLoading(true)
            await InventoryService.add(data)
            await HistoryService.add(`add inventory ${data.name}`)
            setToast(
                <CToast autohide={3000} visible className="text-dark">
                    <CToastHeader closeButton className="text-white bg-secondary">
                        <strong className="me-auto">Success</strong>
                    </CToastHeader>
                    <CToastBody>
                        Inventory create successfully.
                    </CToastBody>
                </CToast>
            );
            setTimeout(() => {
                handleGoInventory()
            }, 1000);
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

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues,
    });

    const getDataProducts = async () => {
        try {
            setLoading(true)
            const result = await ProductService.getAll();
            setProductList(result.data);
        } catch (error) {
            console.error("Failed to fetch products");
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getDataProducts();
    }, []);

    return (
        <CContainer>
            {loading ? (
                <div className='spinner-loading'>
                    <CSpinner color="primary" variant="grow" size="lg" />
                </div>
            ) : (
                <>
                    <CRow>
                        <CCol xs={12}>
                            <CCard className="mb-4">
                                <CCardHeader>
                                    <strong>Add Inventory</strong>
                                </CCardHeader>
                                <CCardBody>
                                    <CForm onSubmit={handleSubmit(handleFormSubmit)}>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Product</CFormLabel>
                                            <CFormSelect {...register("productCode", { required: "Product is required" })}>
                                                <option value="">Select a product</option>
                                                {productList.map((product) => (
                                                    <option key={product.id} value={product.product_code}>
                                                        {product.name}
                                                    </option>
                                                ))}
                                            </CFormSelect>
                                            {errors.productCode && <span className="text-danger">{errors.productCode.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Quantity</CFormLabel>
                                            <CFormInput type="number" step="0" {...register("availableQuantity", { required: "Quantity is required" })} />
                                            {errors.availableQuantity && <span className="text-danger">{errors.availableQuantity.message}</span>}
                                        </div>

                                        <CButton type="submit" color="dark" style={{ float: 'right' }} >Save</CButton>
                                        <CButton color="warning" style={{ float: 'right', marginRight: 10 }} onClick={handleGoInventory} >Cancel</CButton>
                                    </CForm>

                                </CCardBody>

                            </CCard>
                        </CCol>
                    </CRow>
                </>
            )}
            <CToaster push={toast} placement="bottom-end" />
        </CContainer>
    )
}

export default InventoryAdd

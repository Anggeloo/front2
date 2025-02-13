import React, { useState } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CRow,
    CContainer,
    CToast, CToastBody, CToastHeader, CToaster, CSpinner
} from '@coreui/react'
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { setTimeout } from 'core-js';
import ProductService from '../../services/ProductService';
import HistoryService from '../../services/HistoryService';

const ProductAdd = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const defaultValues = {
        name: "",
        description: "",
        category: "",
        material: "",
        color: "",
        price: "",
        status: true,
    };

    const handleGoProduct = () => {
        navigate("/products");
    };

    const handleFormSubmit = async (data) => {
        try {
            console.log("Form Data:", data);
            setLoading(true)
            await ProductService.add(data)
            await HistoryService.add(`add product ${data.name}`)
            setToast(
                <CToast autohide={3000} visible className="text-dark">
                    <CToastHeader closeButton className="text-white bg-secondary">
                        <strong className="me-auto">Success</strong>
                    </CToastHeader>
                    <CToastBody>
                        Product create successfully.
                    </CToastBody>
                </CToast>
            );
            setTimeout(() => {     
                handleGoProduct()
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
        }finally{
            setLoading(false)
        }
    };

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues,
    });

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
                                    <strong>Add Product</strong>
                                </CCardHeader>
                                <CCardBody>
                                    <CForm onSubmit={handleSubmit(handleFormSubmit)}>
                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Name</CFormLabel>
                                            <CFormInput {...register("name", { required: "Name is required" })} />
                                            {errors.name && <span className="text-danger">{errors.name.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Description</CFormLabel>
                                            <CFormInput {...register("description", { required: "Description is required" })} />
                                            {errors.description && <span className="text-danger">{errors.description.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Category</CFormLabel>
                                            <CFormInput {...register("category", { required: "Category is required" })} />
                                            {errors.category && <span className="text-danger">{errors.category.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Material</CFormLabel>
                                            <CFormInput {...register("material", { required: "Material is required" })} />
                                            {errors.material && <span className="text-danger">{errors.material.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Color</CFormLabel>
                                            <CFormInput {...register("color", { required: "Color is required" })} />
                                            {errors.color && <span className="text-danger">{errors.color.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Price</CFormLabel>
                                            <CFormInput type="number" step="0.01" {...register("price", { required: "Price is required" })} />
                                            {errors.price && <span className="text-danger">{errors.price.message}</span>}
                                        </div>

                                        <CButton type="submit" color="dark" style={{ float: 'right' }} >Save</CButton>
                                        <CButton color="warning" style={{ float: 'right', marginRight: 10 }} onClick={handleGoProduct} >Cancel</CButton>
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

export default ProductAdd

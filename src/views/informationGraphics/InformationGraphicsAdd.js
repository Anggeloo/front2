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
import InformationGraphicsService from '../../services/InformationGraphicsService';

const InformationGraphicsAdd = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));

    const defaultValues = {
        graphicCode: 'string',
        title: "",
        graphicType: "",
        description: "",
        userCreatedBy: user?.userCode
    };

    const handleGoGraphics = () => {
        navigate("/informationGraphics");
    };

    const handleFormSubmit = async (data) => {
        try {
            console.log("Form Data:", data);
            setLoading(true)
            await InformationGraphicsService.add(data)
            await HistoryService.add(`add information graphics ${data.summaryCode}`)
            setToast(
                <CToast autohide={3000} visible className="text-dark">
                    <CToastHeader closeButton className="text-white bg-secondary">
                        <strong className="me-auto">Success</strong>
                    </CToastHeader>
                    <CToastBody>
                        Information graphics create successfully.
                    </CToastBody>
                </CToast>
            );
            setTimeout(() => {
                handleGoGraphics()
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
                                    <strong>Add Information Graphics</strong>
                                </CCardHeader>
                                <CCardBody>
                                    <CForm onSubmit={handleSubmit(handleFormSubmit)}>
                               
                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Title</CFormLabel>
                                            <CFormInput {...register("title", { required: "Title is required" })} />
                                            {errors.title && <span className="text-danger">{errors.title.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Graphic Type</CFormLabel>
                                            <CFormInput {...register("graphicType", { required: "Graphic Type is required" })} />
                                            {errors.graphicType && <span className="text-danger">{errors.graphicType.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Description</CFormLabel>
                                            <CFormInput {...register("description", { required: "Description is required" })} />
                                            {errors.description && <span className="text-danger">{errors.description.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">User Created By</CFormLabel>
                                            <CFormInput {...register("userCreatedBy", { required: "User Created By is required" })}  disabled/>
                                            {errors.userCreatedBy && <span className="text-danger">{errors.userCreatedBy.message}</span>}
                                        </div>
                                     
                                        <CButton type="submit" color="dark" style={{ float: 'right' }} >Save</CButton>
                                        <CButton color="warning" style={{ float: 'right', marginRight: 10 }} onClick={handleGoGraphics} >Cancel</CButton>
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

export default InformationGraphicsAdd

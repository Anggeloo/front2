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
import ProductService from '../../services/ProductService';
import { useParams } from 'react-router-dom';
import HistoryService from '../../services/HistoryService';
import TeamPerformanceService from '../../services/TeamPerformanceService';
import WorkTeamService from '../../services/WorkTeamService';
import InventoryService from '../../services/InventoryService';
import RawMaterialManagementService from '../../services/RawMaterialManagementService';

const RawMaterialManagementUpdate = () => {

    const navigate = useNavigate();
    const { codice } = useParams();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const [inventoryList, setInventoryList] = useState([]);

    const defaultValues = {
        materialCode: 'string',
        inventoryCode: "",
        materialName: "",
        availableQuantity: "",
        totalUsedCost: "",
        usedQuantity: "",
        status: true,
    };

    const handleGoRawMaterial = () => {
        navigate("/rawMaterialManagement");
    };

    const handleFormSubmit = async (data) => {
        try {
            console.log("Form Data:", data);
            setLoading(true)
            await RawMaterialManagementService.update(codice, data)
            await HistoryService.add(`update raw material ${codice}`)
            setToast(
                <CToast autohide={3000} visible className="text-dark">
                    <CToastHeader closeButton className="text-white bg-secondary">
                        <strong className="me-auto">Success</strong>
                    </CToastHeader>
                    <CToastBody>
                        Raw material modified successfully.
                    </CToastBody>
                </CToast>
            );
            setTimeout(() => {
                handleGoRawMaterial()
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

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues,
    });

    const getByCodice = async () => {
        try {
            setLoading(true);
            const list = await InventoryService.getAll();
            setInventoryList(list.data);
            const result = await RawMaterialManagementService.getByCode(codice);
            if (result) {
                reset(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (codice) {
            getByCodice();
        }
    }, [codice]);

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
                                    <strong>Update Raw Material Management</strong>
                                </CCardHeader>
                                <CCardBody>
                                    <CForm onSubmit={handleSubmit(handleFormSubmit)}>
                                        
                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Inventory</CFormLabel>
                                            <CFormSelect {...register("inventoryCode", { required: "Inventory is required" })}>
                                                <option value="">Select a inventory</option>
                                                {inventoryList.map((x) => (
                                                    <option key={x.inventoryId} value={x.inventoryCode}>
                                                        {x.inventoryCode}
                                                    </option>
                                                ))}
                                            </CFormSelect>
                                            {errors.inventoryCode && <span className="text-danger">{errors.inventoryCode.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Material Name</CFormLabel>
                                            <CFormInput {...register("materialName", { required: "Team name is required" })} />
                                            {errors.materialName && <span className="text-danger">{errors.materialName.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Available Quantity</CFormLabel>
                                            <CFormInput type="number" step="0" {...register("availableQuantity", { required: "Available quantity is required" })} />
                                            {errors.availableQuantity && <span className="text-danger">{errors.availableQuantity.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Total Used Cost</CFormLabel>
                                            <CFormInput type="number" step="0.01" {...register("totalUsedCost", { required: "Total used cost is required" })} />
                                            {errors.totalUsedCost && <span className="text-danger">{errors.totalUsedCost.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Used Quantity</CFormLabel>
                                            <CFormInput type="number" step="0" {...register("usedQuantity", { required: "Used Quantity is required" })} />
                                            {errors.usedQuantity && <span className="text-danger">{errors.usedQuantity.message}</span>}
                                        </div>

                                        <CButton type="submit" color="dark" style={{ float: 'right' }} >Save</CButton>
                                        <CButton color="warning" style={{ float: 'right', marginRight: 10 }} onClick={handleGoRawMaterial} >Cancel</CButton>
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

export default RawMaterialManagementUpdate

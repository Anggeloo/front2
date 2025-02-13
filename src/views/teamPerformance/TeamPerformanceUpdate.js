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

const TeamPerformanceUpdate = () => {

    const navigate = useNavigate();
    const { codice } = useParams();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const [workTeamList, setWorkTeam] = useState([]);

    const defaultValues = {
        teamPerformanceCode: 'string',
        teamCode: "",
        teamName: "",
        completedOrders: "",
        pendingOrders: "",
        avgCompletionTime: "",
        avgQuality: "",
        efficiency: "",
        status: true,
    };

    const handleGoTeamPerformance = () => {
        navigate("/teamPerformance");
    };

    const handleFormSubmit = async (data) => {
        try {
            console.log("Form Data:", data);
            setLoading(true)
            await TeamPerformanceService.update(codice, data)
            await HistoryService.add(`update team performance ${codice}`)
            setToast(
                <CToast autohide={3000} visible className="text-dark">
                    <CToastHeader closeButton className="text-white bg-secondary">
                        <strong className="me-auto">Success</strong>
                    </CToastHeader>
                    <CToastBody>
                        Team performance modified successfully.
                    </CToastBody>
                </CToast>
            );
            setTimeout(() => {
                handleGoTeamPerformance()
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
            const resultWork = await WorkTeamService.getAll();
            setWorkTeam(resultWork.data);
            const result = await TeamPerformanceService.getByCode(codice);
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
                                    <strong>Update Team Performance</strong>
                                </CCardHeader>
                                <CCardBody>
                                    <CForm onSubmit={handleSubmit(handleFormSubmit)}>
                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Work Team</CFormLabel>
                                            <CFormSelect {...register("teamCode", { required: "Work Team is required" })}>
                                                <option value="">Select a work team</option>
                                                {workTeamList.map((x) => (
                                                    <option key={x.work_team_id} value={x.team_code}>
                                                        {x.team_name}
                                                    </option>
                                                ))}
                                            </CFormSelect>
                                            {errors.teamCode && <span className="text-danger">{errors.teamCode.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Team Name</CFormLabel>
                                            <CFormInput {...register("teamName", { required: "Team name is required" })} />
                                            {errors.teamName && <span className="text-danger">{errors.teamName.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Completed Orders</CFormLabel>
                                            <CFormInput type="number" step="0" {...register("completedOrders", { required: "Completed orders is required" })} />
                                            {errors.completedOrders && <span className="text-danger">{errors.completedOrders.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Pending  Orders</CFormLabel>
                                            <CFormInput type="number" step="0" {...register("pendingOrders", { required: "Pending Orders is required" })} />
                                            {errors.pendingOrders && <span className="text-danger">{errors.pendingOrders.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Avg Completion Time</CFormLabel>
                                            <CFormInput type="number" step="0.01" {...register("avgCompletionTime", { required: "Avg completion time is required" })} />
                                            {errors.avgCompletionTime && <span className="text-danger">{errors.avgCompletionTime.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Avg Quality</CFormLabel>
                                            <CFormInput type="number" step="0.01" {...register("avgQuality", { required: "Avg quality is required" })} />
                                            {errors.avgQuality && <span className="text-danger">{errors.avgQuality.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Efficiency</CFormLabel>
                                            <CFormInput type="number" step="0.01" {...register("efficiency", { required: "Efficiency is required" })} />
                                            {errors.efficiency && <span className="text-danger">{errors.efficiency.message}</span>}
                                        </div>
                                        <CButton type="submit" color="dark" style={{ float: 'right' }} >Save</CButton>
                                        <CButton color="warning" style={{ float: 'right', marginRight: 10 }} onClick={handleGoTeamPerformance} >Cancel</CButton>
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

export default TeamPerformanceUpdate

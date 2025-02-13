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
import { useParams } from 'react-router-dom';
import HistoryService from '../../services/HistoryService';
import MonthlySummaryService from '../../services/MonthlySummary';

const MonthlySummaryUpdate = () => {

    const navigate = useNavigate();
    const { codice } = useParams();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const defaultValues = {
        summaryCode: 'string',
        month: "",
        totalCompletedOrders: "",
        totalSales: "",
        bestTeam: "",
        averagePerformance: "",
        recentIssues: "",
        generatedAt: "",
        additionalNotes: "",
        status: true,
    };

    const handleGoSummary = () => {
        navigate("/monthlySummary");
    };

    const handleFormSubmit = async (data) => {
        try {
            console.log("Form Data:", data);
            setLoading(true)
            await MonthlySummaryService.update(codice, data)
            await HistoryService.add(`update monthly summary ${codice}`)
            setToast(
                <CToast autohide={3000} visible className="text-dark">
                    <CToastHeader closeButton className="text-white bg-secondary">
                        <strong className="me-auto">Success</strong>
                    </CToastHeader>
                    <CToastBody>
                        Monthly summary modified successfully.
                    </CToastBody>
                </CToast>
            );
            setTimeout(() => {
                handleGoSummary()
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
            const result = await MonthlySummaryService.getByCode(codice);
            if (result && result.data) {
                const formattedData = {
                    ...result.data,
                    generatedAt: result.data.generatedAt.split("T")[0]
                };
                reset(formattedData);
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
                                    <strong>Update Monthly Summary</strong>
                                </CCardHeader>
                                <CCardBody>
                                    <CForm onSubmit={handleSubmit(handleFormSubmit)}>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Month</CFormLabel>
                                            <CFormSelect {...register("month", { required: "Month is required" })}>
                                                <option value="">Select a month</option>
                                                <option value="January">January</option>
                                                <option value="February">February</option>
                                                <option value="March">March</option>
                                                <option value="April">April</option>
                                                <option value="May">May</option>
                                                <option value="June">June</option>
                                                <option value="July">July</option>
                                                <option value="August">August</option>
                                                <option value="September">September</option>
                                                <option value="October">October</option>
                                                <option value="November">November</option>
                                                <option value="December">December</option>
                                            </CFormSelect>
                                            {errors.month && <span className="text-danger">{errors.month.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Best Team</CFormLabel>
                                            <CFormInput {...register("bestTeam", { required: "Best team is required" })} />
                                            {errors.bestTeam && <span className="text-danger">{errors.bestTeam.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Average Performance</CFormLabel>
                                            <CFormInput type="number" step="0.01" {...register("averagePerformance", { required: "Average Performance is required" })} />
                                            {errors.averagePerformance && <span className="text-danger">{errors.averagePerformance.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Generated At</CFormLabel>
                                            <CFormInput type="date"  {...register("generatedAt", { required: "Generated At is required" })} />
                                            {errors.generatedAt && <span className="text-danger">{errors.generatedAt.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Total Completed Orders</CFormLabel>
                                            <CFormInput type="number" step="0.01" {...register("totalCompletedOrders", { required: "Total completed Orders is required" })} />
                                            {errors.totalCompletedOrders && <span className="text-danger">{errors.totalCompletedOrders.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Total Sales</CFormLabel>
                                            <CFormInput type="number" step="0.01" {...register("totalSales", { required: "Total sales is required" })} />
                                            {errors.totalSales && <span className="text-danger">{errors.totalSales.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Recent Issues</CFormLabel>
                                            <CFormInput {...register("recentIssues", { required: "Recent Issues is required" })} />
                                            {errors.recentIssues && <span className="text-danger">{errors.recentIssues.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Additional Notes</CFormLabel>
                                            <CFormInput {...register("additionalNotes", { required: "Additional Notes is required" })} />
                                            {errors.additionalNotes && <span className="text-danger">{errors.additionalNotes.message}</span>}
                                        </div>

                                        <CButton type="submit" color="dark" style={{ float: 'right' }} >Save</CButton>
                                        <CButton color="warning" style={{ float: 'right', marginRight: 10 }} onClick={handleGoSummary} >Cancel</CButton>
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

export default MonthlySummaryUpdate

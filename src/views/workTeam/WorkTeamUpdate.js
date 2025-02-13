import React, { useEffect, useState } from 'react';
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
} from '@coreui/react';
import CIcon from '@coreui/icons-react'
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import { setTimeout } from 'core-js';
import WorkTeamService from '../../services/WorkTeamService';
import HistoryService from '../../services/HistoryService';

import {
    cilTrash,
} from '@coreui/icons'


const WorkTeamUpdate = () => {
    const navigate = useNavigate();
    const { codice } = useParams();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
        defaultValues: {
            team_name: "",
            description: "",
            members: [],
            status: true,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "members",
    });

    const handleGoWorkTeam = () => {
        navigate("/workTeam");
    };

    const handleFormSubmit = async (data) => {
        try {
            console.log("Form Data:", data);
            setLoading(true);
            await WorkTeamService.update(codice, data);
            await HistoryService.add(`Updated work team ${codice}`);

            setToast(
                <CToast autohide={3000} visible className="text-dark">
                    <CToastHeader closeButton className="text-white bg-secondary">
                        <strong className="me-auto">Success</strong>
                    </CToastHeader>
                    <CToastBody>
                        Work team updated successfully.
                    </CToastBody>
                </CToast>
            );

            setTimeout(() => {
                handleGoWorkTeam();
            }, 1000);

        } catch (error) {
            console.error(error);
            setToast(
                <CToast autohide={3000} visible className="text-dark">
                    <CToastHeader closeButton className="text-white bg-danger">
                        <strong className="me-auto">Error</strong>
                    </CToastHeader>
                    <CToastBody>
                        We are sorry, an error has occurred. Please try again later.
                    </CToastBody>
                </CToast>
            );
        } finally {
            setLoading(false);
        }
    };

    const getByCodice = async () => {
        try {
            setLoading(true);
            const result = await WorkTeamService.getByCode(codice);
            if (result && result.data) {
                reset(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch work team", error);
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
                <CRow>
                    <CCol xs={12}>
                        <CCard className="mb-4">
                            <CCardHeader>
                                <strong>Update Work Team</strong>
                            </CCardHeader>
                            <CCardBody>
                                <CForm onSubmit={handleSubmit(handleFormSubmit)}>
                                    <div className="mb-3">
                                        <CFormLabel className="fw-bold">Name</CFormLabel>
                                        <CFormInput {...register("team_name", { required: "Name is required" })} />
                                        {errors.team_name && <span className="text-danger">{errors.team_name.message}</span>}
                                    </div>

                                    <div className="mb-3">
                                        <CFormLabel className="fw-bold">Description</CFormLabel>
                                        <CFormInput {...register("description", { required: "Description is required" })} />
                                        {errors.description && <span className="text-danger">{errors.description.message}</span>}
                                    </div>

                                    <div className="mb-3">
                                        <CFormLabel className="fw-bold">Members</CFormLabel>
                                        {fields.map((member, index) => (
                                            <div key={member.id} className="d-flex mb-2">
                                                <CFormInput {...register(`members.${index}`, { required: "Member name is required" })} />
                                                <CButton color="danger" variant="outline" size="sm" className="ms-2" onClick={() => remove(index)}>
                                                    <CIcon icon={cilTrash} />
                                                </CButton>
                                            </div>
                                        ))}
                                        <CButton color="dark" onClick={() => append('')}>Add Member</CButton>
                                    </div>

                                    <CButton type="submit" color="dark" style={{ float: 'right' }}>Save</CButton>
                                    <CButton color="warning" style={{ float: 'right', marginRight: 10 }} onClick={handleGoWorkTeam}>Cancel</CButton>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            )}
            <CToaster push={toast} placement="bottom-end" />
        </CContainer>
    );
};

export default WorkTeamUpdate;

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
import CIcon from '@coreui/icons-react'
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { setTimeout } from 'core-js';
import HistoryService from '../../services/HistoryService';
import WorkTeamService from '../../services/WorkTeamService';

import {
    cilTrash,
} from '@coreui/icons'

const WorkTeamAdd = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [members, setMembers] = useState([""]); 

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            team_name: "",
            description: "",
            members: [],
            status: true,
        },
    });

    const handleGoWorkTeam = () => {
        navigate("/workTeam");
    };

    const handleFormSubmit = async (data) => {
        try {
            setLoading(true);
            data.members = members;

            console.log("Form Data:", data);
            await WorkTeamService.add(data);
            await HistoryService.add(`add work team ${data.team_name}`);

            setToast(
                <CToast autohide={3000} visible className="text-dark">
                    <CToastHeader closeButton className="text-white bg-secondary">
                        <strong className="me-auto">Success</strong>
                    </CToastHeader>
                    <CToastBody>
                        Work team created successfully.
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

    const addMember = () => {
        setMembers([...members, ""]);
    };

    const removeMember = (index) => {
        const newMembers = members.filter((_, i) => i !== index);
        setMembers(newMembers);
        setValue("members", newMembers);
    };

    const handleMemberChange = (index, value) => {
        const updatedMembers = [...members];
        updatedMembers[index] = value;
        setMembers(updatedMembers);
        setValue("members", updatedMembers); 
    };

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
                                    <strong>Add Work Team</strong>
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
                                            {members.map((member, index) => (
                                                <div key={index} className="d-flex align-items-center mb-2">
                                                    <CFormInput
                                                        {...register(`members.${index}`, { required: "Member is required" })}
                                                        value={member}
                                                        onChange={(e) => handleMemberChange(index, e.target.value)}
                                                    />
                                                    <CButton color="danger" variant="outline" size="sm" className="ms-2" onClick={() => removeMember(index)} disabled={members.length === 1}>
                                                        <CIcon icon={cilTrash} />
                                                    </CButton>
                                                </div>
                                            ))}
                                            <CButton color="dark" onClick={addMember}>+ Add Member</CButton>
                                        </div>

                                        <CButton type="submit" color="dark" style={{ float: 'right' }}>Save</CButton>
                                        <CButton color="warning" style={{ float: 'right', marginRight: 10 }} onClick={handleGoWorkTeam}>Cancel</CButton>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </>
            )}
            <CToaster push={toast} placement="bottom-end" />
        </CContainer>
    );
}

export default WorkTeamAdd;

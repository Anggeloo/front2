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
import OrderService from '../../services/OrderService';
import WorkTeamService from '../../services/WorkTeamService';

const OrdersUpdate = () => {

    const navigate = useNavigate();
    const { codice } = useParams();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const [productList, setProductList] = useState([]);
    const [workTeamList, setWorkTeam] = useState([]);

    const defaultValues = {
        orderCode: "",
        teamCode: "",
        productCode: "",
        description: "",
        quantity: "",
        priority: "",
        orderStatus: "",
        assignmentDate: "",
        completionDate: "",
        notes: "",
        status: true,
    };

    const handleGoOrder = () => {
        navigate("/order");
    };

    const handleFormSubmit = async (data) => {
        try {
            console.log("Form Data:", data);
            setLoading(true)
            await OrderService.update(codice, data)
            await HistoryService.add(`update order ${codice}`)
            setToast(
                <CToast autohide={3000} visible className="text-dark">
                    <CToastHeader closeButton className="text-white bg-secondary">
                        <strong className="me-auto">Success</strong>
                    </CToastHeader>
                    <CToastBody>
                        Order modified successfully.
                    </CToastBody>
                </CToast>
            );
            setTimeout(() => {
                handleGoOrder()
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
            await getData()
            const result = await OrderService.getByCode(codice);
            if (result && result.data) {
                const formattedData = {
                    ...result.data,
                    assignmentDate: result.data.assignmentDate.split("T")[0],
                    completionDate: result.data.completionDate.split("T")[0]
                };
                reset(formattedData);
            }
        } catch (error) {
            console.error("Failed to fetch ", error);
        } finally {
            setLoading(false);
        }
    };

    const getData = async () => {
        try {
            const result = await ProductService.getAll();
            const resultWork = await WorkTeamService.getAll();
            setProductList(result.data);
            setWorkTeam(resultWork.data);
        } catch (error) {
            console.error(error);
        }
    }


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
                                    <strong>Update Order</strong>
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
                                            <CFormLabel className="fw-bold">Description</CFormLabel>
                                            <CFormInput {...register("description", { required: "Description is required" })} />
                                            {errors.description && <span className="text-danger">{errors.description.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Quantity</CFormLabel>
                                            <CFormInput type="number" step="0" {...register("quantity", { required: "Quantity is required" })} />
                                            {errors.quantity && <span className="text-danger">{errors.quantity.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Priority</CFormLabel>
                                            <CFormSelect {...register("priority", { required: "Priority is required" })}>
                                                <option value="">Select a priority</option>
                                                <option value='Low'>Low</option>
                                                <option value='Medium'>Medium</option>
                                                <option value='High'>High</option>
                                            </CFormSelect>
                                            {errors.priority && <span className="text-danger">{errors.priority.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Order Status</CFormLabel>
                                            <CFormSelect {...register("orderStatus", { required: "Status is required" })}>
                                                <option value="">Select the order status</option>
                                                <option value='Pending'>Pending</option>
                                                <option value='Progress'>In Progress</option>
                                                <option value='Canceled'>canceled</option>
                                                <option value='Completed'>Completed</option>
                                            </CFormSelect>
                                            {errors.orderStatus && <span className="text-danger">{errors.orderStatus.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Assignment Date</CFormLabel>
                                            <CFormInput type="date"  {...register("assignmentDate", { required: "Assignment date is required" })} />
                                            {errors.assignmentDate && <span className="text-danger">{errors.assignmentDate.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Completion Date</CFormLabel>
                                            <CFormInput type="date"  {...register("completionDate", { required: "Completion Date is required" })} />
                                            {errors.completionDate && <span className="text-danger">{errors.completionDate.message}</span>}
                                        </div>

                                        <div className="mb-3">
                                            <CFormLabel className="fw-bold">Note</CFormLabel>
                                            <CFormInput {...register("notes", { required: "Note is required" })} />
                                            {errors.notes && <span className="text-danger">{errors.notes.message}</span>}
                                        </div>

                                        <CButton type="submit" color="dark" style={{ float: 'right' }} >Save</CButton>
                                        <CButton color="warning" style={{ float: 'right', marginRight: 10 }} onClick={handleGoOrder} >Cancel</CButton>
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

export default OrdersUpdate

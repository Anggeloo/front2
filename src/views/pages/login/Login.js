import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToast, CToastBody, CToastHeader, CToaster, CSpinner
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import logo from '../../../assets/images/logo3.png'
import AuthenticationService from '../../../services/Authentication'
import { useForm } from 'react-hook-form'
import { useSignalR } from '../../../socket/Socket'
import HistoryService from '../../../services/HistoryService'

const Login = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { connection } = useSignalR();

  const defaultValues = {
    userName: "",
    password: "",

  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues,
  });

  const handleGoDashboard = () => {
    navigate("/dashboard");
  };

  const handleFormSubmit = async (user) => {
    try {
      console.log("Form Data:", user);
      setLoading(true)
      const result = await AuthenticationService.login(user)

      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      if (connection) {
        connection.invoke("NotifyLogin", result.data.user.userName)
          .catch(err => console.error("Error al notificar login:", err));
      }

      await HistoryService.add(`login`)

      setToast(
        <CToast autohide={3000} visible className="text-dark">
          <CToastHeader closeButton className="text-white bg-secondary">
            <strong className="me-auto">Success</strong>
          </CToastHeader>
          <CToastBody>
            Login successfully.
          </CToastBody>
        </CToast>
      );
      handleGoDashboard()
    } catch (error) {
      console.error(error);
      setToast(
        <CToast autohide={3000} visible className="text-dark">
          <CToastHeader closeButton className="text-white bg-danger">
            <strong className="me-auto">Error</strong>
          </CToastHeader>
          <CToastBody>
            The username or password is incorrect.
          </CToastBody>
        </CToast>
      );
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        {loading ? (
          <div className='spinner-loading'>
            <CSpinner color="primary" variant="grow" size="lg" />
          </div>
        ) : (
          <CRow className="justify-content-center">
            <CCol md={8}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm onSubmit={handleSubmit(handleFormSubmit)}>
                      <h1>Login</h1>
                      <CInputGroup className="mb-3 mt-4">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput placeholder="Username" autoComplete="username" {...register("userName", { required: "Username is required" })} />
                      </CInputGroup>
                      {errors.userName && <span className="text-danger" style={{ display: 'block', marginTop: '-20px' }}>{errors.userName.message}</span>}
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          {...register("password", { required: "Password is required" })}
                        />
                      </CInputGroup>
                      {errors.password && <span className="text-danger" style={{ display: 'block', marginTop: '-26px' }}>{errors.password.message}</span>}
                      <CRow>
                        <CCol xs={6}>
                          <CButton type="submit" color="primary" className="px-4">
                            Login
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard className="text-white " style={{ width: '44%', height: '100%' }}>
                  <CCardBody className="text-center d-flex align-items-center justify-content-center p-0">
                    <img
                      src={logo}
                      alt="Logo"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </CCardBody>
                </CCard>

              </CCardGroup>
            </CCol>
          </CRow>
        )}
      </CContainer>
      <CToaster push={toast} placement="bottom-end" />
    </div>
  )
}

export default Login

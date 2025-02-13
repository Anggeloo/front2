import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilLockLocked,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import anonymus from './../../assets/images/anonymus.png'
import { useNavigate } from 'react-router-dom'
import { useSignalR } from '../../socket/Socket'

const AppHeaderDropdown = () => {
  const navigate = useNavigate();

  const { connection } = useSignalR();

  const handleLogout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (connection) {
      connection.invoke("Logout", user.userCode)
        .catch(err => console.error("Error al notificar login:", err));
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={anonymus} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Log out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown

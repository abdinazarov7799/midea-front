import React from 'react';
import DoctorsContainer from "../containers/DoctorsContainer.jsx";
import HasAccess from "../../../services/auth/HasAccess.jsx";
import config from "../../../config.js";

const DoctorsPage = () => {
    return <HasAccess access={[config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_AREA_ADMIN]}><DoctorsContainer /></HasAccess>
};
export default DoctorsPage;

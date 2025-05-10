import React from 'react';
import VisitsContainer from "../containers/VisitsContainer.jsx";
import HasAccess from "../../../services/auth/HasAccess.jsx";
import config from "../../../config.js";

const VisitsPage = () => {
    return <HasAccess access={[config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_AREA_ADMIN]}><VisitsContainer /></HasAccess>
};
export default VisitsPage;

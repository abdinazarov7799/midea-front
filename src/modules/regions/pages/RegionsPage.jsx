import React from 'react';
import RegionsContainer from "../containers/RegionsContainer.jsx";
import HasAccess from "../../../services/auth/HasAccess.jsx";
import config from "../../../config.js";

const RegionsPage = () => {
    return <HasAccess access={[config.ROLES.ROLE_SUPER_ADMIN]}><RegionsContainer /></HasAccess>
};
export default RegionsPage;

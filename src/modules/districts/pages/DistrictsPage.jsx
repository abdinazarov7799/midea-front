import React from 'react';
import DistrictsContainer from "../containers/DistrictsContainer.jsx";
import HasAccess from "../../../services/auth/HasAccess.jsx";
import config from "../../../config.js";

const DistrictsPage = () => {
    return <HasAccess access={[config.ROLES.ROLE_SUPER_ADMIN]}><DistrictsContainer /></HasAccess>
};
export default DistrictsPage;

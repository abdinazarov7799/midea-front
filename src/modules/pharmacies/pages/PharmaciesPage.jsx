import React from 'react';
import PharmaciesContainer from "../containers/PharmaciesContainer.jsx";
import HasAccess from "../../../services/auth/HasAccess.jsx";
import config from "../../../config.js";

const PharmaciesPage = () => {
    return <HasAccess access={[config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_AREA_ADMIN]}><PharmaciesContainer /></HasAccess>
};

export default PharmaciesPage;

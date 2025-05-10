import React from 'react';
import StocksContainer from "../containers/StocksContainer.jsx";
import HasAccess from "../../../services/auth/HasAccess.jsx";
import config from "../../../config.js";

const StocksPage = () => {
    return <HasAccess access={[config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_AREA_ADMIN]}><StocksContainer /></HasAccess>
};
export default StocksPage;

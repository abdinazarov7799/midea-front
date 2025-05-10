import React from 'react';
import MedicinesContainer from "../containers/MedicinesContainer.jsx";
import HasAccess from "../../../services/auth/HasAccess.jsx";
import config from "../../../config.js";

const MedicinesPage = () => {
    return <HasAccess access={[config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_AREA_ADMIN]}><MedicinesContainer /></HasAccess>
};
export default MedicinesPage;

import React, { useEffect } from "react";
import { KEYS } from "../../constants/key";
import { URLS } from "../../constants/url";
import useGetAllQuery from "../../hooks/api/useGetAllQuery";
import { useStore } from "../../store";
import {get} from "lodash";
import useAuth from "../../hooks/auth/useAuth";
import OverlayLoader from "../../components/OverlayLoader.jsx";

const Auth = ({ children }) => {

    return <>{children}</>;
};

export default Auth;
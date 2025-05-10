import {Menu} from "antd";
import {get} from "lodash";
import React from "react";
import Sider from "antd/es/layout/Sider";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import config from "../../config.js";
import {hasAccess} from "../../services/auth/HasAccess.jsx";
import {useStore} from "../../store/index.js";

const DashboardSidebar = () => {
    const { t } = useTranslation();
    const location = useLocation()
    const navigate = useNavigate()

    const items = [
        {
            label: t("Warehouses"),
            key: "/warehouses",
        },
        {
            label: t("Warehouse workers"),
            key: "/warehouse-workers",
        },
        {
            label: t("Warehouse sections"),
            key: "/warehouse-sections",
        },
        {
            label: t("Team leads"),
            key: "/team-leads",
        },
        {
            label: t("Categories"),
            key: "/categories",
        },
        {
            label: t("Products"),
            key: "/products",
        },
        {
            label: t("Managers"),
            key: "/managers",
        },
        {
            label: t("Dealers"),
            key: "/dealers",
        },
        {
            label: t("Couriers"),
            key: "/couriers",
        },
        {
            label: t("Clients"),
            key: "/clients",
        },
        {
            label: t("Constants"),
            key: "/constants",
            access: [config.ROLES.ROLE_SUPER_ADMIN],
        },
        {
            label: t("Translations"),
            key: "/translations",
            access: [config.ROLES.ROLE_SUPER_ADMIN],
        },
    ]

  return(
      <Sider
          theme={"light"}
          style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
          }}
      >
          <Menu
              mode="inline"
              style={{padding: 5}}
              onSelect={(event) => {navigate(get(event,'key','/'))}}
              items={items}
              selectedKeys={[get(location,'pathname','')]}
          />

      </Sider>
  )
}
export default DashboardSidebar

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
            label: t("Categories"),
            key: "/categories",
        },
        {
            label: t("Products"),
            key: "/products",
        },
        {
            label: t("Dealers"),
            key: "/dealers",
        },
        {
            label: t("Team leads"),
            key: "/team-leads",
        },
        {
            label: t("Managers"),
            key: "/managers",
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
            label: t("Orders"),
            key: "/orders",
        },
        {
            label: t("Stock movements"),
            key: "/stock-movements",
        },
        {
            label: t("Payments"),
            key: "/payments",
        },
        {
            label: t("Inventories"),
            key: "/inventories",
        },
        {
            label: t("Accruals"),
            key: "/accruals",
        },
        {
            label: t("Constants"),
            key: "/constants",
        },
        {
            label: t("Translations"),
            key: "/translations",
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

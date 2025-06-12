import {Menu} from "antd";
import {get} from "lodash";
import React from "react";
import Sider from "antd/es/layout/Sider";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";

const DashboardSidebar = () => {
    const { t } = useTranslation();
    const location = useLocation()
    const navigate = useNavigate()

    const items = [
        {
            label: t("Items"),
            key: "/items",
            children: [
                {
                    label: t("Categories"),
                    key: "/categories",
                },
                {
                    label: t("Products"),
                    key: "/products",
                },
            ]
        },
        {
            label: t("Employees"),
            key: "/employees",
            children: [
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
            ]
        },
        {
            label: t("Clients"),
            key: "/clients",
        },
        {
            label: t("Warehouse"),
            key: "warehouses",
            children: [
                {
                    label: t("Warehouses"),
                    key: "/warehouses",
                },
                {
                    label: t("Workers"),
                    key: "/warehouse-workers",
                },
                {
                    label: t("Sections"),
                    key: "/warehouse-sections",
                },
                {
                    label: t("Stock movements"),
                    key: "/stock-movements",
                },
                {
                    label: t("Inventories"),
                    key: "/inventories",
                },
            ]
        },
        {
            label: t("Orders"),
            key: "/orders",
        },
        {
            label: t("Payments"),
            key: "payments",
            children: [
                {
                    label: t("Payments"),
                    key: "/payments",
                },
                {
                    label: t("Accruals"),
                    key: "/accruals",
                },
            ]
        },
        {
            label: t("Admins"),
            key: "/admins",
        },
        {
            label: t("Roles"),
            key: "/roles",
        },
        {
            label: t("Translations"),
            key: "/translations",
        },
        {
            label: t("Constants"),
            key: "/constants",
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

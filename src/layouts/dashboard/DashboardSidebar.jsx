import {Button, Menu, theme} from "antd";
import {get} from "lodash";
import React from "react";
import Sider from "antd/es/layout/Sider";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";

const DashboardSidebar = ({collapsed,setCollapsed}) => {
    const { t } = useTranslation();
    const location = useLocation()
    const navigate = useNavigate()

    const {
        token: {colorBgContainer},
    } = theme.useToken();

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
                {
                    label: t("Cashiers"),
                    key: "/cashiers",
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
                {
                    label: t("Inventories v2"),
                    key: "/inventories-v2",
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
          collapsible
          collapsed={collapsed}
          trigger={null}
          style={{
              position: 'fixed',
              left: 24,
              top: 24,
              bottom: 24,
              scrollbarWidth: 'none',
              padding: 16,
              background: colorBgContainer,
              borderRadius: 20,
          }}
      >
          <Button
              style={{
                  position: 'absolute',
                  top: 72,
                  right: -15,
                  borderRadius: 999,
                  border: 'transparent',
                  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
              }}
              icon={collapsed ? <RightOutlined/> : <LeftOutlined/>}
              onClick={() => setCollapsed(prevState => !prevState)}
          >

          </Button>
          <div style={{height:'100%',overflowY:'auto'}}>
              <Menu
                  mode="inline"
                  theme="light"
                  style={{padding: 5,border: 'none'}}
                  onSelect={(event) => {navigate(get(event,'key','/'))}}
                  items={items}
                  selectedKeys={[get(location,'pathname','')]}
              />
          </div>

      </Sider>
  )
}
export default DashboardSidebar

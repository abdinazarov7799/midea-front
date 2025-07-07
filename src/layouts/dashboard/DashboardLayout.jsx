import React from 'react';
import { Layout, } from 'antd';
import {Outlet} from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
const { Content} = Layout;



const DashboardLayout = () => {
    const [collapsed, setCollapsed] = React.useState(false);
  return(
      <Layout hasSider style={{
          padding: '24px',
          background: '#F3F5F7'
      }}>


          <DashboardSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <DashboardHeader collapsed={collapsed} />

          <Layout style={{
              marginLeft: collapsed ? 104 : 240,
              minHeight: 'calc(100vh - 104px)',
              marginTop: 104,
          }}>
              <Content
                  style={{background: '#F3F5F7'}}
              >
                  <Outlet />
              </Content>

          </Layout>
      </Layout>
  )
}
export default DashboardLayout

import {Button, Col, Dropdown, Image, Menu, Row, Space, Switch, theme} from "antd";
import logo from "../../assets/images/logo.png";
import ru from '../../assets/images/ru.svg'
import uz from '../../assets/images/uz.png'
import React from "react";
import {Header} from "antd/es/layout/layout";
import {FullscreenExitOutlined, FullscreenOutlined, LogoutOutlined, MoonOutlined, SunOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {useSettingsStore, useStore} from "../../store";
import {get, isEqual} from "lodash";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import storage from "../../services/storage";

const DashboardHeader = ({collapsed}) => {
    const {
        token: { colorBgContainer, colorPrimary },
    } = theme.useToken();

    const {t, i18n} = useTranslation();
    const setLang = useSettingsStore((state) => get(state, "setLang", () => {}));
    const setDarkMode = useSettingsStore((state) => get(state, "setDarkMode", () => {}));
    const darkMode = useSettingsStore((state) => get(state, "darkMode"));
    const lang = useSettingsStore((state) => get(state, "lang"));
    const user = useStore((state) => get(state, "user", () => {}));
    const setUser = useStore((state) => get(state, "setUser", () => {}));
    const setAuthenticated = useStore((state) => get(state, "setAuthenticated", () => {}));
    const clearToken = useSettingsStore((state) => get(state, "setToken", () => {}));
    const setCompactMode = useSettingsStore((state) => get(state, "setCompactMode", () => {}));
    const compactMode = useSettingsStore((state) => get(state, "compactMode"));

    const changeLang = (code) => {
        setLang(code);
        return i18n.changeLanguage(code);
    };
    const navigate = useNavigate();

    let items = [
        {
            key: "RU",
            icon: <Image src={ru} preview={false} onClick={() => changeLang("ru")}  width={25} height={25} alt={"russian flag image"} />,
        },
        {
            key: "UZ",
            icon: <Image src={uz} preview={false} onClick={() => changeLang("uz")} width={25} height={25} alt={"uzbek flag image"} />,
        },
    ].filter(item => !isEqual(get(item,"key"),lang));

    const logout = () => {
        Swal.fire({
            title: t("Are you sure you want to exit??"),
            icon: "warning",
            backdrop: "rgba(0,0,0,0.9)",
            background: "none",
            showCancelButton: true,
            confirmButtonColor: "#13D6D1",
            confirmButtonText: t("Yes"),
            cancelButtonText: t("Back"),
            customClass: {
                title: "title-color",
                content: "text-color",
                icon: "icon-color",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                setAuthenticated(false);
                setUser(null);
                clearToken(null);
                storage.remove("settings");
                navigate("/auth");
            }
        });
    };
  return(
      <Header
          style={{
              position: 'fixed',
              top: 24,
              left: collapsed ? 128 : 264,
              right: 24,
              background: colorPrimary,
              paddingInline: 24,
              borderRadius: 18,
              zIndex: 2,
          }}
      >
          <Row justify={"space-between"}>
              <Col>
                  <Image
                      src={logo}
                      preview={false}
                      width={80}
                      onClick={() => navigate('/')}
                      style={{cursor: "pointer"}}
                  />
              </Col>
              <Col>
                  <Space size={"middle"}>
                      <Menu
                          items={[{label: get(user,'roleName'),key: get(user,'roleName')}]}
                          selectedKeys={[get(user,'roleName')]}
                          mode="horizontal"
                          theme="dark"
                          style={{minWidth: 200,border: 'none',backgroundColor: 'transparent' }}
                      />
                      {/*<Switch*/}
                      {/*    checkedChildren={<SunOutlined />}*/}
                      {/*    unCheckedChildren={<MoonOutlined />}*/}
                      {/*    checked={darkMode}*/}
                      {/*    onClick={() => setDarkMode()}*/}
                      {/*/>*/}
                      <Switch
                          checkedChildren={<FullscreenOutlined />}
                          unCheckedChildren={<FullscreenExitOutlined />}
                          checked={compactMode}
                          onClick={() => setCompactMode()}
                      />
                      <Dropdown
                          menu={{items}}
                          placement="bottom"
                          trigger={['click']}
                          overlayClassName={"language-dropdown"}
                          over
                      >
                          <Image src={isEqual(lang,"ru") ? ru : uz} preview={false} width={30} height={30} alt={"flag image"} />
                      </Dropdown>
                      <Button
                          icon={<LogoutOutlined />}
                          style={{height: 50,}}
                          onClick={logout}
                      >
                          {t("Logout")}
                      </Button>
                  </Space>
              </Col>
          </Row>
      </Header>
  )
}
export default DashboardHeader

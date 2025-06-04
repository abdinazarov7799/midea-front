import React, {useState} from 'react';
import {Checkbox, Space, Table} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import Container from "../../../components/Container.jsx";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import dayjs from "dayjs";

const RolesContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);

    const {data,isLoading} = useGetAllQuery({
        key: KEYS.roles_list,
        url: URLS.roles_list,
    });

    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
            width: 250
        },
        {
            title: t("Name"),
            dataIndex: "name",
            key: "name",
        },
        // {
        //     title: t("Web"),
        //     dataIndex: "web",
        //     key: "web",
        //     render: (props,data,index) => (
        //         <Checkbox checked={get(data,'web')} />
        //     )
        // },
        // {
        //     title: t("Bot"),
        //     dataIndex: "bot",
        //     key: "bot",
        //     render: (props,data,index) => (
        //         <Checkbox checked={get(data,'bot')} />
        //     )
        // },
        {
            title: t("Created at"),
            dataIndex: "createdAt",
            key: "createdAt",
            width: 200,
            render: props => dayjs(props).format('YYYY-MM-DD HH:mm:ss'),
        },
    ]
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Table
                    columns={columns}
                    dataSource={get(data,'data',[])}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading}
                />
            </Space>
        </Container>
    );
};

export default RolesContainer;

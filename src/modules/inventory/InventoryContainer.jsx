import React, {useState} from 'react';
import Container from "../../components/Container.jsx";
import {Checkbox, Pagination, Row, Space, Table, Typography} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../constants/key.js";
import {URLS} from "../../constants/url.js";
import dayjs from "dayjs";

const InventoryContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [params, setParams] = useState({});

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.inventory_list,
        url: URLS.inventory_list,
        params: {
            params: {
                size: 10,
                ...params
            }
        },
        page
    });

    const onChangeParams = (name, value) => {
        setParams(prevState => ({...prevState, [name]: value}));
    }

    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
        },
        {
            title: t("Category"),
            dataIndex: "product",
            key: "category",
            render: product => get(product,'category.name'),
        },
        {
            title: t("Product"),
            dataIndex: "product",
            key: "product",
            render: product => get(product,'model'),
        },
        {
            title: t("Quantity"),
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: t("Warehouse"),
            dataIndex: "section",
            key: "warehouse",
            render: section => get(section,'warehouse.name'),
        },
        {
            title: t("Section"),
            dataIndex: "section",
            key: "section",
            render: section => get(section,'name'),
        },
        {
            title: t("Updated at"),
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (props) => dayjs(props).format('YYYY-MM-DD HH:mm:ss'),
        },
    ]
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Table
                    columns={columns}
                    dataSource={get(data,'data.content',[])}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading}
                />

                <Row justify={"space-between"} style={{marginTop: 10}}>
                    <Typography.Title level={4}>
                        {t("Miqdori")}: {get(data,'data.totalElements')} {t("ta")}
                    </Typography.Title>
                    <Pagination
                        current={page+1}
                        onChange={(page) => setPage(page - 1)}
                        total={get(data,'data.totalPages') * 10 }
                        showSizeChanger={false}
                    />
                </Row>
            </Space>
        </Container>
    );
};

export default InventoryContainer;

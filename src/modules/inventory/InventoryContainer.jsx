import React, {useState} from 'react';
import Container from "../../components/Container.jsx";
import {DatePicker, Input, Pagination, Row, Space, Table, Typography} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../constants/key.js";
import {URLS} from "../../constants/url.js";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";

const InventoryContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [params, setParams] = useState({});
    const navigate = useNavigate();

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.inventory_list,
        url: URLS.inventory_list,
        params: {
            params: {
                size: 1000,
                ...params,
                from: get(params,'from') ? get(params,'from')?.toISOString() : null,
                to: get(params,'to') ? get(params,'to')?.toISOString() : null
            }
        },
        page
    });

    const totalQuantity = get(data, 'data.content', [])?.reduce((sum, item) => sum + (item.quantity || 0), 0);


    const onChangeParams = (name, value) => {
        setParams(prevState => ({...prevState, [name]: value}));
    }

    const columns = [
        {
            title: (
                <Space direction="vertical">
                    {t("Category")}
                    <Input
                        placeholder={t("Category")}
                        allowClear
                        value={get(params,'categoryName','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('categoryName', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "product",
            key: "category",
            render: product => get(product,'category.name'),
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Product")}
                    <Input
                        placeholder={t("Product")}
                        allowClear
                        value={get(params,'productModel','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('productModel', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "product",
            key: "product",
            render: product => get(product,'model'),
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Quantity")}
                    <Typography.Text>({totalQuantity})</Typography.Text>
                </Space>
            ),
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Warehouse")}
                    <Input
                        placeholder={t("Warehouse")}
                        allowClear
                        value={get(params,'warehouseName','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('warehouseName', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "section",
            key: "warehouse",
            render: section => get(section,'warehouse.name'),
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Section")}
                    <Input
                        placeholder={t("Section")}
                        allowClear
                        value={get(params,'sectionName','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('sectionName', value)
                        }}
                    />
                </Space>
            ),
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
                <Space size={"middle"}>
                    <DatePicker
                        allowClear
                        placeholder={t("Dan")}
                        format="YYYY-MM-DD"
                        value={get(params, 'from') ? dayjs(get(params, 'from')) : null}
                        onChange={(date) => onChangeParams('from', date)}
                    />
                    <DatePicker
                        allowClear
                        placeholder={t("Gacha")}
                        format="YYYY-MM-DD"
                        value={get(params, 'to') ? dayjs(get(params, 'to')) : null}
                        onChange={(date) => onChangeParams('to', date)}
                    />
                </Space>
                <Table
                    columns={columns}
                    dataSource={get(data,'data.content',[])}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading}
                    onRow={(record) => {
                        return {
                            style: {cursor: "pointer"},
                            onDoubleClick: () => navigate(`/inventory/${get(record,'id')}`)
                        }
                    }}
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

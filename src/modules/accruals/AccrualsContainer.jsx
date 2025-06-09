import React, {useState} from 'react';
import Container from "../../components/Container.jsx";
import {Checkbox, DatePicker, Input, Pagination, Row, Space, Table, Typography} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../constants/key.js";
import {URLS} from "../../constants/url.js";
import dayjs from "dayjs";

const AccrualsContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [params, setParams] = useState({});

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.accruals_list,
        url: URLS.accruals_list,
        params: {
            params: {
                size: 10,
                ...params,
                from: get(params,'from') ? get(params,'from')?.toISOString() : null,
                to: get(params,'to') ? get(params,'to')?.toISOString() : null
            }
        },
        page
    });

    const onChangeParams = (name, value) => {
        setParams(prevState => ({...prevState, [name]: value}));
    }

    const columns = [
        {
            title: (
                <Space direction="vertical">
                    {t("Role")}
                    <Input
                        placeholder={t("Role")}
                        allowClear
                        value={get(params,'role','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('role', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "role",
            key: "role",
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Order id")}
                    <Input
                        placeholder={t("Order id")}
                        allowClear
                        value={get(params,'orderId','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('orderId', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "orderId",
            key: "orderId",
        },
        {
            title: t("Amount due"),
            dataIndex: "amountDue",
            key: "amountDue"
        },
        {
            title: t("Amount received"),
            dataIndex: "amountReceived",
            key: "amountReceived"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("User")}
                    <Input
                        placeholder={t("User")}
                        allowClear
                        value={get(params,'userFullName','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('userFullName', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "user",
            key: "user",
            render: props => get(props, "fullName"),
        },
        {
            title: t("Created at"),
            dataIndex: "createdAt",
            key: "createdAt",
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

export default AccrualsContainer;

import React, {useState} from 'react';
import Container from "../../components/Container.jsx";
import {Checkbox, DatePicker, Input, Pagination, Row, Space, Table, Typography} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../constants/key.js";
import {URLS} from "../../constants/url.js";
import dayjs from "dayjs";

const PaymentsContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [params, setParams] = useState({});

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.payments_list,
        url: URLS.payments_list,
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
            title: t("Amount"),
            dataIndex: "amount",
            key: "amount",
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Method")}
                    <Input
                        placeholder={t("Method")}
                        allowClear
                        value={get(params,'method','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('method', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "method",
            key: "method",
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Action")}
                    <Input
                        placeholder={t("Action")}
                        allowClear
                        value={get(params,'action','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('action', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "action",
            key: "action"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Payer")}
                    <Input
                        placeholder={t("Payer")}
                        allowClear
                        value={get(params,'payer','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('payer', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "payer",
            key: "payer"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Receiver")}
                    <Input
                        placeholder={t("Receiver")}
                        allowClear
                        value={get(params,'receiver','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('receiver', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "receiver",
            key: "receiver"
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

export default PaymentsContainer;

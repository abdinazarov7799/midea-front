import React, {useState} from 'react';
import Container from "../../components/Container.jsx";
import {
    Button,
    Checkbox,
    DatePicker,
    Descriptions,
    Input,
    Modal,
    Pagination,
    Row,
    Space,
    Table,
    Typography
} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../constants/key.js";
import {URLS} from "../../constants/url.js";
import dayjs from "dayjs";
import {EyeOutlined, PlusOutlined} from "@ant-design/icons";

const StockMovementsContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [params, setParams] = useState({});
    const [selected, setSelected] = useState(null);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.stock_movements_list,
        url: URLS.stock_movements_list,
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
            title: (
                <Space direction="vertical">
                    {t("From warehouse")}
                    <Input
                        placeholder={t("From warehouse")}
                        allowClear
                        value={get(params,'fromWarehouse','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('fromWarehouse', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "fromWarehouse",
            key: "fromWarehouse",
        },
        {
            title: (
                <Space direction="vertical">
                    {t("From section")}
                    <Input
                        placeholder={t("From section")}
                        allowClear
                        value={get(params,'fromSection','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('fromSection', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "fromSection",
            key: "fromSection"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("To warehouse")}
                    <Input
                        placeholder={t("To warehouse")}
                        allowClear
                        value={get(params,'toWarehouse','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('toWarehouse', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "toWarehouse",
            key: "toWarehouse",
        },
        {
            title: (
                <Space direction="vertical">
                    {t("To section")}
                    <Input
                        placeholder={t("To section")}
                        allowClear
                        value={get(params,'toSection','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('toSection', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "toSection",
            key: "toSection"
        },
        {
            title: t("Comment"),
            dataIndex: "comment",
            key: "comment"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("User")}
                    <Input
                        placeholder={t("User")}
                        allowClear
                        value={get(params,'user','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('user', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "user",
            key: "user"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Confirmed by")}
                    <Input
                        placeholder={t("Confirmed by")}
                        allowClear
                        value={get(params,'confirmedBy','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('confirmedBy', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "confirmedBy",
            key: "confirmedBy"
        },
        {
            title: t("Reason"),
            dataIndex: "reason",
            key: "reason",
            render: (props) => !!props && <Button icon={<EyeOutlined />} onClick={() => setSelected(props)} type="primary" />
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
            <Modal open={!!selected} footer={null} onCancel={() => setSelected(null)}>
                <Descriptions
                    bordered
                    column={1}
                    items={[
                        {
                            label: t("Label"),
                            children: get(selected, "label"),
                        },
                        {
                            label: t("Code"),
                            children: get(selected, "code"),
                        },
                        {
                            label: t("Penalty"),
                            children: <Checkbox checked={get(selected, "penalty")} />,
                        },
                        {
                            label: t("Penalty amount"),
                            children: get(selected, "penaltyAmount"),
                        },
                    ]}
                />
            </Modal>
        </Container>
    );
};

export default StockMovementsContainer;

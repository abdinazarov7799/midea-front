import React, {useState} from 'react';
import Container from "../../components/Container.jsx";
import {
    Button,
    Checkbox,
    DatePicker,
    Divider,
    Input,
    Modal,
    Pagination,
    Row,
    Select,
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
import {EyeOutlined} from "@ant-design/icons";

const OrdersContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [params, setParams] = useState({});
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.orders_list,
        url: URLS.orders_list,
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
        setPage(0)
        setParams(prevState => ({...prevState, [name]: value}));
    }

    const columns = [
        {
            title: (
                <Space direction="vertical">
                    {t("Client")}
                    <Input
                        placeholder={t("Client")}
                        allowClear
                        value={get(params,'client','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('client', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "client",
            key: "client",
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Courier")}
                    <Input
                        placeholder={t("Courier")}
                        allowClear
                        value={get(params,'courier','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('courier', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "courier",
            key: "courier",
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Manager")}
                    <Input
                        placeholder={t("Manager")}
                        allowClear
                        value={get(params,'manager','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('manager', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "manager",
            key: "manager"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Dealer")}
                    <Input
                        placeholder={t("Dealer")}
                        allowClear
                        value={get(params,'dealer','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('dealer', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "dealer",
            key: "dealer"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Team lead")}
                    <Input
                        placeholder={t("Team lead")}
                        allowClear
                        value={get(params,'teamLead','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('teamLead', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "teamLead",
            key: "teamLead"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Status")}
                    <Input
                        placeholder={t("Status")}
                        allowClear
                        value={get(params,'status','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('status', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "status",
            key: "status"
        },
        {
            title: t("Total amount"),
            dataIndex: "totalAmount",
            key: "totalAmount"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Warehouse")}
                    <Input
                        placeholder={t("Warehouse")}
                        allowClear
                        value={get(params,'warehouse','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('warehouse', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "warehouse",
            key: "warehouse"
        },
        {
            title: t("Created at"),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (props) => dayjs(props).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Delivery")}
                    <Select
                        style={{width: 100}}
                        placeholder={t("Delivery")}
                        allowClear
                        defaultValue={get(params,'delivery',true)}
                        value={get(params,'delivery','')}
                        options={[
                            {
                                label: 'Delivery',
                                value: true
                            },
                            {
                                label: 'Pick up',
                                value: false
                            },
                        ]}
                        onChange={(value) => {
                            onChangeParams('delivery', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "delivery",
            key: "delivery",
            render: (props) => (
                <Checkbox checked={props} disabled />
            )
        },
        {
            title: t("Actions"),
            key: "actions",
            render: (_, record) => (
                <Button icon={<EyeOutlined />} onClick={() => {
                    setSelectedOrder(record);
                    setModalVisible(true);
                }} />
            )
        }

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
            <Modal
                title={t("Buyurtma tafsilotlari")}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={800}
            >
                {selectedOrder && (
                    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                        <Typography.Text strong>{t("Buyurtma ID")}: {selectedOrder?.id}</Typography.Text>
                        <Typography.Text strong>{t("Client")}: {selectedOrder?.client}</Typography.Text>
                        <Typography.Text strong>{t("Manager")}: {selectedOrder?.manager}</Typography.Text>
                        <Typography.Text strong>{t("Dealer")}: {selectedOrder?.dealer}</Typography.Text>
                        <Typography.Text strong>{t("Umumiy summa")}: {selectedOrder?.totalAmount}</Typography.Text>
                        <Typography.Text strong>{t("Status")}: {selectedOrder?.status}</Typography.Text>
                        <Divider>{t("Mahsulotlar")}</Divider>

                        {selectedOrder?.sectionItems?.map((section) => (
                            <div key={section.sectionId} style={{ marginBottom: 20 }}>
                                <Typography.Title level={5}>
                                    {t("Bo'lim")}: {section.sectionName}
                                </Typography.Title>
                                <Table
                                    size="small"
                                    bordered
                                    pagination={false}
                                    dataSource={section.items}
                                    rowKey="id"
                                    columns={[
                                        {
                                            title: t("Model"),
                                            dataIndex: ["product", "model"],
                                            key: "model"
                                        },
                                        {
                                            title: t("Narxi"),
                                            dataIndex: ["product", "price"],
                                            key: "price",
                                            render: (v) => `${v} UZS`
                                        },
                                        {
                                            title: t("Miqdor"),
                                            dataIndex: "quantity",
                                            key: "quantity"
                                        },
                                        {
                                            title: t("Yakuniy narx"),
                                            dataIndex: "finalPrice",
                                            key: "finalPrice",
                                            render: (v) => `${v} UZS`
                                        },
                                        {
                                            title: t("Qo‘shilgan vaqti"),
                                            dataIndex: "createdAt",
                                            key: "createdAt",
                                            render: (v) => dayjs(v).format("YYYY-MM-DD HH:mm")
                                        }
                                    ]}
                                />
                            </div>
                        ))}
                    </Space>
                )}
            </Modal>
        </Container>
    );
};

export default OrdersContainer;

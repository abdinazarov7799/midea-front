import React, { useState } from "react";
import Container from "../../components/Container.jsx";
import {
    Button,
    Input,
    Modal,
    Pagination,
    Row,
    Space,
    Table,
    Typography,
    Divider,
    Form,
    InputNumber,
    message
} from "antd";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import usePaginateQuery from "../../hooks/api/usePaginateQuery.js";
import usePutQuery from "../../hooks/api/usePutQuery.js";
import { KEYS } from "../../constants/key.js";
import dayjs from "dayjs";
import { EyeOutlined } from "@ant-design/icons";

const ReturnsContainer = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [params, setParams] = useState({});
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [form] = Form.useForm();

    // GET returns
    const { data, isLoading } = usePaginateQuery({
        key: "/api/admin/returns/get-all",
        url: "/api/admin/returns/get-all",
        params: {
            params: {
                size: 10,
                ...params
            }
        },
        page
    });

    // PUT confirm
    const { mutate: confirmMutate, isLoading: isConfirming } = usePutQuery({});

    const onChangeParams = (name, value) => {
        setPage(0);
        setParams(prev => ({ ...prev, [name]: value }));
    };

    const columns = [
        {
            title: (
                <Space direction="vertical">
                    {t("Client")}
                    <Input
                        allowClear
                        value={get(params, "client", "")}
                        onChange={e => onChangeParams("client", e.target.value)}
                        placeholder={t("Client")}
                    />
                </Space>
            ),
            dataIndex: "client",
            key: "client"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Manager")}
                    <Input
                        allowClear
                        value={get(params, "manager", "")}
                        onChange={e => onChangeParams("manager", e.target.value)}
                        placeholder={t("Manager")}
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
                        allowClear
                        value={get(params, "dealer", "")}
                        onChange={e => onChangeParams("dealer", e.target.value)}
                        placeholder={t("Dealer")}
                    />
                </Space>
            ),
            dataIndex: "dealer",
            key: "dealer"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Warehouse")}
                    <Input
                        allowClear
                        value={get(params, "warehouse", "")}
                        onChange={e => onChangeParams("warehouse", e.target.value)}
                        placeholder={t("Warehouse")}
                    />
                </Space>
            ),
            dataIndex: "warehouse",
            key: "warehouse"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Status")}
                    <Input
                        allowClear
                        value={get(params, "status", "")}
                        onChange={e => onChangeParams("status", e.target.value)}
                        placeholder={t("Status")}
                    />
                </Space>
            ),
            dataIndex: "status",
            key: "status"
        },
        {
            title: t("Created at"),
            dataIndex: "createdAt",
            key: "createdAt",
            render: v => (v ? dayjs(v).format("YYYY-MM-DD HH:mm") : "-")
        },
        {
            title: t("Actions"),
            key: "actions",
            render: (_, record) => (
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => {
                        setSelectedOrder(record);
                        setModalVisible(true);
                    }}
                />
            )
        }
    ];

    const handleConfirmSubmit = () => {
        form.validateFields().then(values => {
            confirmMutate(
                {
                    url: `/api/admin/returns/confirm/${selectedOrder.id}`,
                    attributes: values
                },
                {
                    onSuccess: () => {
                        message.success(t("Qaytarish muvaffaqiyatli tasdiqlandi"));
                        setConfirmModalVisible(false);
                        setModalVisible(false);
                    }
                }
            );
        });
    };

    return (
        <Container>
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
                <Table
                    columns={columns}
                    dataSource={get(data, "data.content", [])}
                    rowKey="id"
                    bordered
                    size="middle"
                    pagination={false}
                    loading={isLoading}
                />

                <Row justify="space-between" style={{ marginTop: 10 }}>
                    <Typography.Text>
                        {t("Miqdori")}: {get(data, "data.totalElements")}
                    </Typography.Text>
                    <Pagination
                        current={page + 1}
                        onChange={p => setPage(p - 1)}
                        total={get(data, "data.totalElements")}
                        pageSize={10}
                        showSizeChanger={false}
                    />
                </Row>
            </Space>

            <Modal
                title={t("Buyurtma tafsilotlari")}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={
                    <Button
                        type="primary"
                        onClick={() => setConfirmModalVisible(true)}
                        disabled={selectedOrder?.status !== "CONFIRMED_BY_WAREHOUSE"}
                    >
                        {t("Qaytarishni tasdiqlash")}
                    </Button>
                }
                width={700}
            >
                {selectedOrder && (
                    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                        <Typography.Text strong>{t("ID")}: {selectedOrder?.id}</Typography.Text>
                        <Typography.Text strong>{t("Client")}: {selectedOrder?.client}</Typography.Text>
                        <Typography.Text strong>{t("Manager")}: {selectedOrder?.manager} - {selectedOrder?.managerAmount}$</Typography.Text>
                        <Typography.Text strong>{t("Dealer")}: {selectedOrder?.dealer}  - {selectedOrder?.dealerAmount}$</Typography.Text>
                        <Typography.Text strong>{t("Team Lead")}: {selectedOrder?.teamLead}  - {selectedOrder?.teamLeadAmount}$</Typography.Text>
                        <Typography.Text strong>{t("Warehouse")}: {selectedOrder?.warehouse}</Typography.Text>
                        <Typography.Text strong>{t("Skladchi")}: {selectedOrder?.warehouseWorker}</Typography.Text>
                        <Typography.Text strong>{t("Status")}: {selectedOrder?.status}</Typography.Text>
                        <Typography.Text strong>{t("Yaratilgan")}: {selectedOrder?.createdAt}</Typography.Text>
                        <Typography.Text strong>{t("Qabul qilingan")}: {selectedOrder?.confirmedAt}</Typography.Text>
                        <Typography.Text strong>{t("Izoh")}: {selectedOrder?.creatorComment}</Typography.Text>

                        <Divider>{t("Mahsulotlar")}</Divider>

                        <Table
                            size="small"
                            bordered
                            pagination={false}
                            dataSource={selectedOrder?.items}
                            rowKey="productId"
                            columns={[
                                {
                                    title: t("Model"),
                                    dataIndex: "model",
                                    key: "model"
                                },
                                {
                                    title: t("Miqdor"),
                                    dataIndex: "quantity",
                                    key: "quantity"
                                }
                            ]}
                        />
                    </Space>
                )}
            </Modal>

            <Modal
                title={t("Qaytarishni tasdiqlash")}
                open={confirmModalVisible}
                onCancel={() => setConfirmModalVisible(false)}
                onOk={handleConfirmSubmit}
                confirmLoading={isConfirming}
                okText={t("Tasdiqlash")}
                cancelText={t("Bekor qilish")}
            >
                <Form form={form} layout="vertical" initialValues={{ dealerAmount: 0, teamLeadAmount: 0, managerAmount: 0 }}>
                    <Form.Item
                        label={t("Diler summasi")}
                        name="dealerAmount"
                        rules={[{ required: true, message: t("To'ldiring") }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label={t("Team Lead summasi")}
                        name="teamLeadAmount"
                        rules={[{ required: true, message: t("To'ldiring") }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label={t("Manager summasi")}
                        name="managerAmount"
                        rules={[{ required: true, message: t("To'ldiring") }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </Container>
    );
};

export default ReturnsContainer;

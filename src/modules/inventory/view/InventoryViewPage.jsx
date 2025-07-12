import React, { useState } from 'react';
import Container from "../../../components/Container.jsx";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import { useNavigate, useParams } from "react-router-dom";
import { Table, Divider, Button, Modal, Form, InputNumber, message } from "antd";
import { get } from "lodash";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { ArrowLeftOutlined } from "@ant-design/icons";
import usePutQuery from "../../../hooks/api/usePutQuery.js";

const InventoryViewPage = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [page, setPage] = useState(0);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const { data, isLoading: isLoadingLogs, refetch } = usePaginateQuery({
        key: ["inventory_log", id],
        url: `/api/admin/inventory_logs/get/${id}`,
        params: { params: { size: 20 } },
        page
    });

    const { mutate: mutateEdit, isLoading: isLoadingEdit } = usePutQuery({
        listKeyId: ["inventory_log", id],
    });

    const handleEdit = (log) => {
        setSelectedLog(log);
        form.setFieldsValue({ quantity: get(log, 'quantity') });
        setEditModalVisible(true);
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            mutateEdit({
                url: `/api/admin/inventory_logs/edit/${get(selectedLog, 'id')}`,
                attributes: values
            });
            message.success(t("Muvaffaqiyatli yangilandi"));
            setEditModalVisible(false);
            refetch();
        } catch (error) {
            console.error(error);
            message.error(t("Xatolik yuz berdi"));
        }
    };

    const columns = [
        {
            title: t("Amal"),
            dataIndex: 'action',
            key: 'action',
        },
        {
            title: t("Return ID"),
            dataIndex: 'returnId',
            key: 'returnId',
        },
        {
            title: t("Order ID"),
            dataIndex: 'orderId',
            key: 'orderId',
        },
        {
            title: t("Mahsulot"),
            dataIndex: 'product',
            key: 'product',
        },
        {
            title: t("Miqdor"),
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: t("Sabab"),
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: t("Ombor"),
            dataIndex: 'warehouse',
            key: 'warehouse',
        },
        {
            title: t("Bo‘lim"),
            dataIndex: 'section',
            key: 'section',
        },
        {
            title: t("Kim tomonidan"),
            dataIndex: ['createdBy'],
            key: 'createdBy',
            render: (createdBy) => createdBy?.fullName || createdBy?.username || t("Noma'lum"),
        },
        {
            title: t("Vaqt"),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm"),
        },
        {
            title: t("Harakatlar"),
            key: 'actions',
            render: (_, record) => (
                record.canEdit && (
                    <Button type="link" onClick={() => handleEdit(record)}>
                        {t("Tahrirlash")}
                    </Button>
                )
            )
        }
    ];

    return (
        <Container>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/inventories')}>
                {t("Orqaga")}
            </Button>

            <Divider>{t("Inventar harakatlari tarixi")}</Divider>

            <Table
                columns={columns}
                dataSource={get(data, 'data.content', []).map(item => ({ ...item, key: item.id }))}
                loading={isLoadingLogs}
                pagination={{
                    current: page + 1,
                    total: data?.data?.totalElements || 0,
                    pageSize: 20,
                    onChange: (p) => setPage(p - 1),
                }}
            />

            <Modal
                title={t("Miqdorni tahrirlash")}
                open={editModalVisible}
                onOk={handleSave}
                confirmLoading={isLoadingEdit}
                onCancel={() => setEditModalVisible(false)}
                okText={t("Saqlash")}
                cancelText={t("Bekor qilish")}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label={t("Miqdor")}
                        name="quantity"
                        rules={[{ required: true, message: t("Iltimos, miqdorni kiriting") }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </Container>
    );
};

export default InventoryViewPage;

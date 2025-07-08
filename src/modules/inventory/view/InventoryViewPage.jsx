import React, { useState } from 'react';
import Container from "../../../components/Container.jsx";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {useNavigate, useParams} from "react-router-dom";
import {List, Card, Divider, Button, Modal, Form, InputNumber, message} from "antd";
import { get } from "lodash";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import {ArrowLeftOutlined} from "@ant-design/icons";
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
            console.log(values);
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


    return (
        <Container>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/inventories')}>{t("Orqaga")}</Button>
            <Divider>
                {t("Inventar harakatlari tarixi")}
            </Divider>
            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={get(data, 'data.content', [])}
                loading={isLoadingLogs}
                pagination={{
                    current: page + 1,
                    total: data?.data?.totalElements || 0,
                    pageSize: 20,
                    onChange: (p) => setPage(p - 1)
                }}
                renderItem={item => (
                    <List.Item>
                        <Card
                            title={`${t("Amal")}: ${get(item, 'action')}`}
                            extra={
                                get(item, 'canEdit') && (
                                    <Button type={'primary'} onClick={() => handleEdit(item)}>{t("Tahrirlash")}</Button>
                                )
                            }
                        >
                            <p><b>{t("Order id")}:</b> {get(item, 'orderId')}</p>
                            <p><b>{t("Mahsulot")}:</b> {get(item, 'product')}</p>
                            <p><b>{t("Miqdor")}:</b> {get(item, 'quantity')}</p>
                            <p><b>{t("Sabab")}:</b> {get(item, 'reason')}</p>
                            <p><b>{t("Ombor")}:</b> {get(item, 'warehouse')}</p>
                            <p><b>{t("Bo‘lim")}:</b> {get(item, 'section')}</p>
                            <p><b>{t("Kim tomonidan")}:</b> {get(item, 'createdBy.fullName') || get(item, 'createdBy.username') || t("Noma'lum")}</p>
                            <p><b>{t("Vaqt")}:</b> {dayjs(get(item, 'createdAt')).format("YYYY-MM-DD HH:mm")}</p>
                        </Card>
                    </List.Item>
                )}
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

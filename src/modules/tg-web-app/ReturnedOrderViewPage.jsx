import React from 'react';
import { useParams } from 'react-router-dom';
import {Card, Button, Select, Form, Input, Typography, Flex, Space} from 'antd';
import useGetAllQuery from '../../hooks/api/useGetAllQuery.js';
import usePutQuery from '../../hooks/api/usePutQuery.js';
import { get } from 'lodash';
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useTelegram} from "../../hooks/telegram/useTelegram.js";

const { Text } = Typography;

const ReturnedOrderViewPage = () => {
    const { id, userId, roleId } = useParams();
    const [form] = Form.useForm();
    const {t} = useTranslation();
    const telegram = useTelegram();

    const { data } = useGetAllQuery({
        key: ['single-order', id],
        url: `/api/web/orders/get/${id}/${userId}`,
        params: {
            params: { roleId }
        }
    });

    const { data:returnedCodes } = useGetAllQuery({
        key: ['returned-codes'],
        url: `/api/common/return-codes/get`,
    });

    const { mutate, isLoading } = usePutQuery({});

    const order = get(data, 'data', {});

    const onFinish = (values) => {
        mutate({
            url: `/api/web/warehouse-workers/confirm-return/${id}/${userId}`,
            attributes: {
                ...values
            }
        },{
            onSuccess: () => {
                telegram.onClose();
            }
        });
    };

    return (
        <Card title={<Space><Button icon={<ArrowLeftOutlined/>} onClick={() => history.back()} /><Typography.Text>{`${t("Buyurtma raqami")}: #${order?.code || order?.id}`}</Typography.Text></Space>}>
            <p><b>{t("Buyurtmachi")}:</b> {order?.client}</p>
            <p><b>{t("Diler")}:</b> {order?.dealer}</p>
            <p><b>{t("Team Lead")}:</b> {order?.teamLead}</p>
            <p><b>{t("Ombor")}:</b> {order?.warehouse}</p>
            <p><b>{t("Mahsulotlar")}:</b></p>
            {order?.items?.map((item, i) => (
                <p key={i}><b>L {item?.product?.model}</b> x {item?.quantity} {t("dona")}</p>
            ))}
            <p><b>{t("Buyurtma summasi")}:</b> {order?.totalAmount} {t("so‘m")}</p>
            <p><b>{t("To‘lov (mustPay)")}:</b> {order?.mustPay} {t("so‘m")}</p>
            <p><b>{t("Yetkazib berish kerakmi")}:</b> {order?.delivery ? t('Ha') : t('Yo‘q')}</p>
            <p>
                <b>Manzil:</b>{' '}
                <a href={order?.address} target="_blank" rel="noopener noreferrer">
                    {t("Lokatsiya")}
                </a>
            </p>
            <p><b>{t("Yaratilgan")}:</b> {dayjs(order?.createdAt).format('DD-MM-YYYY HH:mm')}</p>
            <p><b>{t("Yaratuvchi izohi")}:</b> {order?.creatorComment || 'Ma\'lumot yo‘q'}</p>
            <p><b>{t("WW izohi")}:</b> {order?.warehouseWorkerComment || 'Ma\'lumot yo‘q'}</p>
            <p><b>{t("Courier izohi")}:</b> {order?.courierComment || 'Ma\'lumot yo‘q'}</p>
            <p><b>{t("Status")}:</b> <Text type="danger">{t(order?.status)}</Text></p>
            <p><b>{t("Kuryer")}:</b> {order?.courier || t('Biriktirilmagan')}</p>

            <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: 24 }}>
                <Form.Item
                    name="returnCode"
                    label={t("Sababni tanlang")}
                    rules={[{ required: true }]}
                >
                    <Select
                        placeholder={t("Tanlash")}
                        options={get(returnedCodes,'data',[])?.map(item => ({label: t(item), value: item}))}
                    />
                </Form.Item>
                <Form.Item name="returnReason" label={t("Izoh qoldiring")} rules={[{ required: true }]}>
                    <Input.TextArea placeholder={t("Comment")} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={isLoading}>
                        {t("Vozvratni tasdiqlash")}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default ReturnedOrderViewPage;

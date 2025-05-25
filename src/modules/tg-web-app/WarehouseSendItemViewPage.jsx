import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {Card, Typography, Button, Select, message, Space} from 'antd';
import { useTranslation } from 'react-i18next';
import useGetAllQuery from '../../hooks/api/useGetAllQuery';
import usePutQuery from '../../hooks/api/usePutQuery';
import usePostQuery from '../../hooks/api/usePostQuery';
import { get } from 'lodash';
import {ArrowLeftOutlined} from "@ant-design/icons";

const { Text } = Typography;

const WarehouseSendItemViewPage = () => {
    const { t } = useTranslation();
    const { id, roleId, userId } = useParams();
    const [courierId, setCourierId] = useState(null);
    const [isCourierAssigned, setIsCourierAssigned] = useState(false);
    const [formDisabled, setFormDisabled] = useState(false);

    const { data: orderData } = useGetAllQuery({
        key: ['order', id],
        url: `/api/web/orders/get/${id}/${userId}`,
        params: { params: { roleId } }
    });

    const { data: couriersData } = useGetAllQuery({
        key: ['couriers'],
        url: `/api/web/couriers/get`
    });

    const confirmShipping = usePutQuery({});
    const transferItems = usePostQuery({});

    const order = get(orderData, 'data', {});
    const couriers = get(couriersData, 'data.content', []);

    useEffect(() => {
        if (order?.courier) {
            setIsCourierAssigned(true);
            setCourierId(order.courier.id);
            setFormDisabled(true);
        }
    }, [order]);

    const handleCourierAssign = () => {
        if (!courierId) return message.error(t("Iltimos, kuryerni tanlang"));

        confirmShipping.mutate({
            url: `/api/web/warehouse-workers/link-courier/${id}/${userId}?courierId=${courierId}&completed=${!get(orderData,'data.deliver')}`,
        }, {
            onSuccess: () => {
                message.success(t("Kuryer biriktirildi"));
                setIsCourierAssigned(true);
                setFormDisabled(true);
            }
        });
    };

    const handleSend = () => {
        if (!isCourierAssigned) {
            return message.error(t("Kuryerni biriktirish kerak"));
        }

        const transferBody = {
            stocks: order.items.map(item => ({
                productId: item.product.id,
                quantity: item.quantity
            })),
            fromSection: order.fromSection?.id,
            toSection: order.toSection?.id || null,
            toWarehouse: order.warehouseId,
            comment: order.creatorComment || '',
            innerTransfer: true
        };

        transferItems.mutate({
            url: `/api/web/warehouse-workers/transfer/${userId}`,
            attributes: transferBody
        }, {
            onSuccess: () => message.success(t("Tovar muvaffaqiyatli chiqarildi"))
        });
    };

    return (
        <Card title={<Space><Button icon={<ArrowLeftOutlined/>} onClick={() => history.back()} /><Typography.Text>{`${t("Buyurtma raqami")}: #${order?.code || order?.id}`}</Typography.Text></Space>}>
            <p><b>{t("Buyurtmachi")}:</b> {order.client}</p>
            <p><b>{t("Mahsulotlar")}:</b></p>
            {order.items?.map((item, i) => (
                <p key={i}>
                    <b>L {item.product?.model}</b> x {item.quantity} {t("dona")}
                </p>
            ))}
            <p><b>{t("Menejer")}:</b> {order.manager}</p>
            <p><b>{t("Yaratuvchi izohi")}:</b> {order?.creatorComment || 'Ma\'lumot yo‘q'}</p>
            <p><b>{t("WW izohi")}:</b> {order?.warehouseWorkerComment || 'Ma\'lumot yo‘q'}</p>
            <p><b>{t("Courier izohi")}:</b> {order?.courierComment || 'Ma\'lumot yo‘q'}</p>
            <p><b>{t("Status")}:</b> <Text type="success">{t("Yangi")}</Text></p>
            <p><b>{t("Kuryer")}:</b> {order.courier || t("Biriktirilmagan")}</p>

            <p style={{ marginTop: 16 }}><b>{t("Kuryerni tanlang")}:</b></p>
            <Select
                placeholder={t("Tanlash")}
                options={couriers?.map(c => ({
                    label: `${c.fullName} | ${c.phone}`,
                    value: c.id
                }))}
                value={courierId}
                onChange={val => setCourierId(val)}
                disabled={formDisabled}
                style={{ width: '100%', marginBottom: 12 }}
            />
            <Button
                type="primary"
                onClick={handleCourierAssign}
                block
                disabled={formDisabled}
            >
                {t("Biriktirish")}
            </Button>

            <Button
                type="primary"
                style={{ marginTop: 16 }}
                block
                onClick={handleSend}
            >
                {t("Buyurtma chiqarishga tayyorligini tasdiqlash")}
            </Button>
        </Card>
    );
};

export default WarehouseSendItemViewPage;

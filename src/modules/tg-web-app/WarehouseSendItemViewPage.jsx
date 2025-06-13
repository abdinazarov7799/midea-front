import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {Card, Typography, Button, Select, message, Space, Input} from 'antd';
import { useTranslation } from 'react-i18next';
import useGetAllQuery from '../../hooks/api/useGetAllQuery';
import usePutQuery from '../../hooks/api/usePutQuery';
import usePostQuery from '../../hooks/api/usePostQuery';
import {get, isEqual} from 'lodash';
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useTelegram} from "../../hooks/telegram/useTelegram.js";

const { Text } = Typography;

const WarehouseSendItemViewPage = () => {
    const { t } = useTranslation();
    const { id, roleId, userId } = useParams();
    const [courierId, setCourierId] = useState(null);
    const [formDisabled, setFormDisabled] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [comment, setComment] = useState(null);
    const telegram = useTelegram();

    const { data: orderData } = useGetAllQuery({
        key: ['order', id],
        url: `/api/web/orders/get/${id}/${userId}`,
        params: { params: { roleId } }
    });

    const { data: couriersData } = useGetAllQuery({
        key: ['couriers'],
        url: `/api/web/couriers/get`
    });

    const confirmShipping = usePutQuery({listKeyId: ['order'],hideSuccessToast: true});
    const linkCourier = usePutQuery({listKeyId: ['order'],hideSuccessToast: true});

    const order = get(orderData, 'data', {});
    const couriers = get(couriersData, 'data.content', []);

    useEffect(() => {
        if (!isEqual(get(order,'status'),'READY_TO_SHIP')) {
            setFormDisabled(true);
        }else {
            setFormDisabled(false);
        }
    }, [order]);

    const handleCourierAssign = () => {
        if (!courierId) return message.error(t("Iltimos, kuryerni tanlang"));

        linkCourier.mutate({
            url: `/api/web/warehouse-workers/link-courier/${id}/${userId}?courierId=${courierId}&completed=${!get(orderData,'data.deliver')}`,
        }, {
            onSuccess: () => {
                setFormDisabled(true);
                message.success(
                    t("Kuryer biriktirildi"),
                    3,
                    () => telegram.onClose()
                );
            }
        });
    };

    const handlePickUp = () => {
        linkCourier.mutate({
            url: `/api/web/warehouse-workers/link-courier/${id}/${userId}?completed=true`,
        }, {
            onSuccess: () => {
                message.success(
                    t("Muvaffaqqiyatli tugatildi"),
                    3,
                    () => telegram.onClose()
                );
            }
        });
    }

    const handleConfirm = (confirmed) => {
        confirmShipping.mutate({
            url: `/api/web/warehouse-workers/confirm-shipping/${id}/${userId}?confirm=${confirmed}&comment=${comment}`,
            attributes: {
                comment
            }
        }, {
            onSuccess: () => {
                message.success(
                    t("Buyurtma chiqarishga tayyorlandi"),
                    3,
                    () => telegram.onClose()
                );
            }
        });
    };

    return (
        <Card title={<Space><Button icon={<ArrowLeftOutlined/>} onClick={() => history.back()} /><Typography.Text>{`${t("Buyurtma raqami")}: #${order?.code || order?.id}`}</Typography.Text></Space>}>
            <p><b>{t("Buyurtmachi")}:</b> {order?.client}</p>
            <p><b>{t("Mahsulotlar")}:</b></p>
            {
                get(order,'sectionItems',[])?.map((item, index) => {
                    return (
                        <Card
                            key={index}
                            title={`${t("Section")}: ${get(item,'sectionName') ?? '-'}`}
                            style={{margin: '10px 0'}}
                            styles={{body: {padding: 8},header: {padding: '0 8px'}}}
                        >
                            {item?.items?.map((item, i) => (
                                <p key={i}><b>L {item?.product?.model}</b> x {item?.quantity} {t("dona")}</p>
                            ))}
                        </Card>
                    )
                })
            }
            <p><b>{t("Menejer")}:</b> {order?.manager}</p>
            <p><b>{t("Yaratuvchi izohi")}:</b> {order?.creatorComment || t('Ma\'lumot yo‘q')}</p>
            <p><b>{t("WW izohi")}:</b> {order?.warehouseWorkerComment || t('Ma\'lumot yo‘q')}</p>
            <p><b>{t("Courier izohi")}:</b> {order?.courierComment || t('Ma\'lumot yo‘q')}</p>
            <p><b>{t("Status")}:</b> <Text type="success">{order?.status || t("Yangi")}</Text></p>
            <p><b>{t("Kuryer")}:</b> {order?.courier || t("Biriktirilmagan")}</p>

            {
                isRejecting && (
                    <Input.TextArea
                        placeholder={t("Izoh qoldiring")}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{ marginTop: 16 }}
                    />
                )
            }

            {
                (isEqual(get(order,'status'),'READY_TO_SHIP') && get(order,'delivery')) && (
                    <>
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
                    </>
                )
            }

            {
                !get(order,'delivery') && (
                    <Button
                        type="primary"
                        style={{ marginTop: 16 }}
                        block
                        onClick={handlePickUp}
                    >
                        {t("Olib ketildi")}
                    </Button>
                )
            }

            <Space direction="vertical" style={{width:'100%', marginTop: 80}}>
                <Button
                    type="primary"
                    danger
                    style={{ marginTop: 16 }}
                    block
                    onClick={() => {
                        if (isRejecting) {
                            handleConfirm(false)
                        }else {
                            setIsRejecting(true)
                        }
                    }}
                    disabled={!isEqual(get(order,'status'),'CREATED') || (isRejecting && !comment)}
                >
                    {t("Buyurtma chiqarishni bekor qilish")}
                </Button>
                <Button
                    type="primary"
                    style={{ marginTop: 16 }}
                    block
                    onClick={() => handleConfirm(true)}
                    disabled={!isEqual(get(order,'status'),'CREATED')}
                >
                    {t("Buyurtma chiqarishga tayyorligini tasdiqlash")}
                </Button>
            </Space>
        </Card>
    );
};

export default WarehouseSendItemViewPage;

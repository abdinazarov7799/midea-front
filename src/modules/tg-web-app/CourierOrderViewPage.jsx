import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Input, Typography, message } from 'antd';
import { useTranslation } from 'react-i18next';
import useGetAllQuery from '../../hooks/api/useGetAllQuery';
import usePutQuery from '../../hooks/api/usePutQuery';
import {ArrowLeftOutlined} from "@ant-design/icons";
import {get} from "lodash";
import {useTelegram} from "../../hooks/telegram/useTelegram.js";

const { Text } = Typography;

const CourierOrderViewPage = () => {
    const { id, roleId, userId } = useParams();
    const { t } = useTranslation();
    const [showReject, setShowReject] = useState(false);
    const [comment, setComment] = useState('');
    const telegram = useTelegram();

    const { data } = useGetAllQuery({
        key: ['courier-order', id],
        url: `/api/web/orders/get/${id}/${userId}`,
        params: { params: { roleId } }
    });

    const order = data?.data || {};
    const status = order.status;

    const confirmDelivery = usePutQuery({listKeyId: ['courier-order']});
    const completeDelivery = usePutQuery({listKeyId: ['courier-order']});

    const handleConfirm = (confirm) => {
        confirmDelivery.mutate({
            url: `/api/web/couriers/confirm-delivery/${id}/${userId}?confirm=${confirm}&comment=${comment || ''}`
        }, {
            onSuccess: () => {
                setShowReject(false);
                message.success(
                    t("Muvoffaqqiyatli tasdiqlandi"),
                    3,
                    () => telegram.onClose()
                );
            }
        });
    };

    const handleComplete = (completedOrReturned) => {
        completeDelivery.mutate({
            url: `/api/web/couriers/complete-delivery/${id}/${userId}?completedOrReturned=${completedOrReturned}`
        }, {
            onSuccess: () => {
                message.success(
                    t("Muvoffaqqiyatli yakunlandi"),
                    3,
                    () => telegram.onClose()
                );
            }
        });
    };

    return (
        <>
            <Button icon={<ArrowLeftOutlined/>} style={{margin: '10px'}} onClick={() => history.back()}>{t("Orqaga")}</Button>
            <Card title={`${t("Buyurtma raqami")}: #${order.code || order.id}`}>
                <p><b>{t("Buyurtmachi")}:</b> {order.client}</p>
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
                <p><b>{t("Menejer")}:</b> {order.manager}</p>
                <p><b>{t("Diler")}:</b> {order.dealer}</p>
                <p><b>{t("Team Lead")}:</b> {order.teamLead}</p>
                {order?.address && (
                    <p>
                        <b>{t("Manzil")}:</b> <a href={order.address} target="_blank" rel="noreferrer">
                        {t("Navigatsiyaga o‘tish")}
                    </a>
                    </p>
                )}
                <p><b>{t("To‘lanishi kerak summa")}:</b> ${order.mustPay}</p>
                <p><b>{t("Yaratuvchi izohi")}:</b> {order.creatorComment || t("Ma'lumot yo‘q")}</p>
                <p><b>{t("Status")}:</b> <Text >{t(status)}</Text></p>
                <p><b>{t("Kuryer uchun izoh")}:</b> {order.courierComment}</p>

                {status === 'WAITING_COURIER' && !showReject && (
                    <>
                        <Button danger block style={{ marginTop: 16 }} onClick={() => setShowReject(true)}>
                            {t("Bekor qilish")}
                        </Button>
                        <Button type="primary" block style={{ marginTop: 8 }} onClick={() => handleConfirm(true)}>
                            {t("Buyurtma qabul qilish")}
                        </Button>
                    </>
                )}

                {status !== 'DELIVERING' && showReject && (
                    <>
                        <Input.TextArea
                            placeholder={t("Izoh qoldiring")}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{ marginTop: 16 }}
                        />
                        <Button type="primary" danger block style={{ marginTop: 8 }} onClick={() => handleConfirm(false)}>
                            {t("Tasdiqlash")}
                        </Button>
                    </>
                )}

                {status === 'DELIVERING' && (
                    <>
                        <Button danger block style={{ marginTop: 16 }} onClick={() => handleComplete(false)}>
                            {t("Bekor qilindi")}
                        </Button>
                        <Button type="primary" block style={{ marginTop: 8 }} onClick={() => handleComplete(true)}>
                            {t("Buyurtma yetkazib berildi")}
                        </Button>
                    </>
                )}
            </Card>
        </>
    );
};

export default CourierOrderViewPage;

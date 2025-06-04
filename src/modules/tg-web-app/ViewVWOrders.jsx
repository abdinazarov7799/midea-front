import React from 'react';
import { useParams } from 'react-router-dom';
import {Card, Typography, Button} from 'antd';
import useGetAllQuery from '../../hooks/api/useGetAllQuery';
import {useTranslation} from "react-i18next";
import {ArrowLeftOutlined} from "@ant-design/icons";
const {Text} = Typography;
const ViewVWOrdersPage = () => {
const { id, roleId, userId } = useParams();
const { t } = useTranslation();

const { data } = useGetAllQuery({
    key: ['order', id],
    url: `/api/web/orders/get/${id}/${userId}`,
    params: { params: { roleId } }
});

const order = data?.data || {};
const status = order.status;

return (
    <>
        <Button icon={<ArrowLeftOutlined/>} style={{margin: '10px'}} onClick={() => history.back()}>{t("Orqaga")}</Button>
        <Card title={`${t("Buyurtma raqami")}: #${order?.code || order?.id}`}>
            <p><b>{t("Buyurtmachi")}:</b> {order?.client}</p>
            <p><b>{t("Mahsulotlar")}:</b></p>
            {order?.items?.map((item, i) => (
                <p key={i}><b>L {item?.product?.model}</b> x {item?.quantity} {t("dona")}</p>
            ))}
            <p><b>{t("Menejer")}:</b> {order?.manager}</p>
            <p><b>{t("Diler")}:</b> {order?.dealer}</p>
            <p><b>{t("Team Lead")}:</b> {order?.teamLead}</p>
            {order?.address && (
                <p>
                    <b>{t("Manzil")}:</b> <a href={order?.address} target="_blank" rel="noreferrer">
                    {t("Navigatsiyaga o‘tish")}
                </a>
                </p>
            )}
            <p><b>{t("To‘lanishi kerak summa")}:</b> ${order?.mustPay}</p>
            <p><b>{t("Yaratuvchi izohi")}:</b> {order?.creatorComment || t("Ma'lumot yo‘q")}</p>
            <p><b>{t("Status")}:</b> <Text >{t(status)}</Text></p>
            <p><b>{t("Kuryer uchun izoh")}:</b> {order?.courierComment}</p>
        </Card>
    </>
);
};
export default ViewVWOrdersPage;

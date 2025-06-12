import React from 'react';
import {useParams} from 'react-router-dom';
import {Card, Typography, Button, Space, message} from 'antd';
import useGetAllQuery from '../../hooks/api/useGetAllQuery';
import {useTranslation} from "react-i18next";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {get} from "lodash";
import Container from "../../components/Container.jsx";
import config from "../../config.js";
import usePutQuery from "../../hooks/api/usePutQuery.js";
import {useTelegram} from "../../hooks/telegram/useTelegram.js";

const {Text} = Typography;

const ViewOrdersPage = () => {
    const {id, roleId, userId} = useParams();
    const {t} = useTranslation();
    const telegram = useTelegram();

    const {data} = useGetAllQuery({
        key: ['order', id],
        url: `/api/web/orders/get/${id}/${userId}`,
        params: {params: {roleId}}
    });

    const order = data?.data || {};
    const status = order.status;

    const {mutate, isLoading} = usePutQuery({hideSuccessToast: true,listKeyId: ['order']})

    const returnOrder = () => {
        mutate({
            url: `/api/web/orders/return-completed/${id}/${userId}`,
        }, {
            onSuccess: () => {
                message.success(
                    t("Muvoffaqqiyatli"),
                    3,
                    () => telegram.onClose()
                );
            }
        });
    }

    return (
        <Container>
            <Space direction="vertical" style={{width: '100%'}} size={'middle'}>
                <Button icon={<ArrowLeftOutlined/>} onClick={() => history.back()}>{t("Orqaga")}</Button>
                <Card title={`${t("Buyurtma raqami")}: #${order?.code || order?.id}`}>
                    <p><b>{t("Warehouse")}:</b> {order?.warehouse}</p>
                    <p><b>{t("Buyurtmachi")}:</b> {order?.client}</p>
                    <p><b>{t("Mahsulotlar")}:</b></p>
                    {
                        get(order, 'sectionItems', [])?.map((item, index) => {
                            return (
                                <Card
                                    key={index}
                                    title={`${t("Section")}: ${get(item, 'sectionName') ?? '-'}`}
                                    style={{margin: '10px 0'}}
                                    styles={{body: {padding: 8}, header: {padding: '0 8px'}}}
                                >
                                    {item?.items?.map((item, i) => (
                                        <p key={i}><b>L {item?.product?.model}</b> x {item?.quantity} {t("dona")}</p>
                                    ))}
                                </Card>
                            )
                        })
                    }
                    <p><b>{t("Menejer")}:</b> {order?.manager}</p>
                    <p><b>{t("Diler")}:</b> {order?.dealer}</p>
                    <p><b>{t("Team Lead")}:</b> {order?.teamLead}</p>
                    <p><b>{t("Courier")}:</b> {order?.courier}</p>
                    {order?.address && (
                        <p>
                            <b>{t("Manzil")}:</b> <a href={order?.address} target="_blank" rel="noreferrer">
                            {t("Navigatsiyaga o‘tish")}
                        </a>
                        </p>
                    )}
                    <p><b>{t("To‘lanishi kerak summa")}:</b> ${order?.mustPay}</p>
                    <p><b>{t("Yaratuvchi izohi")}:</b> {order?.creatorComment || t("Ma'lumot yo‘q")}</p>
                    <p><b>{t("Status")}:</b> <Text>{t(status)}</Text></p>
                    <p><b>{t("Warehouse worker izohi")}:</b> {order?.warehouseWorkerComment}</p>
                    <p><b>{t("Kuryer izohi")}:</b> {order?.courierComment}</p>
                </Card>
                {status === config.ORDER_STATUS.COMPLETED && (
                    <Button
                        loading={isLoading}
                        onClick={returnOrder}
                        type={'primary'}
                        danger
                        block
                    >
                        {t("Buyurtmani qaytarish")}
                    </Button>
                )}
            </Space>
        </Container>
    );
};
export default ViewOrdersPage;

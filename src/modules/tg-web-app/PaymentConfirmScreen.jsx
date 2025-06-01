import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Typography, message, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import usePutQuery from '../../hooks/api/usePutQuery';
import useGetAllQuery from "../../hooks/api/useGetAllQuery.js";
import Container from '../../components/Container';

const PaymentConfirmScreen = () => {
    const { t } = useTranslation();
    const { id, userId } = useParams();

    const { data, isLoading } = useGetAllQuery({
        key: ['payment-detail', id],
        url: `/api/web/payments/get/${id}/${userId}`
    });

    const confirmPayment = usePutQuery({});

    const handleConfirm = () => {
        confirmPayment.mutate({
            url: `/api/web/payments/confirm/${id}/${userId}`
        }, {
            onSuccess: () => message.success(t("Pul tasdiqlandi"))
        });
    };

    const payment = data?.data;

    return (
        <Container>
            <Card>
                {isLoading ? (
                    <Spin />
                ) : (
                    <>
                        <Typography.Paragraph>
                            <b>{payment?.payer}</b> {payment?.amount}$ {t("pul berganini tasdiqlang")}
                        </Typography.Paragraph>
                        <Button type="primary" block style={{ marginTop: 16 }} onClick={handleConfirm}>
                            {t("Tasdiqlash")}
                        </Button>
                    </>
                )}
            </Card>
        </Container>
    );
};

export default PaymentConfirmScreen;

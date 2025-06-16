import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {Card, Typography, InputNumber, Button, message, Select} from 'antd';
import { useTranslation } from 'react-i18next';
import useGetAllQuery from '../../hooks/api/useGetAllQuery';
import usePostQuery from '../../hooks/api/usePostQuery';
import {useTelegram} from "../../hooks/telegram/useTelegram.js";

const BalanceScreen = () => {
    const { t } = useTranslation();
    const { userId } = useParams();
    const [amount, setAmount] = useState(0);
    const [method, setMethod] = useState('CASH');
    const telegram = useTelegram();

    const { data } = useGetAllQuery({
        key: ['balance', userId],
        url: `/api/web/payments/get-balance/${userId}`
    });

    const createPayment = usePostQuery({});

    const handleSubmit = () => {
        if (amount <= 0) return message.error(t("Miqdor 0 dan katta bo‘lishi kerak"));

        createPayment.mutate({
            url: `/api/web/payments/${userId}?amount=${amount}&method=${method}`,
        }, {
            onSuccess: () => {
                setAmount(0);
                message.success(
                    t("So'rov yuborildi"),
                    3,
                    () => telegram.onClose()
                );
            }
        });
    };

    return (
        <Card title={t("Beriladigan summani kiriting (dollarda)")}>
            <Select
                style={{width: '100%'}}
                placeholder={t("Method")}
                allowClear
                value={method}
                options={[
                    {
                        label: 'Cash',
                        value: 'CASH'
                    },
                    {
                        label: 'Card',
                        value: 'CARD'
                    },
                ]}
                onChange={(value) => {
                    setMethod(value)
                }}
            />
            <InputNumber
                min={1}
                value={amount}
                onChange={setAmount}
                style={{ width: '100%', margin: '12px 0' }}
            />
            <Button block type="primary" onClick={handleSubmit}>
                {t("Yuborish")}
            </Button>

            <Typography.Paragraph style={{ marginTop: 20 }}>
                <b>{t("Sizning rolingiz")}:</b> {data?.data?.role || '-'}<br />
                <b>{t("FIO")}:</b> {data?.data?.fullName || '-'}<br />
                <b>{t("Phone")}:</b> {data?.data?.phone || '-'}<br />
                <b>{t("Balans")}:</b> $ {data?.data?.balance || 0}
            </Typography.Paragraph>

            <Typography.Text type="warning">
                {t("Esda tuting, qarzingizdan faqatgina yuqorida pul berganligingiz tasdiqlansagina qutulishingiz mumkin.")}
            </Typography.Text>
        </Card>
    );
};

export default BalanceScreen;

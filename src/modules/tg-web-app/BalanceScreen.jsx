import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, InputNumber, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import useGetAllQuery from '../../hooks/api/useGetAllQuery';
import usePostQuery from '../../hooks/api/usePostQuery';
import Container from '../../components/Container';

const BalanceScreen = () => {
    const { t } = useTranslation();
    const { userId } = useParams();
    const [amount, setAmount] = useState(0);

    const { data } = useGetAllQuery({
        key: ['balance', userId],
        url: `/api/web/payments/get-balance/${userId}`
    });

    const createPayment = usePostQuery({});

    const handleSubmit = () => {
        if (amount <= 0) return message.error(t("Miqdor 0 dan katta bo‘lishi kerak"));

        createPayment.mutate({
            url: `/api/web/payments/${userId}`,
            attributes: { amount }
        }, {
            onSuccess: () => {
                message.success(t("So‘rov yuborildi"));
                setAmount(0);
            }
        });
    };

    return (
        <Container>
            <Card title={t("Beriladigan summani kiriting (dollarda)")}>
                <InputNumber
                    min={1}
                    value={amount}
                    onChange={setAmount}
                    style={{ width: '100%', marginBottom: 12 }}
                />
                <Button block type="primary" onClick={handleSubmit}>
                    {t("Tasdiqlash")}
                </Button>

                <Typography.Paragraph style={{ marginTop: 20 }}>
                    <b>{t("Sizning rolingiz")}:</b> {t("Menejer")}<br />
                    <b>{t("FIO")}:</b> Diyorbek Abdinazarov<br />
                    <b>{t("Balans")}:</b> $ {data?.data?.balance || 0}
                </Typography.Paragraph>

                <Typography.Text type="warning">
                    {t("Esda tuting, qarzingizdan faqatgina yuqorida pul berganligingiz tasdiqlansagina qutulishingiz mumkin.")}
                </Typography.Text>
            </Card>
        </Container>
    );
};

export default BalanceScreen;

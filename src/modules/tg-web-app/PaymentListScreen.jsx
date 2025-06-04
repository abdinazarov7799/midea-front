import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { List, Tag, Typography, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import useGetAllQuery from '../../hooks/api/useGetAllQuery';
import Container from '../../components/Container';
import dayjs from 'dayjs';

const PaymentListScreen = () => {
    const { t } = useTranslation();
    const { userId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading } = useGetAllQuery({
        key: ['payments', userId],
        url: `/api/web/payments/get/${userId}`
    });

    const payments = data?.data?.content || [];

    const getColor = (item) => {
        if (!item.confirmed) return 'warning';
        if (!item?.income) return 'error';
        if (item?.income) return 'success';
        return 'success';
    };

    const getStatusText = (item) => {
        if (!item?.confirmed) return t("Tasdiqlanishi kerak");
        if (!item?.income) return t("Chiqim");
        if (item?.income) return  t("Tushum");
    };

    const getActionLabel = (action) => {
        switch (action) {
            case 'PENALTY':
                return t("Jarima");
            case 'COMPLETE_ORDER':
                return t("Buyurtma");
            case 'ACCRUAL':
                return t("To‘lov");
            default:
                return action;
        }
    };

    return (
        <Container>
            <List
                loading={isLoading}
                dataSource={payments}
                renderItem={(item) => {
                    const color = getColor(item);
                    const amount = item.action === 'ACCRUAL' ?  `+${item.amount}$` : `-${item.amount}$`;

                    return (
                        <Card
                            size="small"
                            style={{ marginBottom: 12, cursor: !item.confirmed ? 'pointer' : 'default' }}
                            onClick={() => !item.confirmed && navigate(`/payments/confirm/${item.id}/${userId}`)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography.Text strong>
                                    {getActionLabel(item.action)} | {amount}
                                </Typography.Text>
                                <Tag color={color}>{getStatusText(item)}</Tag>
                            </div>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                                {item.receiver} | {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')}
                            </Typography.Text>
                        </Card>
                    );
                }}
            />
        </Container>
    );
};

export default PaymentListScreen;

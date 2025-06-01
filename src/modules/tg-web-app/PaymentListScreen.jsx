import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { List, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import useGetAllQuery from '../../hooks/api/useGetAllQuery';
import Container from '../../components/Container';

const PaymentListScreen = () => {
    const { t } = useTranslation();
    const { userId } = useParams();
    const navigate = useNavigate();

    const { data } = useGetAllQuery({
        key: ['payments', userId],
        url: `/api/web/payments/get/${userId}`
    });

    const payments = data?.data || [];

    const getColor = (item) => {
        if (!item.confirmed) return 'warning';   // sariq
        if (item.amount < 0) return 'error';     // qizil
        return 'success';                        // yashil
    };

    const getText = (item) => {
        const amount = item.amount > 0 ? `+${item.amount}` : `${item.amount}`;
        if (!item.confirmed) return `${t("Tushum raqami")}: ${item.id} - ${amount}$`;
        return `${t("Tushum raqami")}: ${item.id} ${item.orderId ? `| ${t("Zakaz")}: ${item.orderId}` : ''} - ${amount}$`;
    };

    return (
        <Container>
            <List
                dataSource={payments}
                renderItem={(item) => (
                    <List.Item onClick={() => !item.confirmed && navigate(`/payments/confirm/${item.id}/${userId}`)}>
                        <Tag color={getColor(item)}>{getText(item)}</Tag>
                    </List.Item>
                )}
            />
        </Container>
    );
};

export default PaymentListScreen;

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {List, Card, Flex, Typography} from 'antd';
import Container from '../../components/Container.jsx';
import useGetAllQuery from '../../hooks/api/useGetAllQuery.js';
import { get } from 'lodash';
import {useTranslation} from "react-i18next";
import {getStatusColor} from "../../utils/index.js";

const ReturnedOrderPage = () => {
    const { userId, roleId } = useParams();
    const navigate = useNavigate();
    const {t} = useTranslation();

    const { data, isLoading } = useGetAllQuery({
        key: ['returned-orders', userId],
        url: `/api/web/orders/get-all/${userId}`,
        params: {
            params: {
                status: 'RETURNING',
                roleId,
                page: 0,
                size: 1000
            }
        }
    });

    const orders = get(data, 'data.content', []);

    return (
        <Container>
            <List
                loading={isLoading}
                dataSource={orders}
                renderItem={(order) => (
                    <List.Item>
                        <Card
                            style={{ backgroundColor: getStatusColor(order?.status), width: '100%' }}
                            onClick={() => navigate(`/returned-order-view/${order.id}/${userId}/${roleId}`)}
                        >
                            <Flex justify="space-between" align="center">
                                <Typography.Title level={5}>{t("Buyurtma raqami")}: #{order?.code || order?.id}</Typography.Title>
                                <Typography.Text>{t("Total amount")}: {order?.totalAmount}</Typography.Text>
                            </Flex>
                            <Typography.Text>{t("Status")}: {t(order?.status)}</Typography.Text>
                        </Card>
                    </List.Item>
                )}
            />
        </Container>
    );
};

export default ReturnedOrderPage;

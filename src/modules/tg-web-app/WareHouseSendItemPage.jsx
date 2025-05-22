import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {List, Card, Typography, Flex} from 'antd';
import Container from '../../components/Container.jsx';
import useGetAllQuery from '../../hooks/api/useGetAllQuery';
import { get } from 'lodash';
import {useTranslation} from "react-i18next";

const WarehouseSendItemPage = () => {
    const { roleId, userId } = useParams();
    const navigate = useNavigate();
    const {t} = useTranslation();

    const { data, isLoading } = useGetAllQuery({
        key: ['send-item-orders', userId],
        url: `/api/web/orders/get-all/${userId}`,
        params: {
            params: {
                roleId
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
                            style={{ backgroundColor: '#fff5cc', width: '100%' }}
                            onClick={() => navigate(`/warehouse-send-item-view/${order.id}/${roleId}/${userId}`)}
                        >
                            <Flex justify="space-between" align="center">
                                <Typography.Title level={5}>{t("Buyurtma raqami")}: #{order?.code || order?.id}</Typography.Title>
                                <Typography.Text>{t("Total amount")}: {order?.totalAmount}</Typography.Text>
                            </Flex>
                        </Card>
                    </List.Item>
                )}
            />
        </Container>
    );
};

export default WarehouseSendItemPage;

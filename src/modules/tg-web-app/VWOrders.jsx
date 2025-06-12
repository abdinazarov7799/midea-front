import React, {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Card, Typography, List, Flex, Select} from 'antd';
import { useTranslation } from 'react-i18next';
import useGetAllQuery from '../../hooks/api/useGetAllQuery';
import Container from '../../components/Container';
import {get} from "lodash";
import {getStatusColor} from "../../utils/index.js";
import config from "../../config.js";

const VWViewOrdersPage = () => {
    const { roleId, userId } = useParams();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [status,setStatus] = useState(null)

    const { data, isLoading } = useGetAllQuery({
        key: ['send-item-orders', userId,status],
        url: `/api/web/orders/get-all/${userId}`,
        params: {
            params: {
                roleId,
                status
            }
        }
    });

    const orders = get(data, 'data.content', []);

    return (
        <Container>
            <Select
                options={Object.values(config.ORDER_STATUS)?.map(status => ({label: t(status), value: status}))}
                value={status}
                style={{width:'100%'}}
                onChange={(value) => setStatus(value)}
            />
            <List
                loading={isLoading}
                dataSource={orders}
                renderItem={(order) => (
                    <List.Item>
                        <Card
                            style={{ backgroundColor: getStatusColor(order?.status), width: '100%' }}
                            onClick={() => navigate(`/view-vw-order/${order.id}/${roleId}/${userId}`)}
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

export default VWViewOrdersPage;

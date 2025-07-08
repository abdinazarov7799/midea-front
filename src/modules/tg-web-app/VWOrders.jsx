import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Typography, List, Flex, Select, Pagination } from 'antd';
import { useTranslation } from 'react-i18next';
import useGetAllQuery from '../../hooks/api/useGetAllQuery';
import Container from '../../components/Container';
import { get } from 'lodash';
import { getStatusColor } from '../../utils/index.js';
import config from '../../config.js';

const VWViewOrdersPage = () => {
    const { roleId, userId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [status, setStatus] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data, isLoading } = useGetAllQuery({
        key: ['send-item-orders', userId, status, currentPage, pageSize],
        url: `/api/web/orders/get-all/${userId}`,
        params: {
            params: {
                roleId,
                status,
                page: currentPage - 1,
                size: pageSize,
            },
        },
    });

    const orders = get(data, 'data.content', []);
    const totalItems = get(data, 'data.totalElements', 0);

    return (
        <Container>
            <Select
                allowClear
                placeholder={t('Statusni tanlang')}
                options={Object.values(config.ORDER_STATUS)?.map((s) => ({
                    label: t(s),
                    value: s,
                }))}
                value={status}
                style={{ width: '100%', marginBottom: 16 }}
                onChange={(value) => {
                    setStatus(value);
                    setCurrentPage(1);
                }}
            />
            <List
                loading={isLoading}
                dataSource={orders}
                renderItem={(order) => (
                    <List.Item>
                        <Card
                            style={{
                                backgroundColor: getStatusColor(order?.status),
                                width: '100%',
                                cursor: 'pointer',
                            }}
                            onClick={() => navigate(`/view-vw-order/${order.id}/${roleId}/${userId}`)}
                        >
                            <Flex justify="space-between" align="center">
                                <Typography.Title level={5}>
                                    {t('Buyurtma raqami')}: #{order?.code || order?.id}
                                </Typography.Title>
                                <Typography.Text>
                                    {t('Total amount')}: {order?.totalAmount}
                                </Typography.Text>
                            </Flex>
                            <Typography.Text>
                                {t('Status')}: {t(order?.status)}
                            </Typography.Text>
                        </Card>
                    </List.Item>
                )}
            />
            {totalItems > 0 && (
                <Pagination
                    style={{ marginTop: 16, textAlign: 'center' }}
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalItems}
                    showSizeChanger
                    onChange={(page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    }}
                />
            )}
        </Container>
    );
};

export default VWViewOrdersPage;

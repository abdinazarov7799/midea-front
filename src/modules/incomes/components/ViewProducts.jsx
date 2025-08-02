import React from 'react';
import { Table, Typography, Space, Divider } from 'antd';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const ViewProducts = ({ income }) => {
    const { t } = useTranslation();

    if (!income) return null;

    const productColumns = [
        {
            title: t("Model"),
            dataIndex: "model",
            key: "model",
            render: (text, record) => get(record, 'product.model', text)
        },
        {
            title: t("Category"),
            dataIndex: "category",
            key: "category",
            render: (text, record) => get(record, 'product.category.name', text)
        },
        {
            title: t("Quantity"),
            dataIndex: "quantity",
            key: "quantity"
        },
        {
            title: t("Unit Price"),
            dataIndex: "unitPrice",
            key: "unitPrice",
            render: (price) => price ? `${price} $` : '-'
        },
        {
            title: t("Total Price"),
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (price) => price ? `${price} $` : '-'
        }
    ];

    return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
                <Typography.Text strong>{t("ID")}: </Typography.Text>
                <Typography.Text>{income?.id}</Typography.Text>
            </div>
            <div>
                <Typography.Text strong>{t("Warehouse Worker")}: </Typography.Text>
                <Typography.Text>{get(income, 'warehouseWorker.fullName')}</Typography.Text>
            </div>
            <div>
                <Typography.Text strong>{t("Warehouse")}: </Typography.Text>
                <Typography.Text>{get(income, 'warehouse.name')}</Typography.Text>
            </div>
            <div>
                <Typography.Text strong>{t("Warehouse Section")}: </Typography.Text>
                <Typography.Text>{get(income, 'warehouseSection.name')}</Typography.Text>
            </div>
            <div>
                <Typography.Text strong>{t("Dealer")}: </Typography.Text>
                <Typography.Text>{get(income, 'dealer.fullName')}</Typography.Text>
            </div>
            <div>
                <Typography.Text strong>{t("Created at")}: </Typography.Text>
                <Typography.Text>{income?.createdAt ? dayjs(income.createdAt).format("YYYY-MM-DD HH:mm") : "-"}</Typography.Text>
            </div>
            {income?.comment && (
                <div>
                    <Typography.Text strong>{t("Comment")}: </Typography.Text>
                    <Typography.Text>{income.comment}</Typography.Text>
                </div>
            )}

            <Divider>{t("Products")}</Divider>

            <Table
                size="small"
                bordered
                pagination={false}
                dataSource={income?.products || income?.items || []}
                rowKey={(record, index) => get(record, 'id', index)}
                columns={productColumns}
                scroll={{ x: 'max-content' }}
            />

            {(income?.products?.length > 0 || income?.items?.length > 0) && (
                <div style={{ textAlign: 'right', marginTop: 16 }}>
                    <Typography.Text strong>
                        {t("Total Items")}: {(income?.products || income?.items || []).length}
                    </Typography.Text>
                </div>
            )}
        </Space>
    );
};

export default ViewProducts; 
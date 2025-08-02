import React, { useEffect, useState } from 'react';
import { 
    Form, 
    Table, 
    InputNumber, 
    Button, 
    Space, 
    Typography, 
    Divider,
    message,
    Popconfirm
} from 'antd';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import usePutQuery from '../../../hooks/api/usePutQuery.js';
import { KEYS } from '../../../constants/key.js';
import { URLS } from '../../../constants/url.js';
import dayjs from 'dayjs';

const EditProducts = ({ income, setIsModalOpen }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [products, setProducts] = useState([]);

    const { mutate: updateMutate, isLoading } = usePutQuery({
        listKeyId: KEYS.incomes_list,
    });

    useEffect(() => {
        if (income?.products || income?.items) {
            const productList = income?.products || income?.items || [];
            setProducts(productList.map((item, index) => ({ ...item, key: index })));
        }
    }, [income]);

    const handleQuantityChange = (key, value) => {
        setProducts(prev => 
            prev.map(item => 
                item.key === key 
                    ? { 
                        ...item, 
                        quantity: value,
                        totalPrice: (value || 0) * (item.unitPrice || 0)
                    }
                    : item
            )
        );
    };

    const handleUnitPriceChange = (key, value) => {
        setProducts(prev => 
            prev.map(item => 
                item.key === key 
                    ? { 
                        ...item, 
                        unitPrice: value,
                        totalPrice: (item.quantity || 0) * (value || 0)
                    }
                    : item
            )
        );
    };

    const handleRemoveProduct = (key) => {
        setProducts(prev => prev.filter(item => item.key !== key));
    };

    const handleSave = () => {
        const updatedProducts = products.map(({ key, ...product }) => product);
        
        updateMutate(
            {
                url: `${URLS.incomes_edit}/${income.id}`,
                attributes: {
                    products: updatedProducts
                }
            },
            {
                onSuccess: () => {
                    message.success(t("Products updated successfully"));
                    setIsModalOpen(false);
                },
                onError: () => {
                    message.error(t("Failed to update products"));
                }
            }
        );
    };

    const columns = [
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
            key: "quantity",
            width: 120,
            render: (value, record) => (
                <InputNumber
                    min={0}
                    value={value}
                    onChange={(val) => handleQuantityChange(record.key, val)}
                    style={{ width: '100%' }}
                />
            )
        },
        {
            title: t("Unit Price"),
            dataIndex: "unitPrice",
            key: "unitPrice",
            width: 120,
            render: (value, record) => (
                <InputNumber
                    min={0}
                    value={value}
                    onChange={(val) => handleUnitPriceChange(record.key, val)}
                    style={{ width: '100%' }}
                    addonAfter="$"
                />
            )
        },
        {
            title: t("Total Price"),
            dataIndex: "totalPrice",
            key: "totalPrice",
            width: 120,
            render: (value) => (
                <Typography.Text strong>
                    {value ? `${value.toFixed(2)} $` : '0.00 $'}
                </Typography.Text>
            )
        },
        {
            title: t("Actions"),
            key: "actions",
            width: 80,
            render: (_, record) => (
                <Popconfirm
                    title={t("Delete")}
                    description={t("Are you sure to delete this product?")}
                    onConfirm={() => handleRemoveProduct(record.key)}
                    okText={t("Yes")}
                    cancelText={t("No")}
                >
                    <Button 
                        danger 
                        icon={<DeleteOutlined />} 
                        size="small"
                    />
                </Popconfirm>
            )
        }
    ];

    const totalQuantity = products.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalPrice = products.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

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

            <Divider>{t("Edit Products")}</Divider>

            <Table
                size="small"
                bordered
                pagination={false}
                dataSource={products}
                columns={columns}
                scroll={{ x: 'max-content' }}
            />

            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '16px',
                backgroundColor: '#f5f5f5',
                borderRadius: '6px'
            }}>
                <Space size="large">
                    <Typography.Text strong>
                        {t("Total Items")}: {products.length}
                    </Typography.Text>
                    <Typography.Text strong>
                        {t("Total Quantity")}: {totalQuantity}
                    </Typography.Text>
                    <Typography.Text strong>
                        {t("Total Price")}: {totalPrice.toFixed(2)} $
                    </Typography.Text>
                </Space>
            </div>

            <div style={{ textAlign: 'right', marginTop: 16 }}>
                <Button 
                    type="primary" 
                    icon={<SaveOutlined />}
                    onClick={handleSave}
                    loading={isLoading}
                    size="large"
                >
                    {t("Save Changes")}
                </Button>
            </div>
        </Space>
    );
};

export default EditProducts; 
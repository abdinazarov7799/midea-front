import React, { useState } from 'react';
import { Form, Select, InputNumber, Button, Table } from 'antd';
import Container from "../../components/Container.jsx";
import { DeleteOutlined } from '@ant-design/icons';
import useGetAllQuery from "../../hooks/api/useGetAllQuery.js";
import usePostQuery from "../../hooks/api/usePostQuery.js";
import { useParams } from "react-router-dom";
import { get } from 'lodash';
import {useTelegram} from "../../hooks/telegram/useTelegram.js";
import {useTranslation} from "react-i18next";

const AddStockPage = () => {
    const [form] = Form.useForm();
    const { userId } = useParams();
    const telegram = useTelegram();
    const [items, setItems] = useState([]);
    const {t} = useTranslation();

    const { data: productsData, isLoading: loadingProducts } = useGetAllQuery({
        key: ['product-list'],
        url: '/api/web/products/get',
        params: {
            params: {
                page: 0,
                size: 1000
            }
        }
    });

    const { data: sectionsData } = useGetAllQuery({
        key: ['section-list'],
        url: `/api/web/warehouse-sections/get/${userId}`,
        params: {
            params: {
                page: 0,
                size: 1000
            }
        }
    });

    const { data: stocksData, isLoading: stocksIsLoading } = useGetAllQuery({
        key: ['stocks-list'],
        url: `/api/web/warehouse-workers/get-stocks/${userId}`,
        params: {
            params: {
                page: 0,
                size: 1000
            }
        }
    });

    const { mutate, isLoading: submitting } = usePostQuery({});

    const productOptions = get(productsData, 'data.content', []).map(p => ({
        label: p.model,
        value: p.id
    }));

    const sectionOptions = get(sectionsData, 'data.content', []).map(s => ({
        label: s.name,
        value: s.id
    }));

    const addItem = () => {
        setItems([...items, { productId: null, quantity: 0 }]);
    };

    const updateItem = (index, key, value) => {
        const updated = [...items];
        updated[index][key] = value;
        setItems(updated);
    };

    const removeItem = (index) => {
        const updated = [...items];
        updated.splice(index, 1);
        setItems(updated);
    };

    const onFinish = (values) => {
        mutate({
            url: `/api/web/warehouse-workers/add-stock/${userId}`,
            attributes: {
                sectionId: values.sectionId,
                items
            }
        },{
            onSuccess: data => {
                telegram.onClose()
            }
        });
    };

    return (
        <Container>
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <label style={{ fontWeight: 500 }}>{t("Mahsulotlarni tanlang va qo‘shing")}</label>
                {items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <Select
                            placeholder={t("Tanlash")}
                            style={{ flex: 2 }}
                            showSearch
                            loading={loadingProducts}
                            options={productOptions}
                            value={item.productId}
                            onChange={(val) => updateItem(index, 'productId', val)}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                        <InputNumber
                            min={1}
                            value={item.quantity}
                            onChange={(val) => updateItem(index, 'quantity', val)}
                            style={{ flex: 1 }}
                        />
                        <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => removeItem(index)}
                        />
                    </div>
                ))}

                <Button block onClick={addItem}>
                    {t("Mahsulot qo‘shish")}
                </Button>

                <Form.Item
                    name="sectionId"
                    label={t("Omborxona bo‘limini tanlang:")}
                    rules={[{ required: true }]}
                    style={{ marginTop: 16 }}
                >
                    <Select placeholder="Tanlash" options={sectionOptions} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={submitting}>
                        {t("Tasdiqlash")}
                    </Button>
                </Form.Item>
            </Form>

            <Table
                size="small"
                style={{ marginTop: 20 }}
                pagination={false}
                dataSource={get(stocksData, 'data.content', [])}
                columns={[
                    { title: 'Model', dataIndex: 'product' },
                    { title: 'Sklad bo‘limi', dataIndex: 'section' },
                    { title: 'Quantity', dataIndex: 'quantity' },
                ]}
            />
        </Container>
    );
};

export default AddStockPage;

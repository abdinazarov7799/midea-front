import React, {useEffect, useState} from 'react';
import {Form, Button, Select, InputNumber, Switch, message} from 'antd';
import Container from "../../components/Container.jsx";
import { useTranslation } from "react-i18next";
import { get } from 'lodash';
import useGetAllQuery from '../../hooks/api/useGetAllQuery';
import usePostQuery from '../../hooks/api/usePostQuery';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import TextArea from "antd/es/input/TextArea";
import {useTelegram} from "../../hooks/telegram/useTelegram.js";

const CreateOrderPage = () => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const { userId, roleId,dealerId } = useParams();
    const navigate = useNavigate();
    const telegram = useTelegram()
    const [items, setItems] = useState([]);
    const params = new URLSearchParams(window.location.search)
    const clientId = params.get('clientId');

    const { data: clientsData } = useGetAllQuery({
        key: ['client-list', userId],
        url: `/api/web/clients/get-all/${userId}`,
        params: {
            params: {
                page: 0,
                size: 1000,
            }
        }
    });

    const { data: warehousesData } = useGetAllQuery({
        key: ['warehouse-list'],
        url: '/api/web/warehouses/get',
        params: {
            params: {
                page: 0,
                size: 1000,
                dealerId
            }
        }
    });

    const { data: productsData, isLoading: isLoadingProducts } = useGetAllQuery({
        key: ['product-list'],
        url: '/api/web/products/get',
        params: {
            params: {
                page: 0,
                size: 1000,
                dealerId
            }
        }
    });

    useEffect(() => {
        if (clientId) {
            form.setFieldsValue({ clientId });
        }
    }, [clientId]);

    const { mutate, isLoading: creating } = usePostQuery({hideSuccessToast: true});

    const clientOptions = get(clientsData, 'data.content', [])?.map(c => ({
        label: c.name,
        value: c.id
    }));

    const warehouseOptions = get(warehousesData, 'data.content', [])?.map(w => ({
        label: w.name,
        value: w.id
    }));

    const productOptions = get(productsData, 'data.content', [])?.map(p => ({
        label: p.model,
        value: p.id
    }));

    const addProduct = () => {
        setItems([...items, { productId: null, quantity: 0 }]);
    };

    const updateItem = (index, key, value) => {
        const newList = [...items];
        newList[index][key] = value;
        setItems(newList);
    };

    const removeItem = (index) => {
        const newList = [...items];
        newList.splice(index, 1);
        setItems(newList);
    };

    const onFinish = (values) => {
        mutate({
            url: "/api/web/orders/create",
            attributes: {
                ...values,
                creatorId: userId,
                creatorRoleId: roleId,
                dealerId: dealerId,
                items
            }
        },{
            onSuccess: () => {
                message.success(
                    t("Muvoffaqqiyatli yaratildi"),
                    3,
                    () => telegram.onClose()
                );
            }
        });
    };

    return (
        <Container>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Form.Item name="clientId" label={t("Klient tanlang yoki qo‘shing")} rules={[{ required: true }]} style={{ flex: 1 }}>
                        <Select
                            placeholder={t("Tanlash")}
                            options={clientOptions}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Form.Item>
                    <Button type="primary" onClick={() => navigate(`/create-client-form/${roleId}/${userId}?hasBack=true&dealerId=${dealerId}`)}>
                        {t("Yangi qo‘shish")}
                    </Button>
                </div>

                <Form.Item name="warehouseId" label="Omborxonani tanlang" rules={[{ required: true }]}>
                    <Select placeholder={t("Tanlash")} options={warehouseOptions} />
                </Form.Item>

                <div>
                    <label style={{ fontWeight: 500 }}>{t("Mahsulotlarni tanlang va qo‘shing")}</label>
                    {items.map((item, index) => (
                        <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                            <Select
                                placeholder={t("Tanlash")}
                                style={{ flex: 2 }}
                                showSearch
                                loading={isLoadingProducts}
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
                    <Button block onClick={addProduct}>
                        {t("Mahsulot qo‘shish")}
                    </Button>
                </div>

                <Form.Item
                    name="comment"
                    label={t("Comment")}
                >
                    <TextArea />
                </Form.Item>

                <Form.Item
                    name="mustPay"
                    label={t("Must pay")}
                    initialValue={0}
                >
                    <InputNumber style={{width:'100%'}} defaultValue={0} />
                </Form.Item>

                <Form.Item
                    name="delivery"
                    label={t("Buyurtma mijozga yetkazilishi kerak:")}
                    valuePropName="checked"
                    initialValue={false}
                >
                    <Switch />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={creating}>
                        {t("Buyurtmani tasdiqlash")}
                    </Button>
                </Form.Item>
            </Form>
        </Container>
    );
};

export default CreateOrderPage;

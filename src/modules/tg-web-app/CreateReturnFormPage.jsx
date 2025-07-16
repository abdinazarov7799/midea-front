import React, { useState } from 'react';
import { Form, Button, Select, InputNumber, message } from 'antd';
import Container from '../../components/Container.jsx';
import { useTranslation } from 'react-i18next';
import useGetAllQuery from '../../hooks/api/useGetAllQuery';
import usePostQuery from '../../hooks/api/usePostQuery';
import { useNavigate, useParams } from 'react-router-dom';
import TextArea from 'antd/es/input/TextArea';
import {useTelegram} from "../../hooks/telegram/useTelegram.js";

const CreateReturnFormPage = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { userId, roleId, dealerId } = useParams();
  const telegram = useTelegram();
  const [items, setItems] = useState([]);

  const { data: clientsData } = useGetAllQuery({
    key: ['client-list', userId],
    url: `/api/web/clients/get-all/${userId}`
  });
  const { data: warehousesData } = useGetAllQuery({
    key: ['warehouse-list'],
    url: '/api/web/warehouses/get',
    params: { params: { dealerId }}
  });
  const { data: productsData, isLoading: isLoadingProducts } = useGetAllQuery({
    key: ['product-list'],
    url: '/api/web/products/get',
    params: { params: { page: 0, size: 1000 } }
  });

  const clientOptions = (clientsData?.data?.content || []).map(c => ({ label: c.name, value: c.id }));
  const warehouseOptions = (warehousesData?.data?.content || []).map(w => ({ label: w.name, value: w.id }));
  const productOptions = (productsData?.data?.content || []).map(p => ({ label: p.model, value: p.id }));

  const addProduct = () => setItems([...items, { productId: null, quantity: 1 }]);
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

  const { mutate, isLoading } = usePostQuery({ hideSuccessToast: true });

  const onFinish = (values) => {
    if (!items.length) return message.warning(t('Mahsulotlar bo‘sh bo‘lishi mumkin emas!'));
    if (items.some(i => !i.productId || !i.quantity)) return message.warning(t('Mahsulot va miqdor to‘ldirilishi shart!'));
    mutate({
      url: '/api/web/returns/create',
      attributes: {
        ...values,
        creatorId: userId,
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity }))
      }
    }, {
      onSuccess: () => {
        message.success(t('Qaytarish yaratildi!'),3,
            () => telegram.onClose());
      }
    });
  };

  return (
    <Container>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="clientId" label={t('Klient tanlang yoki qo‘shing')} rules={[{ required: true }]}> 
          <Select placeholder={t('Tanlash')} options={clientOptions} showSearch />
        </Form.Item>
        <Form.Item name="warehouseId" label={t('Omborxonani tanlang')} rules={[{ required: true }]}> 
          <Select placeholder={t('Tanlash')} options={warehouseOptions} showSearch />
        </Form.Item>
        <div>
          <label style={{ fontWeight: 500 }}>{t('Mahsulotlarni tanlang va qo‘shing')}</label>
          {items.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <Select
                placeholder={t('Tanlash')}
                style={{ flex: 2 }}
                showSearch
                loading={isLoadingProducts}
                options={productOptions}
                value={item.productId}
                onChange={val => updateItem(index, 'productId', val)}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              />
              <InputNumber
                min={1}
                value={item.quantity}
                onChange={val => updateItem(index, 'quantity', val)}
                style={{ flex: 1 }}
              />
              <Button danger type="text" onClick={() => removeItem(index)}>X</Button>
            </div>
          ))}
          <Button block onClick={addProduct}>{t('Mahsulot qo‘shish')}</Button>
        </div>
        <Form.Item name="comment" label={t('Izoh')}> <TextArea /> </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={isLoading}>{t('Qaytarishni yaratish')}</Button>
        </Form.Item>
      </Form>
    </Container>
  );
};

export default CreateReturnFormPage; 

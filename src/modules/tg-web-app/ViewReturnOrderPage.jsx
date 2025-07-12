import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {Card, Button, Typography, message, Space, Modal, Select, Form} from 'antd';
import Container from '../../components/Container.jsx';
import useGetAllQuery from '../../hooks/api/useGetAllQuery';
import usePutQuery from '../../hooks/api/usePutQuery';
import { useTranslation } from 'react-i18next';
import { useTelegram } from '../../hooks/telegram/useTelegram.js';
import config from "../../config.js";
import {get} from "lodash";

const { Text } = Typography;

const ViewReturnOrderPage = () => {
  const { userId,roleId } = useParams();
  const { t } = useTranslation();
  const telegram = useTelegram();
    const [sectionsMap, setSectionsMap] = useState({});

    const { data, isLoading } = useGetAllQuery({
    key: ['return-order', userId],
    url: `/api/web/returns/get-all/${userId}`
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

    const sectionOptions = get(sectionsData, 'data.content', [])?.map(s => ({
        label: s.name,
        value: s.id
    }));

  const { mutate, isLoading: confirming } = usePutQuery({ hideSuccessToast: true });

  const [selectedOrder, setSelectedOrder] = useState(null);

  const page = data?.data;
  const orders = page?.content || [];

    const openConfirmModal = (order) => {
        setSelectedOrder(order);

        // Modal ochilganda productlar uchun default sectionId null qilib qo'yamiz
        const initialSections = {};
        order.items.forEach(item => {
            initialSections[item.productId] = null;
        });
        setSectionsMap(initialSections);
    };


    const handleSectionChange = (productId, value) => {
    setSectionsMap(prev => ({
        ...prev,
        [productId]: value
    }));
};
    const handleConfirm = () => {
        if (!selectedOrder) return;

        // check that all products have sectionId selected
        const missingSection = selectedOrder.items.find(item => !sectionsMap[item.productId]);
        if (missingSection) {
            message.error(t('Iltimos, barcha mahsulotlar uchun ombor bo‘limini tanlang'));
            return;
        }

        mutate(
            {
                url: `/api/web/returns/confirm/${selectedOrder.id}/${userId}`,
                attributes: {
                    comment: t('Qaytarish qabul qilindi'),
                    products: selectedOrder.items.map(item => ({
                        sectionId: sectionsMap[item.productId],  // har bir product uchun alohida sectionId
                        productId: item.productId,
                        quantity: item.quantity
                    }))
                }
            },
            {
                onSuccess: () => {
                    message.success(t('Qaytarish muvaffaqiyatli qabul qilindi!'));
                    telegram.onClose();
                    setSelectedOrder(null);
                    setSectionsMap({});
                }
            }
        );
    };

  return (
      <Container>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {isLoading ? (
              <Text>{t('Yuklanmoqda...')}</Text>
          ) : orders.length === 0 ? (
              <Text>{t('Hech qanday qaytarmalar topilmadi')}</Text>
          ) : (
              orders.map(order => (
                  <Card
                      key={order.id}
                      title={`${t('Qaytarish raqami')}: #${order.id}`}
                  >
                    <p><b>{t('Ombor')}:</b> {order.warehouse}</p>
                    <p><b>{t('Buyurtmachi')}:</b> {order.client}</p>
                    <p><b>{t('Mahsulotlar')}:</b></p>
                    <ul>
                      {order.items.map(item => (
                          <li key={item.productId}>
                            <Text strong>{item.model}</Text> × {item.quantity} {t('dona')}
                          </li>
                      ))}
                    </ul>
                    <p><b>{t('Menejer')}:</b> {order.manager}</p>
                    <p><b>{t('Diler')}:</b> {order.dealer}</p>
                    <p><b>{t('Team Lead')}:</b> {order.teamLead}</p>
                    <p><b>{t('Skladchi')}:</b> {order.warehouseWorker}</p>
                    <p><b>{t('Yaratilgan vaqti')}:</b> {order.createdAt}</p>
                    <p><b>{t('Qabul qilingan vaqti')}:</b> {order.confirmedAt}</p>
                    <p><b>{t('Status')}:</b> <Text>{t(order.status)}</Text></p>
                    <p><b>{t('Izoh')}:</b> {order.creatorComment}</p>
                      {
                          (roleId == config.ROLE_ID.ROLE_WAREHOUSE_WORKER && order.status === "CREATED") && (
                              <Button
                                  type="primary"
                                  block
                                  loading={confirming && selectedOrder?.id === order.id}
                                  onClick={() => openConfirmModal(order)}
                              >
                                  {t('Qaytarishni qabul qilish')}
                              </Button>
                          )
                      }
                  </Card>
              ))
          )}
        </Space>

          <Modal
              title={t('Qaytarishni tasdiqlash')}
              open={!!selectedOrder}
              onOk={handleConfirm}
              onCancel={() => setSelectedOrder(null)}
              confirmLoading={confirming}
              okText={t('Tasdiqlash')}
              cancelText={t('Bekor qilish')}
          >
              <Form layout={'vertical'}>
                  {selectedOrder?.items.map(item => (
                      <Form.Item
                          key={item.productId}
                          label={`${item.model} uchun ${t("Omborxona bo‘limini tanlang:")}`}
                          required
                          style={{ marginTop: 16 }}
                      >
                          <Select
                              placeholder="Tanlash"
                              options={sectionOptions}
                              value={sectionsMap[item.productId]}
                              onChange={(value) => handleSectionChange(item.productId, value)}
                          />
                      </Form.Item>
                  ))}
              </Form>
          </Modal>

      </Container>
  );
};

export default ViewReturnOrderPage;

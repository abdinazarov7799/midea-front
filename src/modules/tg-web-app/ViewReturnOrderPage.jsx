import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Typography, message, Space, Modal } from 'antd';
import Container from '../../components/Container.jsx';
import useGetAllQuery from '../../hooks/api/useGetAllQuery';
import usePutQuery from '../../hooks/api/usePutQuery';
import { useTranslation } from 'react-i18next';
import { useTelegram } from '../../hooks/telegram/useTelegram.js';

const { Text } = Typography;

const ViewReturnOrderPage = () => {
  const { userId } = useParams();
  const { t } = useTranslation();
  const telegram = useTelegram();

  const { data, isLoading } = useGetAllQuery({
    key: ['return-order', userId],
    url: `/api/web/returns/get-all/${userId}`
  });

  const { mutate, isLoading: confirming } = usePutQuery({ hideSuccessToast: true });

  const [selectedOrder, setSelectedOrder] = useState(null);

  const page = data?.data;
  const orders = page?.content || [];

  const openConfirmModal = (order) => {
    setSelectedOrder(order);
  };

  const handleConfirm = () => {
    if (!selectedOrder) return;
    mutate(
        {
          url: `/api/web/returns/confirm/${selectedOrder.id}/${userId}`,
          attributes: {
            comment: t('Qaytarish qabul qilindi'),
            products: selectedOrder.items.map(item => ({
              sectionId: null,              // agar sectionId bo‘lsa kiriting
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
                      extra={
                          order.status === 'CREATED' && (
                              <Button
                                  type="primary"
                                  loading={confirming && selectedOrder?.id === order.id}
                                  onClick={() => openConfirmModal(order)}
                              >
                                {t('Qaytarishni qabul qilish')}
                              </Button>
                          )
                      }
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
                  </Card>
              ))
          )}
        </Space>

        <Modal
            title={t('Tasdiqlash')}
            open={!!selectedOrder}
            onOk={handleConfirm}
            onCancel={() => setSelectedOrder(null)}
            confirmLoading={confirming}
            okText={t('Tasdiqlash')}
            cancelText={t('Bekor qilish')}
        >
          <Text>{t('Qaytarishni qabul qilmoqchimisiz?')}</Text>
        </Modal>
      </Container>
  );
};

export default ViewReturnOrderPage;

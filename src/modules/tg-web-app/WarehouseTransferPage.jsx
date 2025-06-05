import React, { useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Card, Typography, Select, Button, message, Flex} from 'antd';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import useGetAllQuery from '../../hooks/api/useGetAllQuery';
import usePutQuery from '../../hooks/api/usePutQuery';
import { get } from 'lodash';

const { Text } = Typography;

const WarehouseTransferPage = () => {
    const { roleId,userId } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [fromSectionId, setFromSectionId] = useState(null);

    const { data: transferData } = useGetAllQuery({
        key: ['get-transfer-items', userId],
        url: `/api/web/warehouse-workers/get-transfers/${userId}`
    });

    const { data: sectionData } = useGetAllQuery({
        key: ['warehouse-sections', userId],
        url: `/api/web/warehouse-sections/get/${userId}`
    });

    const acceptTransfer = usePutQuery({});

    const sections = get(sectionData, 'data.content', []);
    const transfers = get(transferData, 'data.content', []);

    const handleSubmit = (transferId) => {
        if (!fromSectionId) {
            return message.error(t("Omborxona bo‘limini tanlang"));
        }

        acceptTransfer.mutate({
            url: `/api/web/warehouse-workers/accept-transfer/${transferId}/${userId}?sectionId=${fromSectionId}`
        }, {
            onSuccess: () => {
                message.success(t("Ko‘chirish tasdiqlandi"));
            }
        });
    };


    return (
        <Container>
            <Flex justify={'flex-end'} style={{marginBottom: 10}}>
                <Button type={'primary'} onClick={() => navigate(`/warehouse-transfers-form/${roleId}/${userId}`)}>
                    {t("Ko'chirish (Перемещение)")}
                </Button>
            </Flex>
            {transfers?.map((transfer) => (
                <Card
                    key={transfer.id}
                    title={`${t("Ko‘chirish raqami")}: #${transfer.id.slice(0, 6)}...`}
                    style={{ marginBottom: 16 }}
                >
                    <p><b>{t("Omborxona xodimi")}:</b> {transfer.creator}</p>
                    <p><b>{t("Mahsulotlar")}:</b></p>
                    {transfer.products.map((item, i) => (
                        <p key={i}>
                            <b>L {item.product}</b> x {item.quantity} {t("dona")}
                        </p>
                    ))}

                    <p style={{ marginTop: 16 }}><b>{t("Omborxona bo‘limini tanlang")}:</b></p>
                    <Select
                        style={{ width: '100%', marginBottom: 12 }}
                        placeholder={t("Tanlash")}
                        options={sections.map(s => ({
                            label: s.name + ' | ' + s.warehouse.name,
                            value: s.id
                        }))}
                        onChange={val => setFromSectionId(val)}
                    />
                    <Button
                        type="primary"
                        block
                        onClick={() => handleSubmit(transfer.id)}
                    >
                        {t("Ko‘chirishni tasdiqlash")}
                    </Button>
                </Card>
            ))}
        </Container>
    );
};

export default WarehouseTransferPage;

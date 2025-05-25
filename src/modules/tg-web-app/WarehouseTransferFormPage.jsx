import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Card, Button, Select, InputNumber, Switch, message, Row, Col, Input
} from 'antd';
import { useTranslation } from 'react-i18next';
import useGetAllQuery from '../../hooks/api/useGetAllQuery';
import usePostQuery from '../../hooks/api/usePostQuery';
import Container from '../../components/Container.jsx';
import {DeleteOutlined} from "@ant-design/icons";

const WarehouseTransferFormPage = () => {
    const { t } = useTranslation();
    const { roleId,userId } = useParams();

    const [fromSection, setFromSection] = useState(null);
    const [stocks, setStocks] = useState([]);
    const [innerTransfer, setInnerTransfer] = useState(true);
    const [toSection, setToSection] = useState(null);
    const [toWarehouse, setToWarehouse] = useState(null);
    const [comment, setComment] = useState(null);

    const { data: sectionsData } = useGetAllQuery({
        key: ['sections',userId],
        url: `/api/web/warehouse-sections/get/${userId}`
    });

    const { data: warehousesData } = useGetAllQuery({
        key: ['warehouses'],
        url: `/api/web/warehouses/get`
    });

    const { data: productsData } = useGetAllQuery({
        key: ['products'],
        url: `/api/web/products/get`,
        params: { params: { size: 1000, page: 0 } }
    });

    const transferMutation = usePostQuery({});

    const sectionOptions = (sectionsData?.data.content || []).map(s => ({ label: s.name, value: s.id }));
    const warehouseOptions = (warehousesData?.data.content || []).map(w => ({ label: w.name, value: w.id }));
    const productOptions = (productsData?.data.content || []).map(p => ({ label: p.model, value: p.id }));

    const addStock = () => {
        setStocks([...stocks, { productId: null, quantity: 1 }]);
    };

    const updateStock = (index, key, value) => {
        const copy = [...stocks];
        copy[index][key] = value;
        setStocks(copy);
    };

    const removeStock = (index) => {
        const copy = [...stocks];
        copy.splice(index, 1);
        setStocks(copy);
    };

    const handleSubmit = () => {
        if (!fromSection) return message.error(t("A qismdagi bo‘limni tanlang"));
        if (stocks.length === 0) return message.error(t("Mahsulotlar tanlanmagan"));
        if (innerTransfer && !toSection) return message.error(t("B qismdagi bo‘limni tanlang"));
        if (!innerTransfer && !toWarehouse) return message.error(t("B qismdagi omborni tanlang"));

        transferMutation.mutate({
            url: `/api/web/warehouse-workers/transfer/${userId}`,
            attributes: {
                fromSection,
                stocks,
                comment,
                toSection: innerTransfer ? toSection : null,
                toWarehouse: innerTransfer ? null : toWarehouse,
                innerTransfer
            }
        }, {
            onSuccess: () => {
                message.success(t("Ko‘chirish amalga oshirildi"));
                setStocks([]);
            }
        });
    };

    return (
        <Container>
            <Card title={t("A qism")}>
                <p>{t("Omborxona bo‘limini tanlang")}:</p>
                <Select
                    options={sectionOptions}
                    value={fromSection}
                    onChange={setFromSection}
                    placeholder={t("Tanlash")}
                    style={{ width: '100%', marginBottom: 16 }}
                />

                {stocks.map((stock, index) => (
                    <Row gutter={10} key={index} style={{ marginBottom: 8}}>
                        <Col span={15}>
                            <Select
                                options={productOptions}
                                value={stock.productId}
                                onChange={(val) => updateStock(index, 'productId', val)}
                                placeholder={t("Mahsulot")}
                                style={{ width: '100%'}}
                            />
                        </Col>
                        <Col span={6}>
                            <InputNumber
                                min={1}
                                value={stock.quantity}
                                onChange={(val) => updateStock(index, 'quantity', val)}
                            />
                        </Col>
                        <Col span={1}>
                            <Button danger icon={<DeleteOutlined/>} onClick={() => removeStock(index)} />
                        </Col>
                    </Row>
                ))}
                <Button onClick={addStock} block>
                    {t("Mahsulot qo‘shish")}
                </Button>
            </Card>

            <Card title={t("B qism")} style={{ marginTop: 16 }}>
                <p>{t("Ichki ko‘chirish")}?</p>
                <Switch checked={innerTransfer} onChange={setInnerTransfer} />

                {innerTransfer ? (
                    <>
                        <p style={{ marginTop: 12 }}>{t("Omborxona bo‘limini tanlang")}:</p>
                        <Select
                            options={sectionOptions}
                            value={toSection}
                            onChange={setToSection}
                            placeholder={t("Tanlash")}
                            style={{ width: '100%' }}
                        />
                    </>
                ) : (
                    <>
                        <p style={{ marginTop: 12 }}>{t("Boshqa omborxonani tanlang")}:</p>
                        <Select
                            options={warehouseOptions}
                            value={toWarehouse}
                            onChange={setToWarehouse}
                            placeholder={t("Tanlash")}
                            style={{ width: '100%' }}
                        />
                    </>
                )}
            </Card>

            <Input.TextArea style={{ marginTop: 20 }} placeholder={t("Comment")} value={comment} onChange={(e) => setComment(e.target.value)} />

            <Button
                type="primary"
                block
                style={{ marginTop: 20 }}
                onClick={handleSubmit}
            >
                {t("Tasdiqlash")}
            </Button>
        </Container>
    );
};

export default WarehouseTransferFormPage;

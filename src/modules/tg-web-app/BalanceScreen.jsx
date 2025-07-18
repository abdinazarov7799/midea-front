import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Card,
    Typography,
    InputNumber,
    Button,
    message,
    Select,
    Spin,
    Table,
    Pagination,
    Row,
    Divider,
    Flex, Input, Space, Modal, Segmented
} from 'antd';
import { useTranslation } from 'react-i18next';
import useGetAllQuery from '../../hooks/api/useGetAllQuery';
import usePostQuery from '../../hooks/api/usePostQuery';
import {useTelegram} from "../../hooks/telegram/useTelegram.js";
import usePaginateQuery from "../../hooks/api/usePaginateQuery.js";
import {get} from "lodash";

const BalanceScreen = () => {
    const { t } = useTranslation();
    const { userId,roleId } = useParams();
    const [amount, setAmount] = useState(0);
    const [method, setMethod] = useState('CASH');
    const [page, setPage] = useState(0);
    const telegram = useTelegram();
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);
    const [clientDataType, setClientDataType] = useState('first');
    const [clientPage, setClientPage] = useState(0);

    const { data,isLoading,isFetching } = useGetAllQuery({
        key: ['balance', userId],
        url: `/api/web/payments/get-balance/${userId}`
    });

    const accountedData = usePaginateQuery({
        key: ['accounted', userId],
        url: `/api/web/orders/order-report/accounted/${userId}`,
        params: {
            params: {
                search
            }
        },
        page
    });

    const { data:nonAccountedData } = useGetAllQuery({
        key: ['non-accounted', userId],
        url: `/api/web/orders/order-report/non-accounted/${userId}`
    });

    const clientDataQuery = usePaginateQuery({
        key: ['clientDataQuery', userId, selected,clientDataType],
        url: `/api/web/orders/get-${clientDataType}-data/${userId}/${selected?.client_id}`,
        enabled: !!selected,
        page: clientPage
    });

    const createPayment = usePostQuery({});

    const handleSubmit = () => {
        if (amount <= 0) return message.error(t("Miqdor 0 dan katta bo‘lishi kerak"));

        createPayment.mutate({
            url: `/api/web/payments/${userId}?amount=${amount}&method=${method}`,
        }, {
            onSuccess: () => {
                setAmount(0);
                message.success(
                    t("So'rov yuborildi"),
                    3,
                    () => telegram.onClose()
                );
            }
        });
    };

    return (
        <Spin spinning={isLoading || isFetching}>
            <Card title={t("Beriladigan summani kiriting (dollarda)")}>
                <Select
                    style={{width: '100%'}}
                    placeholder={t("Method")}
                    allowClear
                    value={method}
                    options={[
                        {
                            label: 'Cash',
                            value: 'CASH'
                        },
                        {
                            label: 'Card',
                            value: 'CARD'
                        },
                    ]}
                    onChange={(value) => {
                        setMethod(value)
                    }}
                />
                <InputNumber
                    min={1}
                    value={amount}
                    onChange={setAmount}
                    style={{ width: '100%', margin: '12px 0' }}
                />
                <Button block type="primary" onClick={handleSubmit}>
                    {t("Yuborish")}
                </Button>

                <Typography.Paragraph style={{ marginTop: 20 }}>
                    <b>{t("Sizning rolingiz")}:</b> {data?.data?.role || '-'}<br />
                    <b>{t("FIO")}:</b> {data?.data?.fullName || '-'}<br />
                    <b>{t("Phone")}:</b> {data?.data?.phone || '-'}<br />
                    <b>{t("Balans")}:</b> $ {data?.data?.balance || 0}
                </Typography.Paragraph>

                <Typography.Text type="warning">
                    {t("Esda tuting, qarzingizdan faqatgina yuqorida pul berganligingiz tasdiqlansagina qutulishingiz mumkin.")}
                </Typography.Text>
            </Card>
            <div style={{margin: 12}}>
                <Space direction={'vertical'} style={{width:'100%'}}>
                    <Input placeholder={"Client"} value={search} onChange={(e) => {
                        setPage(0)
                        setSearch(e.target.value)
                    }} />
                    <Button block onClick={() => setSearch('')}>{t("Tozalash")}</Button>
                </Space>
            </div>
            <Table
                dataSource={get(accountedData, 'data.data.content')}
                loading={accountedData.isLoading || accountedData.isFetching}
                size={'small'}
                onRow={(record) => {
                    return {
                        onDoubleClick: () => setSelected(record),
                    }
                }}
                columns={[
                    {
                        key: 'index',
                        title: '#',
                        render: (_,__,index) => index+1
                    },
                    {
                        key: 'Id',
                        title: t('ID'),
                        dataIndex: 'id',
                    },
                    {
                        key: 'client',
                        title: t('Client'),
                        dataIndex: 'client',
                    },
                    {
                        key: 'amount_for_role',
                        title: t('For role'),
                        dataIndex: 'amount_for_role',
                        render: props => <>{props} $</>
                    },
                    {
                        key: 'total_amount',
                        title: t('Total'),
                        dataIndex: 'total_amount',
                        render: props => <>{props} $</>
                    },
                ]}
                pagination={false}
            />
            <Row justify={"space-between"} style={{marginTop: 10,padding: 6}}>
                <Typography.Title level={5}>
                    {t("Miqdori")}: {get(accountedData,'data.data.totalElements')} {t("ta")}
                </Typography.Title>
                <Pagination
                    current={page+1}
                    onChange={(page) => setPage(page - 1)}
                    total={get(accountedData,'data.data.totalPages') * 10 }
                    showSizeChanger={false}
                />
            </Row>
            <Modal width={800} open={!!selected} title={selected?.client} onCancel={() => setSelected(null)} footer={null}>
                <Space direction={'vertical'} style={{width:'100%'}}>
                    <Segmented
                        block
                        options={[
                            {
                                label: '1',
                                value: 'first',
                            },
                            {
                                label: '2',
                                value: 'second',
                            }
                        ]}
                        value={clientDataType}
                        onChange={(e) => {
                            setClientPage(0)
                            setClientDataType(e)
                        }}
                    />
                    <Table
                        dataSource={get(clientDataQuery,'data.data.content')}
                        size={'small'}
                        columns={clientDataType === 'first' ? [
                            {
                                title: t('Order id'),
                                dataIndex: 'order_id',
                                key: 'order_id',
                            },
                            {
                                title: t('Model'),
                                dataIndex: 'model',
                                key: 'model',
                            },
                            {
                                title: t('Quantity'),
                                dataIndex: 'quantity',
                                key: 'quantity',
                            },
                            {
                                title: t('Unit price'),
                                dataIndex: 'unit_price',
                                key: 'unit_price',
                                render: (props) => props + ' $'
                            },
                            {
                                title: t('Price'),
                                dataIndex: 'price',
                                key: 'price',
                                render: (props) => props + ' $'
                            },
                            {
                                title: t('Date'),
                                dataIndex: '_date',
                                key: '_date',
                            },
                        ] : [
                            {
                                title: t('Order id'),
                                dataIndex: 'order_id',
                                key: 'order_id',
                            },
                            {
                                title: t('Price'),
                                dataIndex: 'price',
                                key: 'price',
                                render: (props) => props + ' $'
                            },
                            {
                                title: t('Balance'),
                                dataIndex: 'balance',
                                key: 'balance',
                                render: (props) => props + ' $'
                            },
                            {
                                title: t('Date'),
                                dataIndex: '_date',
                                key: '_date',
                            },
                        ]}
                        scroll={{x: 'max-content'}}
                        loading={clientDataQuery.isLoading || clientDataQuery.isFetching}
                        pagination={false}
                    />
                    <Row justify={"space-between"} style={{marginTop: 10,padding: 6}}>
                        <Typography.Title level={5}>
                            {t("Miqdori")}: {get(clientDataQuery,'data.data.totalElements')} {t("ta")}
                        </Typography.Title>
                        <Pagination
                            current={clientPage+1}
                            onChange={(page) => setClientPage(page - 1)}
                            total={get(clientDataQuery,'data.data.totalPages') * 10 }
                            showSizeChanger={false}
                        />
                    </Row>
                </Space>
            </Modal>
            <Divider style={{margin: '6px 0'}}/>
            <Flex justify={'space-between'} align={'center'} style={{padding: 6}}>
                <Typography.Title level={5}>
                    {t("Non accounted")}: {get(nonAccountedData,'data.amount')} $
                </Typography.Title>
            </Flex>
        </Spin>
    );
};

export default BalanceScreen;

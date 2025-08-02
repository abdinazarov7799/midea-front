import React, {useState} from 'react';
import Container from "../../components/Container.jsx";
import {
    Button,
    Checkbox,
    DatePicker,
    Input,
    Modal,
    Pagination,
    Popconfirm,
    Row, Segmented,
    Select,
    Space,
    Table,
    Typography
} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../constants/key.js";
import {URLS} from "../../constants/url.js";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import useDeleteQuery from "../../hooks/api/useDeleteQuery.js";
import CreateEditClients from "./components/CreateEditClients.jsx";
import dayjs from "dayjs";
import useGetAllQuery from "../../hooks/api/useGetAllQuery.js";

const ClientsContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState(null);
    const [isCreateModalOpenCreate, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [clientDataType, setClientDataType] = useState('first');
    const [clientPage, setClientPage] = useState(0);
    const [params, setParams] = useState({});
    const [selectedClient, setSelectedClient] = useState(null);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.clients_list,
        url: URLS.clients_list,
        params: {
            params: {
                size: 10,
                ...params,
                from: get(params,'from') ? get(params,'from')?.toISOString() : null,
                to: get(params,'to') ? get(params,'to')?.toISOString() : null
            }
        },
        page
    });

    const clientDataQuery = useGetAllQuery({
        key: ['clientDataQuery', selectedClient ,clientDataType],
        url: `/api/admin/clients/get-${clientDataType}-data/${selectedClient?.id}`,
        params: {
            params: {
                page: clientPage
            }
        },
        enabled: !!selectedClient
    });

    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.clients_list,
    });
    const useDelete = (id) => {
        mutate({url: `${URLS.clients_delete}/${id}`})
    }

    const onChangeParams = (name, value) => {
        setPage(0)
        setParams(prevState => ({...prevState, [name]: value}));
    }

    const columns = [
        {
            title: (
                <Space direction="vertical">
                    {t("Name")}
                    <Input
                        placeholder={t("Name")}
                        allowClear
                        value={get(params,'name','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('name', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "name",
            key: "name"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Phone")}
                    <Input
                        placeholder={t("Phone")}
                        allowClear
                        value={get(params,'phone','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('phone', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "phone",
            key: "phone"
        },
        {
            title: t("Balance"),
            dataIndex: "balance",
            key: "balance"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Dealer")}
                    <Input
                        placeholder={t("Dealer")}
                        allowClear
                        value={get(params,'dealerFullName','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('dealerFullName', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "dealer",
            key: "dealer",
            render: (text) => get(text,'fullName')
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Team Lead")}
                    <Input
                        placeholder={t("Team Lead")}
                        allowClear
                        value={get(params,'teamLeadFullName','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('teamLeadFullName', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "teamLead",
            key: "teamLead",
            render: (text) => get(text,'fullName')
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Manager")}
                    <Input
                        placeholder={t("Manager")}
                        allowClear
                        value={get(params,'managerFullName','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('managerFullName', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "manager",
            key: "manager",
            render: (text) => get(text,'fullName')
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Is legal")}
                    <Select
                        style={{width: 100}}
                        placeholder={t("Is legal")}
                        allowClear
                        defaultValue={get(params,'legal',true)}
                        value={get(params,'legal','')}
                        options={[
                            {
                                label: 'Legal',
                                value: true
                            },
                            {
                                label: 'Individual',
                                value: false
                            },
                        ]}
                        onChange={(value) => {
                            onChangeParams('legal', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "legal",
            key: "legal",
            render: (props,data) => (
                <Checkbox checked={get(data,'legal')} />
            )
        },
        {
            title: t("Edit / Delete"),
            width: 120,
            fixed: 'right',
            key: 'action',
            render: (props, data, index) => (
                <Space key={index}>
                    <Button icon={<EditOutlined />} onClick={() => {
                        setIsEditModalOpen(true)
                        setSelected(data)
                    }} />
                    <Popconfirm
                        title={t("Delete")}
                        description={t("Are you sure to delete?")}
                        onConfirm={() => useDelete(get(data,'id'))}
                        okText={t("Yes")}
                        cancelText={t("No")}
                    >
                        <Button danger icon={<DeleteOutlined />}/>
                    </Popconfirm>
                </Space>
            )
        }
    ]
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Space size={"middle"}>
                    <Button
                        icon={<PlusOutlined />}
                        type={"primary"}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        {t("New")}
                    </Button>
                    <DatePicker
                        allowClear
                        placeholder={t("Dan")}
                        format="YYYY-MM-DD"
                        value={get(params, 'from') ? dayjs(get(params, 'from')) : null}
                        onChange={(date) => onChangeParams('from', date)}
                    />
                    <DatePicker
                        allowClear
                        placeholder={t("Gacha")}
                        format="YYYY-MM-DD"
                        value={get(params, 'to') ? dayjs(get(params, 'to')) : null}
                        onChange={(date) => onChangeParams('to', date)}
                    />
                </Space>

                <Table
                    columns={columns}
                    dataSource={get(data,'data.content',[])}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading}
                    onRow={(record) => {
                        return {
                            onDoubleClick: () => {
                                setSelectedClient(record);
                            },
                            style: {cursor: "pointer"}
                        }
                    }}
                />

                <Row justify={"space-between"} style={{marginTop: 10}}>
                    <Typography.Title level={4}>
                        {t("Miqdori")}: {get(data,'data.totalElements')} {t("ta")}
                    </Typography.Title>
                    <Pagination
                        current={page+1}
                        onChange={(page) => setPage(page - 1)}
                        total={get(data,'data.totalPages') * 10 }
                        showSizeChanger={false}
                    />
                </Row>
            </Space>
            <Modal
                title={t('Create')}
                open={isCreateModalOpenCreate}
                onCancel={() => setIsCreateModalOpen(false)}
                footer={null}
            >
                <CreateEditClients setIsModalOpen={setIsCreateModalOpen}/>
            </Modal>
            <Modal
                title={t("Edit")}
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <CreateEditClients
                    selected={selected}
                    setIsModalOpen={setIsEditModalOpen}
                />
            </Modal>
            <Modal width={800} open={!!selectedClient} title={selectedClient?.name} onCancel={() => setSelectedClient(null)} footer={null}>
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
                                title: t('Total amount'),
                                dataIndex: 'total_amount',
                                key: 'total_amount',
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
        </Container>
    );
};

export default ClientsContainer;

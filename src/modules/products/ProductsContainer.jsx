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
    Row,
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
import CreateEditProducts from "./components/CreateEditProducts.jsx";
import dayjs from "dayjs";

const ProductsContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState(null);
    const [isCreateModalOpenCreate, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [params, setParams] = useState({});

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.products_list,
        url: URLS.products_list,
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

    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.products_list,
    });
    const useDelete = (id) => {
        mutate({url: `${URLS.products_delete}/${id}`})
    }

    const onChangeParams = (name, value) => {
        setPage(0)
        setParams(prevState => ({...prevState, [name]: value}));
    }

    const columns = [
        {
            title: (
                <Space direction="vertical">
                    {t("Model")}
                    <Input
                        placeholder={t("Model")}
                        allowClear
                        value={get(params,'model','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('model', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "model",
            key: "model"
        },
        {
            title: t("Price"),
            dataIndex: "price",
            key: "price"
        },
        {
            title: t("Manager interest"),
            dataIndex: "managerInterest",
            key: "managerInterest"
        },
        {
            title: t("Team lead interest"),
            dataIndex: "teamLeadInterest",
            key: "teamLeadInterest"
        },
        {
            title: t("Dealer interest"),
            dataIndex: "dealerInterest",
            key: "dealerInterest"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Category")}
                    <Input
                        placeholder={t("Category")}
                        allowClear
                        value={get(params,'categoryName','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('categoryName', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "category",
            key: "category",
            render: (text, record) => get(text,'name')
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Is active")}
                    <Select
                        allowClear
                        style={{width: 100}}
                        placeholder={t("Is active")}
                        defaultValue={get(params,'active',true)}
                        value={get(params,'active','')}
                        options={[
                            {
                                label: 'Active',
                                value: true
                            },
                            {
                                label: 'Inactive',
                                value: false
                            },
                        ]}
                        onChange={(value) => {
                            onChangeParams('active', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "active",
            key: "active",
            render: (props,data,index) => (
                <Checkbox checked={get(data,'active')} />
            )
        },
        {
            title: t("Created at"),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (props) => dayjs(props).format('YYYY-MM-DD HH:mm:ss'),
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
                <CreateEditProducts setIsModalOpen={setIsCreateModalOpen}/>
            </Modal>
            <Modal
                title={t("Edit")}
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <CreateEditProducts
                    selected={selected}
                    setIsModalOpen={setIsEditModalOpen}
                />
            </Modal>
        </Container>
    );
};

export default ProductsContainer;

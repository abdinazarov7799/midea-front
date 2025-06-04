import React, {useState} from 'react';
import Container from "../../components/Container.jsx";
import {Button, DatePicker, Input, Modal, Pagination, Popconfirm, Row, Space, Table, Typography} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../constants/key.js";
import {URLS} from "../../constants/url.js";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import useDeleteQuery from "../../hooks/api/useDeleteQuery.js";
import CreateEditCategories from "./components/CreateEditCategories.jsx";
import dayjs from "dayjs";

const CategoriesContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState(null);
    const [isCreateModalOpenCreate, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [params, setParams] = useState({});

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.categories_list,
        url: URLS.categories_list,
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
        listKeyId: KEYS.categories_list,
    });
    const useDelete = (id) => {
        mutate({url: `${URLS.categories_delete}/${id}`})
    }

    const onChangeParams = (name, value) => {
        setParams(prevState => ({...prevState, [name]: value}));
    }

    const columns = [
        {
            title: (
                <Space direction="vertical">
                    {t("ID")}
                    <Input
                        placeholder={t("ID")}
                        allowClear
                        value={get(params,'id','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('id', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "id",
            key: "id",
            width: 250,
        },
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
                    {t("Code")}
                    <Input
                        placeholder={t("Code")}
                        allowClear
                        value={get(params,'code','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('code', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "code",
            key: "code"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Description")}
                    <Input
                        placeholder={t("Description")}
                        allowClear
                        value={get(params,'description','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('description', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "description",
            key: "description"
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
                <CreateEditCategories setIsModalOpen={setIsCreateModalOpen}/>
            </Modal>
            <Modal
                title={t("Edit")}
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <CreateEditCategories
                    selected={selected}
                    setIsModalOpen={setIsEditModalOpen}
                />
            </Modal>
        </Container>
    );
};

export default CategoriesContainer;

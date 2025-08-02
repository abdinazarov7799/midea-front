import React, { useState } from "react";
import Container from "../../components/Container.jsx";
import {
    Button,
    Input,
    Modal,
    Pagination,
    Popconfirm,
    Row,
    Space,
    Table,
    Typography,
    Divider,
    Form,
    InputNumber,
    message
} from "antd";
import { get, isNil } from "lodash";
import { useTranslation } from "react-i18next";
import usePaginateQuery from "../../hooks/api/usePaginateQuery.js";
import useDeleteQuery from "../../hooks/api/useDeleteQuery.js";
import usePutQuery from "../../hooks/api/usePutQuery.js";
import dayjs from "dayjs";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { KEYS } from "../../constants/key.js";
import { URLS } from "../../constants/url.js";
import ViewProducts from "./components/ViewProducts.jsx";
import EditProducts from "./components/EditProducts.jsx";

const IncomesContainer = () => {
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [params, setParams] = useState({});
    const [selectedIncome, setSelectedIncome] = useState(null);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);

    // GET incomes
    const { data, isLoading } = usePaginateQuery({
        key: KEYS.incomes_list,
        url: URLS.incomes_list,
        params: {
            params: {
                size: 10,
                ...params
            }
        },
        page
    });

    // DELETE income
    const { mutate: deleteMutate } = useDeleteQuery({
        listKeyId: KEYS.incomes_list,
    });

    const onChangeParams = (name, value) => {
        setPage(0);
        setParams(prev => ({ ...prev, [name]: value }));
    };

    const handleDelete = (id) => {
        deleteMutate({ url: `${URLS.incomes_delete}/${id}` });
    };

    const columns = [
        {
            title: (
                <Space direction="vertical">
                    {t("Warehouse Worker")}
                    <Input
                        allowClear
                        value={get(params, "warehouseWorker", "")}
                        onChange={e => onChangeParams("warehouseWorker", e.target.value)}
                        placeholder={t("Warehouse Worker")}
                    />
                </Space>
            ),
            dataIndex: "warehouseWorker",
            key: "warehouseWorker",
            render: (text) => get(text,'fullName')
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Warehouse")}
                    <Input
                        allowClear
                        value={get(params, "warehouse", "")}
                        onChange={e => onChangeParams("warehouse", e.target.value)}
                        placeholder={t("Warehouse")}
                    />
                </Space>
            ),
            dataIndex: "warehouse",
            key: "warehouse",
            render: (text) => get(text,'name')
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Warehouse Section")}
                    <Input
                        allowClear
                        value={get(params, "warehouseSection", "")}
                        onChange={e => onChangeParams("warehouseSection", e.target.value)}
                        placeholder={t("Warehouse Section")}
                    />
                </Space>
            ),
            dataIndex: "warehouseSection",
            key: "warehouseSection",
            render: (text) => get(text,'name')
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Dealer")}
                    <Input
                        allowClear
                        value={get(params, "dealer", "")}
                        onChange={e => onChangeParams("dealer", e.target.value)}
                        placeholder={t("Dealer")}
                    />
                </Space>
            ),
            dataIndex: "dealer",
            key: "dealer",
            render: (text) => get(text,'fullName')
        },
        {
            title: t("Created at"),
            dataIndex: "createdAt",
            key: "createdAt",
            render: v => (v ? dayjs(v).format("YYYY-MM-DD HH:mm") : "-")
        },
        {
            title: t("Actions"),
            key: "actions",
            width: 150,
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => {
                            setSelectedIncome(record);
                            setViewModalVisible(true);
                        }}
                        title={t("View products")}
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedIncome(record);
                            setEditModalVisible(true);
                        }}
                        title={t("Edit products")}
                    />
                    <Popconfirm
                        title={t("Delete")}
                        description={t("Are you sure to delete this income?")}
                        onConfirm={() => handleDelete(record.id)}
                        okText={t("Yes")}
                        cancelText={t("No")}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            title={t("Delete income")}
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <Container>
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
                <Table
                    columns={columns}
                    dataSource={get(data, "data.content", [])}
                    rowKey="id"
                    bordered
                    size="middle"
                    pagination={false}
                    loading={isLoading}
                    scroll={{ x: 'max-content' }}
                />

                <Row justify="space-between" style={{ marginTop: 10 }}>
                    <Typography.Text>
                        {t("Miqdori")}: {get(data, "data.totalElements")}
                    </Typography.Text>
                    <Pagination
                        current={page + 1}
                        onChange={p => setPage(p - 1)}
                        total={get(data, "data.totalElements")}
                        pageSize={10}
                        showSizeChanger={false}
                    />
                </Row>
            </Space>

            <Modal
                title={t("View Products")}
                open={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                footer={null}
                width={800}
            >
                <ViewProducts income={selectedIncome} />
            </Modal>

            <Modal
                title={t("Edit Products")}
                open={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                footer={null}
                width={900}
            >
                <EditProducts 
                    income={selectedIncome} 
                    setIsModalOpen={setEditModalVisible}
                />
            </Modal>
        </Container>
    );
};

export default IncomesContainer; 
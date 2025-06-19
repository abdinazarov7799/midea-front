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
import {KEYS} from "../../constants/key.js";
import {URLS} from "../../constants/url.js";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import useDeleteQuery from "../../hooks/api/useDeleteQuery.js";
import CreateEditCashiers from "./components/CreateEditCashiers.jsx";
import dayjs from "dayjs";
import useGetAllQuery from "../../hooks/api/useGetAllQuery.js";

const CashiersContainer = () => {
    const {t} = useTranslation();
    const [selected, setSelected] = useState(null);
    const [isCreateModalOpenCreate, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const {data,isLoading} = useGetAllQuery({
        key: KEYS.cashiers_list,
        url: URLS.cashiers_list,
    });

    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.cashiers_list,
    });
    const useDelete = (id) => {
        mutate({url: `${URLS.cashiers_delete}/${id}`})
    }

    const columns = [
        {
            title: t("Username"),
            dataIndex: "username",
            key: "username"
        },
        {
            title: t("Phone"),
            dataIndex: "phone",
            key: "phone"
        },
        {
            title: t("Full name"),
            dataIndex: "full_name",
            key: "fullName"
        },
        {
            title: t("Is active"),
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
                </Space>

                <Table
                    columns={columns}
                    dataSource={get(data,'data',[])}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading}
                />

                <Row justify={"space-between"} style={{marginTop: 10}}>
                    <Typography.Title level={4}>
                        {t("Miqdori")}: {get(data,'data',[])?.length} {t("ta")}
                    </Typography.Title>
                </Row>
            </Space>
            <Modal
                title={t('Create')}
                open={isCreateModalOpenCreate}
                onCancel={() => setIsCreateModalOpen(false)}
                footer={null}
            >
                <CreateEditCashiers setIsModalOpen={setIsCreateModalOpen}/>
            </Modal>
            <Modal
                title={t("Edit")}
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <CreateEditCashiers
                    selected={selected}
                    setIsModalOpen={setIsEditModalOpen}
                />
            </Modal>
        </Container>
    );
};

export default CashiersContainer;

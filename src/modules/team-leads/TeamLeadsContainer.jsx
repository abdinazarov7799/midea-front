import React, {useState} from 'react';
import Container from "../../components/Container.jsx";
import {Button, Checkbox, Input, Modal, Pagination, Popconfirm, Row, Space, Table, Typography} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../constants/key.js";
import {URLS} from "../../constants/url.js";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import useDeleteQuery from "../../hooks/api/useDeleteQuery.js";
import CreateEditTeamLeads from "./components/CreateEditTeamLeads.jsx";

const TeamLeadsContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState(null);
    const [isCreateModalOpenCreate, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [params, setParams] = useState({});

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.team_leads_list,
        url: URLS.team_leads_list,
        params: {
            params: {
                size: 10,
                ...params
            }
        },
        page
    });

    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.team_leads_list,
    });
    const useDelete = (id) => {
        mutate({url: `${URLS.team_leads_delete}/${id}`})
    }

    const onChangeParams = (name, value) => {
        setParams(prevState => ({...prevState, [name]: value}));
    }

    const columns = [
        {
            title: t("Telegram ID"),
            dataIndex: "telegramId",
            key: "telegramId",
        },
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
            dataIndex: "fullName",
            key: "fullName"
        },
        {
            title: t("Balance"),
            dataIndex: "balance",
            key: "balance",
            render: props => `${props} $`
        },
        {
            title: t("Dealer"),
            dataIndex: "dealer",
            key: "dealer",
            render: (text, record) => get(text,'fullName')
        },
        {
            title: t("is active"),
            dataIndex: "active",
            key: "active",
            render: (props,data,index) => (
                <Checkbox checked={get(data,'active')} />
            )
        },
        {
            title: t("Can act as manager"),
            dataIndex: "canActAsManager",
            key: "canActAsManager",
            render: (props,data,index) => (
                <Checkbox checked={get(data,'canActAsManager')} />
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
                <CreateEditTeamLeads setIsModalOpen={setIsCreateModalOpen}/>
            </Modal>
            <Modal
                title={t("Edit")}
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <CreateEditTeamLeads
                    selected={selected}
                    setIsModalOpen={setIsEditModalOpen}
                />
            </Modal>
        </Container>
    );
};

export default TeamLeadsContainer;

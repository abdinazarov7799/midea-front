import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Button, Input, Modal, Pagination, Popconfirm, Row, Space, Table, Image, Typography} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
import CreateEditMedicines from "../components/CreateEditMedicines.jsx";
import dayjs from "dayjs";
import HasAccess, {hasAccess} from "../../../services/auth/HasAccess.jsx";
import {useStore} from "../../../store/index.js";
import config from "../../../config.js";

const MedicinesContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [searchKey,setSearchKey] = useState();
    const [itemData, setItemData] = useState(null);
    const [isCreateModalOpenCreate, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const user = useStore(state => get(state,'user',{}))

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.drug_list,
        url: URLS.drug_list,
        params: {
            params: {
                size: 10,
                search: searchKey
            }
        },
        page
    });

    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.drug_list
    });
    const useDelete = (id) => {
        mutate({url: `${URLS.drug_delete}/${id}`})
    }

    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_AREA_ADMIN],
        },
        {
            title: t("Name uz"),
            dataIndex: "nameUz",
            key: "nameUz",
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_AREA_ADMIN],
        },
        {
            title: t("Name ru"),
            dataIndex: "nameRu",
            key: "nameRu",
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_AREA_ADMIN],
        },
        {
            title: t("Created by"),
            dataIndex: "createdBy",
            key: "createdBy",
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_AREA_ADMIN],
        },
        {
            title: t("Created at"),
            key: "createdAt",
            dataIndex: "createdAt",
            render: (props) => !!props ? dayjs(props).format("YYYY-MM-DD HH:mm:ss") : "",
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_AREA_ADMIN],
        },
        {
            title: t("Image"),
            key: "photoUrl",
            dataIndex: "photoUrl",
            align: "center",
            render: (props) => <Image src={props} width={80} height={50} />,
            access: [config.ROLES.ROLE_SUPER_ADMIN,config.ROLES.ROLE_AREA_ADMIN],
        },
        {
            title: t("Edit / Delete"),
            width: 120,
            fixed: 'right',
            key: 'action',
            access: [config.ROLES.ROLE_SUPER_ADMIN],
            render: (props, data, index) => (
                <Space key={index}>
                    <Button icon={<EditOutlined />} onClick={() => {
                        setIsEditModalOpen(true)
                        setItemData(data)
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
    ].filter((item) => {
        return hasAccess(get(user,'roles',[]),get(item,'access'));
    });
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Space size={"middle"}>
                    <Input.Search
                        placeholder={t("Search")}
                        onChange={(e) => setSearchKey(e.target.value)}
                        allowClear
                    />
                    <HasAccess access={[config.ROLES.ROLE_SUPER_ADMIN]}>
                        <Button
                            icon={<PlusOutlined />}
                            type={"primary"}
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            {t("New")}
                        </Button>
                    </HasAccess>
                    <Modal
                        title={t('Create')}
                        open={isCreateModalOpenCreate}
                        onCancel={() => setIsCreateModalOpen(false)}
                        footer={null}
                    >
                        <CreateEditMedicines setIsModalOpen={setIsCreateModalOpen}/>
                    </Modal>
                    <Modal
                        title={t("Edit")}
                        open={isEditModalOpen}
                        onCancel={() => setIsEditModalOpen(false)}
                        footer={null}
                    >
                        <CreateEditMedicines
                            itemData={itemData}
                            setIsModalOpen={setIsEditModalOpen}
                        />
                    </Modal>
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
        </Container>
    );
};

export default MedicinesContainer;

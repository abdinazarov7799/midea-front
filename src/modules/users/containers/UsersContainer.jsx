import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Button, Input, Modal, Pagination, Popover, Row, Space, Switch, Table, Typography} from "antd";
import {get, isArray} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";
import CreateEditUser from "../components/CreateEditUser.jsx";

const UsersContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [searchKey,setSearchKey] = useState();
    const [isCreateModalOpenCreate, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [itemData, setItemData] = useState(null);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.users_list,
        url: URLS.users_list,
        params: {
            params: {
                size: 20,
                search: searchKey
            }
        },
        page
    });

    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
        },
        {
            title: t("First name"),
            dataIndex: "firstname",
            key: "firstName"
        },
        {
            title: t("Last name"),
            dataIndex: "lastName",
            key: "lastName"
        },
        {
            title: t("Phone number"),
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: t("Region"),
            dataIndex: "region",
            key: "region",
            render: (props) => (
                <Popover
                    content={<Space style={{width:'100%'}} direction={"vertical"}>
                        {isArray(props) && (
                            props?.map((item, index) => (
                                <Typography.Text key={index}>{get(item,'nameUz')} / {get(item,'nameRu')}</Typography.Text>
                            ))
                        )}
                    </Space>}
                    title={t("Region")}
                >
                    <Button type="primary" icon={<EyeOutlined />}>{t("Region")}</Button>
                </Popover>
            )
        },
        {
            title: t("District"),
            dataIndex: "district",
            key: "district",
            render: (props) => (
                <Popover
                    content={<Space style={{width:'100%'}} direction={"vertical"}>
                        {isArray(props) && (
                            props?.map((item, index) => (
                                <Typography.Text key={index}>{get(item,'nameUz')} / {get(item,'nameRu')}</Typography.Text>
                            ))
                        )}
                    </Space>}
                    title={t("District")}
                >
                    <Button type="primary" icon={<EyeOutlined />}>{t("District")}</Button>
                </Popover>
            )
        },
        {
            title: t("Blocked"),
            dataIndex: "blocked",
            key: "registered",
            render: (props,data) => {
                return (
                    <Switch disabled value={get(data,'blocked')}/>
                )
            }
        },
        {
            title: t("Edit"),
            width: 80,
            fixed: 'right',
            key: 'action',
            render: (props, data, index) => (
                <Button key={index} icon={<EditOutlined />} onClick={() => {
                    setIsEditModalOpen(true)
                    setItemData(data)
                }} />
            )
        }
    ]
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Space size={"middle"}>
                    <Input.Search
                        placeholder={t("Search")}
                        onChange={(e) => setSearchKey(e.target.value)}
                        allowClear
                    />
                    <Button
                        icon={<PlusOutlined />}
                        type={"primary"}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        {t("New")}
                    </Button>
                    <Modal
                        title={t('Create')}
                        open={isCreateModalOpenCreate}
                        onCancel={() => setIsCreateModalOpen(false)}
                        footer={null}
                    >
                        <CreateEditUser setIsModalOpen={setIsCreateModalOpen}/>
                    </Modal>
                    <Modal
                        title={t("Edit")}
                        open={isEditModalOpen}
                        onCancel={() => setIsEditModalOpen(false)}
                        footer={null}
                    >
                        <CreateEditUser
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
                    onRow={(props) => {
                        if (!get(props,'hasActivityToday')){
                            return {
                                style: {
                                    backgroundColor: "rgba(255,99,99,0.29)"}
                            }
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
        </Container>
    );
};

export default UsersContainer;

import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Button, Image, Input, Modal, Pagination, Popconfirm, Row, Select, Space, Table, Typography} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {DeleteOutlined, EyeOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";

const StocksContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [detailsPage, setDetailsPage] = useState(0);
    const [searchKey,setSearchKey] = useState();
    const [selected, setSelected] = useState(null);
    const [userId, setUserId] = useState(null);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.stocks_list,
        url: URLS.stocks_list,
        params: {
            params: {
                size: 10,
                search: searchKey,
                userId
            }
        },
        page
    });

    const {data:details,isLoading:isLoadingDetails} = usePaginateQuery({
        key: `${KEYS.stock_details}/${get(selected,'id')}`,
        url: `${URLS.stock_details}/${get(selected,'id')}`,
        enabled: !!get(selected,'id'),
        page: detailsPage
    })

    const {data:users,isLoading:isLoadingUsers} = useGetAllQuery({
        key: KEYS.users_list,
        url: URLS.users_list,
        params: {
            params: {
                size: 1000,
            }
        }
    })

    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.stocks_list
    });
    const useDelete = (id) => {
        mutate({url: `${URLS.stocks_delete}/${id}`})
    }

    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
        },
        {
            title: t("Status"),
            dataIndex: "status",
            key: "status",
        },
        {
            title: t("User"),
            dataIndex: "userData",
            key: "userData"
        },
        {
            title: t("Delete"),
            fixed: 'right',
            key: 'action',
            render: (props, data) => (
                <Popconfirm
                    title={t("Delete")}
                    description={t("Are you sure to delete?")}
                    onConfirm={() => useDelete(get(data,'id'))}
                    okText={t("Yes")}
                    cancelText={t("No")}
                >
                    <Button danger icon={<DeleteOutlined />}/>
                </Popconfirm>
            )
        },
        {
            title: t("Pharmacy"),
            dataIndex: "pharmacy",
            key: "pharmacy"
        },
        {
            title: t("Image"),
            key: "photoUrl",
            dataIndex: "photoUrl",
            align: "center",
            render: (props) => <Image src={props} width={80} height={50} />
        },
        {
            title: t("Offline created at"),
            dataIndex: "offlineCreatedAt",
            key: "offlineCreatedAt",
            render: (props) => dayjs(props).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: t("Created at"),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (props) => dayjs(props).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: t("Details"),
            key: "details",
            render: (props) => (<Button icon={<EyeOutlined />} type={"primary"} onClick={() => setSelected(props)}/>)
        },
    ]

    const detailColumns = [
        {
            title: t("Drug name"),
            dataIndex: "drugName",
            key: "drugName",
        },
        {
            title: t("Quantity"),
            dataIndex: "quantity",
            key: "quantity"
        },
        {
            title: t("Image"),
            key: "photoUrl",
            dataIndex: "photoUrl",
            align: "center",
            render: (props) => <Image src={props} width={80} height={50} />
        },
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
                    <Select
                        allowClear
                        loading={isLoadingUsers}
                        options={get(users,'data.content',[])?.map(user => ({
                            label: `${get(user,'firstname')} ${get(user,'lastName')}`,
                            value: get(user,'id'),
                        }))}
                        style={{width: 300}}
                        placeholder={t("User")}
                        onClear={() => setUserId(null)}
                        onSelect={(value) => setUserId(value)}
                        showSearch
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
            <Modal footer={null} title={get(selected,'id')} open={!!selected} onCancel={() => setSelected(null)} width={1000}>
                <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                    <Table
                        columns={detailColumns}
                        dataSource={get(details,'data.content',[])}
                        bordered
                        size={"middle"}
                        pagination={false}
                        loading={isLoadingDetails}
                    />

                    <Row justify={"space-between"} style={{marginTop: 10}}>
                        <Typography.Title level={4}>
                            {t("Miqdori")}: {get(details,'data.totalElements')} {t("ta")}
                        </Typography.Title>
                        <Pagination
                            current={detailsPage+1}
                            onChange={(page) => setDetailsPage(page - 1)}
                            total={get(details,'data.totalPages') * 10 }
                            showSizeChanger={false}
                        />
                    </Row>
                </Space>
            </Modal>
        </Container>
    );
};

export default StocksContainer;

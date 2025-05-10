import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import Container from "../../../components/Container.jsx";
import {Button, Image, Input, Modal, Pagination, Popconfirm, Row, Space, Table, Typography} from "antd";
import {get} from "lodash";
import {CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import usePatchQuery from "../../../hooks/api/usePatchQuery.js";
import dayjs from "dayjs";
import EditPharmacy from "../components/EditPharmacy.jsx";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";

const PharmaciesContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [searchKey,setSearchKey] = useState();
    const [selected, setSelected] = useState(null);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.pharmacies_list,
        url: URLS.pharmacies_list,
        params: {
            params: {
                size: 10,
                search: searchKey
            }
        },
        page
    });

    const {mutate:accept} = usePatchQuery({
        listKeyId: KEYS.pharmacies_list,
    })

    const useAccept = (id,isAccept) => {
        accept({url: `${URLS.pharmacies_edit_status}/${id}?accept=${isAccept}`})
    }

    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.pharmacies_list
    });
    const useDelete = (id) => {
        mutate({url: `${URLS.pharmacies_delete}/${id}`})
    }

    const columns = [
        {
            title: t("ID"),
            dataIndex: "id",
            key: "id",
        },
        {
            title: t("Name"),
            dataIndex: "name",
            key: "name"
        },
        {
            title: t("INN"),
            dataIndex: "inn",
            key: "inn"
        },
        {
            title: t("Status"),
            dataIndex: "status",
            key: "status"
        },
        {
            title: t("District"),
            dataIndex: "districtName",
            key: "districtName"
        },
        {
            title: t("Created by"),
            dataIndex: "createdBy",
            key: "createdBy"
        },
        {
            title: t("Created at"),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (props) => dayjs(props).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: t("Image"),
            key: "photoUrl",
            dataIndex: "photoUrl",
            align: "center",
            render: (props) => <Image src={props} width={80} height={50} />
        },
        {
            title: t("Location"),
            key: "location",
            align: "center",
            render: (props) => {
                const openMap = () => {
                    if (props?.lat && props?.lng) {
                        const url = `https://www.google.com/maps?q=${props.lat},${props.lng}`;
                        window.open(url, "_blank");
                    } else {
                        console.warn("Location data is missing");
                    }
                };
                return <Button onClick={openMap} icon={<EyeOutlined/>} />
            }
        },
        {
            title: t("Edit / Delete"),
            width: 120,
            fixed: 'right',
            key: 'action',
            render: (props, data, index) => (
                <Space key={index}>
                    <Button icon={<EditOutlined />} onClick={() => {
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
        },
        {
            title: t("Reject / Accept"),
            width: 90,
            fixed: 'right',
            key: 'action',
            render: (props, data) => (
                <Space>
                    <Popconfirm
                        title={t("Reject")}
                        description={t("Are you sure to reject?")}
                        onConfirm={() => useAccept(get(data,'id'),false)}
                        okText={t("Yes")}
                        cancelText={t("No")}
                    >
                        <Button danger icon={<CloseOutlined />}/>
                    </Popconfirm>
                    <Popconfirm
                        title={t("Accept")}
                        description={t("Are you sure to accept?")}
                        onConfirm={() => useAccept(get(data,'id'),true)}
                        okText={t("Yes")}
                        cancelText={t("No")}
                    >
                        <Button type={"primary"} icon={<CheckOutlined />}/>
                    </Popconfirm>
                </Space>
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
                title={t('Edit')}
                open={!!selected}
                onCancel={() => setSelected(null)}
                footer={null}
            >
                <EditPharmacy setSelected={setSelected} selected={selected} />
            </Modal>
        </Container>
    );
};
export default PharmaciesContainer;

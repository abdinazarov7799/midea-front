import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import {Button, DatePicker, Input, Modal, Pagination, Popconfirm, Row, Space, Table, Typography} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import dayjs from "dayjs";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import useDeleteQuery from "../../../hooks/api/useDeleteQuery.js";
import EditDoctor from "../components/EditDoctor.jsx";

const DoctorsContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [params, setParams] = useState({});
    const [selected, setSelected] = useState(null);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.doctors_list,
        url: URLS.doctors_list,
        params: {
            params: {
                size: 10,
                ...params,
            }
        },
        page
    });

    const { mutate } = useDeleteQuery({
        listKeyId: KEYS.doctors_list
    });
    const useDelete = (id) => {
        mutate({url: `${URLS.doctor_delete}/${id}`})
    }

    const onChange = (name,value) => {
        setParams(prevState => ({...prevState, [name]: value}))
    }

    const columns = [
        {
            title: (
                <Space direction="vertical">
                    {t("ID")}
                    <Input
                        placeholder={t("ID")}
                        allowClear
                        value={get(params,'userId','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChange('userId', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "id",
            key: "id",
        },
        {
            title: (
                <Space direction="vertical">
                    {t("FIO")}
                    <Input
                        placeholder={t("FIO")}
                        allowClear
                        value={get(params,'fio','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChange('fio', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "fio",
            key: "fio"
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
                            onChange('phone', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "phone",
            key: "phone"
        },
        {
            title: t("Second place"),
            dataIndex: "secondPlaceOfWork",
            key: "secondPlaceOfWork"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Specialization")}
                    <Input
                        allowClear
                        placeholder={t("Specialization")}
                        value={get(params,'specialization','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChange('specialization', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "specialization",
            key: "specialization"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Med institution")}
                    <Input
                        allowClear
                        placeholder={t("Med institution")}
                        value={get(params,'medInstitutionName','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChange('medInstitutionName', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "medInstitution",
            key: "medInstitution"
        },
        {
            title: t("Position"),
            dataIndex: "position",
            key: "position"
        },
        {
            title: t("Created by"),
            dataIndex: "createdBy",
            key: "createdBy"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Created at")}
                    <DatePicker
                        showTime
                        allowClear
                        format="YYYY-MM-DDTHH:mm:ss"
                        value={get(params, 'from') ? dayjs(get(params, 'from')) : null}
                        onChange={(date, dateString) => {
                            onChange('from', dateString);
                        }}
                    />
                </Space>
            ),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (props) => dayjs(props).format("YYYY-MM-DD HH:mm:ss"),
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
        }
    ]
    return (
        <Container>
            <Modal
                title={t('Edit')}
                open={!!selected}
                onCancel={() => setSelected(null)}
                footer={null}
            >
                <EditDoctor setSelected={setSelected} selected={selected} />
            </Modal>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                {/*<Space size={"middle"}>*/}
                {/*    <Input.Search*/}
                {/*        placeholder={t("Search")}*/}
                {/*        onChange={(e) => setSearchKey(e.target.value)}*/}
                {/*        allowClear*/}
                {/*    />*/}
                {/*</Space>*/}

                <Table
                    columns={columns}
                    dataSource={get(data,'data.content',[])}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading}
                    scroll={{ x: 'max-content' }}
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

export default DoctorsContainer;

import React, {useState} from 'react';
import Container from "../../components/Container.jsx";
import {
    Button,
    Checkbox,
    DatePicker,
    Input, message,
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
import {DeleteOutlined, EditOutlined, FileExcelOutlined, PlusOutlined} from "@ant-design/icons";
import useDeleteQuery from "../../hooks/api/useDeleteQuery.js";
import CreateEditDealers from "./components/CreateEditDealers.jsx";
import dayjs from "dayjs";
import {request} from "../../services/api/index.js";
import {saveAs} from "file-saver";

const DealersContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState(null);
    const [isCreateModalOpenCreate, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [params, setParams] = useState({});
    const [isDownloading, setIsDownloading] = useState(false);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.dealers_list,
        url: URLS.dealers_list,
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
        listKeyId: KEYS.dealers_list,
    });
    const useDelete = (id) => {
        mutate({url: `${URLS.dealers_delete}/${id}`})
    }

    const onChangeParams = (name, value) => {
        setParams(prevState => ({...prevState, [name]: value}));
    }

    const getExcel = async () => {
        try {
            const response = await request.get("/api/admin/dealers/export",{
                responseType: "blob",
                params: {
                    from: dayjs(get(params,'from')).format("YYYY-MM-DD"),
                    to: dayjs(get(params,'to')).format("YYYY-MM-DD"),
                }
            });
            const blob = new Blob([get(response,'data')]);
            saveAs(blob, `Dealer report ${dayjs().format("YYYY-MM-DD")}.xlsx`)
        }catch (error) {
            message.error(t("Fayl shakllantirishda xatolik"))
        }finally {
            setIsDownloading(false);
        }
    }

    const columns = [
        {
            title: (
                <Space direction="vertical">
                    {t("Username")}
                    <Input
                        placeholder={t("Username")}
                        allowClear
                        value={get(params,'username','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('username', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "username",
            key: "username"
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
                            onChangeParams('phone', value)
                        }}
                    />
                </Space>
            ),
            dataIndex: "phone",
            key: "phone"
        },
        {
            title: (
                <Space direction="vertical">
                    {t("Full name")}
                    <Input
                        placeholder={t("Full name")}
                        allowClear
                        value={get(params,'fullName','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('fullName', value)
                        }}
                    />
                </Space>
            ),
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
            title: (
                <Space direction="vertical">
                    {t("Is active")}
                    <Select
                        style={{width: 100}}
                        placeholder={t("Is active")}
                        allowClear
                        defaultValue={get(params,'active',true)}
                        value={get(params,'active','')}
                        options={[
                            {
                                label: 'Active',
                                value: true
                            },
                            {
                                label: 'Disable',
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
                    <Button icon={<FileExcelOutlined/>} type="primary" onClick={() => {
                        setIsDownloading(true);
                        getExcel()
                    }} loading={isDownloading} >
                        {t("Get excel")}
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
                <CreateEditDealers setIsModalOpen={setIsCreateModalOpen}/>
            </Modal>
            <Modal
                title={t("Edit")}
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <CreateEditDealers
                    selected={selected}
                    setIsModalOpen={setIsEditModalOpen}
                />
            </Modal>
        </Container>
    );
};

export default DealersContainer;

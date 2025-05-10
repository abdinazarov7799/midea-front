import React, {useState} from 'react';
import Container from "../../../components/Container.jsx";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {get, isEqual} from "lodash";
import {Button, Modal, Row, Space, Table} from "antd";
import {useTranslation} from "react-i18next";
import EditConstants from "../components/EditConstants.jsx";
import {EditOutlined} from "@ant-design/icons";

const ConstantsContainer = () => {
    const {t} = useTranslation();
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const {data,isLoading,refetch} = useGetAllQuery({
        key: KEYS.constants_list,
        url: URLS.constants_list,
    })
    const columns = [
        {
            title: t("Id"),
            dataIndex: "id",
            key: "id",
        },
        {
            title: t("Key"),
            dataIndex: "key",
            key: "key",
        },
        {
            title: t("Value"),
            dataIndex: "value",
            key: "value",
        },
        {
            title: t("Comment"),
            dataIndex: "comment",
            key: "comment",
        },
        {
            title: t("Edit"),
            dataIndex: "edit",
            key: "edit",
            width: 100,
            render: (props, data, index) => (
                <Button key={index} icon={<EditOutlined />} onClick={() => {
                    setIsModalOpen(true)
                    setSelected(data)
                }} />
            )
        }
    ]

    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Table
                    columns={columns}
                    dataSource={get(data,'data',[])}
                    bordered
                    size={"middle"}
                    pagination={false}
                    loading={isLoading}
                />
            </Space>
            <Modal
                title={t('Edit')}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <EditConstants setIsModalOpen={setIsModalOpen} selected={selected} />
            </Modal>
        </Container>
    );
};

export default ConstantsContainer;

import React, {useState} from 'react';
import Container from "../../components/Container.jsx";
import {Button, Checkbox, Descriptions, Modal, Pagination, Row, Space, Table, Typography} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../constants/key.js";
import {URLS} from "../../constants/url.js";
import dayjs from "dayjs";
import {EyeOutlined} from "@ant-design/icons";

const StockMovementsContainer = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [params, setParams] = useState({});
    const [selected, setSelected] = useState(null);

    const {data,isLoading} = usePaginateQuery({
        key: KEYS.stock_movements_list,
        url: URLS.stock_movements_list,
        params: {
            params: {
                size: 10,
                ...params
            }
        },
        page
    });

    const onChangeParams = (name, value) => {
        setParams(prevState => ({...prevState, [name]: value}));
    }

    const columns = [
        {
            title: t("Order id"),
            dataIndex: "orderId",
            key: "orderId",
        },
        {
            title: t("From warehouse"),
            dataIndex: "fromWarehouse",
            key: "fromWarehouse",
        },
        {
            title: t("From section"),
            dataIndex: "fromSection",
            key: "fromSection"
        },
        {
            title: t("To warehouse"),
            dataIndex: "toWarehouse",
            key: "toWarehouse",
        },
        {
            title: t("To section"),
            dataIndex: "toSection",
            key: "toSection"
        },
        {
            title: t("Comment"),
            dataIndex: "comment",
            key: "comment"
        },
        {
            title: t("User"),
            dataIndex: "user",
            key: "user"
        },
        {
            title: t("Confirmed by"),
            dataIndex: "confirmedBy",
            key: "confirmedBy"
        },
        {
            title: t("Reason"),
            dataIndex: "reason",
            key: "reason",
            render: (props) => <Button icon={<EyeOutlined />} onClick={() => setSelected(props)} type="primary" />
        },
        {
            title: t("Created at"),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (props) => dayjs(props).format('YYYY-MM-DD HH:mm:ss'),
        },
    ]
    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
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
            <Modal open={!!selected} footer={null} onCancel={() => setSelected(null)}>
                <Descriptions
                    bordered
                    column={1}
                    items={[
                        {
                            label: t("Label"),
                            children: get(selected, "label"),
                        },
                        {
                            label: t("Code"),
                            children: get(selected, "code"),
                        },
                        {
                            label: t("Penalty"),
                            children: <Checkbox checked={get(selected, "penalty")} />,
                        },
                        {
                            label: t("Penalty amount"),
                            children: get(selected, "penaltyAmount"),
                        },
                    ]}
                />
            </Modal>
        </Container>
    );
};

export default StockMovementsContainer;

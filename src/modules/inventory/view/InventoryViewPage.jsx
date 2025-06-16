import React, { useState } from 'react';
import Container from "../../../components/Container.jsx";
import usePaginateQuery from "../../../hooks/api/usePaginateQuery.js";
import {useNavigate, useParams} from "react-router-dom";
import {List, Card, Divider, Button} from "antd";
import { get } from "lodash";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import {ArrowLeftOutlined} from "@ant-design/icons";

const InventoryViewPage = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [page, setPage] = useState(0);
    const [pageLogs, setPageLogs] = useState(0);
    const navigate = useNavigate();

    const { data:logs, isLoading:isLoadingLogs } = usePaginateQuery({
        key: ["inventory_log", id],
        url: `/api/admin/inventory_logs/get/${id}`,
        params: { params: { size: 20 } },
        page: pageLogs
    });

    return (
        <Container>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/inventories')}>{t("Orqaga")}</Button>
            <Divider>
                {t("Inventar harakatlari tarixi")}
            </Divider>
            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={get(logs, 'data.content', [])}
                loading={isLoadingLogs}
                pagination={{
                    current: pageLogs + 1,
                    total: logs?.data?.totalElements || 0,
                    pageSize: 20,
                    onChange: (p) => setPageLogs(p - 1)
                }}
                renderItem={item => (
                    <List.Item>
                        <Card title={`${t("Amal")}: ${get(item,'action')}`}>
                            <p><b>{t("Mahsulot")}:</b> {get(item,'product')}</p>
                            <p><b>{t("Miqdor")}:</b> {get(item,'quantity')}</p>
                            <p><b>{t("Sabab")}:</b> {get(item,'reason')}</p>
                            <p><b>{t("Ombor")}:</b> {get(item,'warehouse')} | <b>{t("Bo‘lim")}:</b> {get(item,'section')}</p>
                            <p><b>{t("Kim tomonidan")}:</b> {get(item,'createdBy.fullName') || t("Noma'lum")}</p>
                            <p><b>{t("Vaqt")}:</b> {dayjs(get(item,'createdAt')).format("YYYY-MM-DD HH:mm")}</p>
                        </Card>
                    </List.Item>
                )}
            />
        </Container>
    );
};

export default InventoryViewPage;

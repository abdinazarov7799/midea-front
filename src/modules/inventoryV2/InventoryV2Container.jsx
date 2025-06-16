import React, {useState} from 'react';
import Container from "../../components/Container.jsx";
import {Card, DatePicker, Input, List, Pagination, Row, Space, Table, Typography} from "antd";
import {get} from "lodash";
import {useTranslation} from "react-i18next";
import usePaginateQuery from "../../hooks/api/usePaginateQuery.js";
import {KEYS} from "../../constants/key.js";
import {URLS} from "../../constants/url.js";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";

const InventoryV2Container = () => {
    const {t} = useTranslation();
    const [page, setPage] = useState(0);
    const [params, setParams] = useState({});

    const { data,isLoading } = usePaginateQuery({
        key: ["inventories"],
        url: `/api/admin/inventories`,
        params: {
            params: {
                size: 20,
                ...params,
                from: get(params,'from') ? get(params,'from')?.toISOString() : null,
                to: get(params,'to') ? get(params,'to')?.toISOString() : null
            }
        },
        page
    });


    const onChangeParams = (name, value) => {
        setParams(prevState => ({...prevState, [name]: value}));
    }


    return (
        <Container>
            <Space direction={"vertical"} style={{width: "100%"}} size={"middle"}>
                <Space size={"middle"}>
                    <Input
                        placeholder={t("Category")}
                        allowClear
                        value={get(params,'categoryName','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('categoryName', value)
                        }}
                    />
                    <Input
                        placeholder={t("Product model")}
                        allowClear
                        value={get(params,'productModel','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('productModel', value)
                        }}
                    />
                    <Input
                        placeholder={t("Warehouse name")}
                        allowClear
                        value={get(params,'warehouseName','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('warehouseName', value)
                        }}
                    />
                    <Input
                        placeholder={t("Section name")}
                        allowClear
                        value={get(params,'sectionName','')}
                        onChange={(e) => {
                            const value = get(e,'target.value');
                            onChangeParams('sectionName', value)
                        }}
                    />
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
                </Space>

                <List
                    grid={{ gutter: 16, column: 4 }}
                    // style={{maxWidth: '99%'}}
                    dataSource={get(data, 'data.content', [])}
                    loading={isLoading}

                    renderItem={item => (
                        <List.Item>
                            <Card title={`📦 ${get(item, 'model')}`}>
                                <p><b>{t("Ombor")}:</b> {get(item, 'warehouse')}</p>
                                <p><b>{t("Umumiy miqdor")}:</b> {get(item, 'quantity')}</p>
                                <ul>
                                    {(get(item, 'sections', [])).map((s, i) => (
                                        <li key={i}>
                                            <b>{t("Bo‘lim")}:</b> {s.section} — <b>{t("Miqdor")}:</b> {s.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </List.Item>
                    )}
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

export default InventoryV2Container;

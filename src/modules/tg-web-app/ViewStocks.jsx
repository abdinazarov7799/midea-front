import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import {Pagination, Row, Table, Typography} from 'antd';
import { useTranslation } from 'react-i18next';
import usePaginateQuery from "../../hooks/api/usePaginateQuery.js";
import Container from "../../components/Container.jsx";
import {get} from "lodash";

const { Text } = Typography;

const ViewStocksPage = () => {
    const { dealerId, roleId, userId } = useParams();
    const { t } = useTranslation();
    const [page, setPage] = useState(0);

    const { data,isLoading } = usePaginateQuery({
        key: ['order', dealerId],
        url: `/api/web/warehouses/get-stocks/${dealerId}`,
        params: { params: { size: 100 } },
        page
    });

    const columns = [
        {
            title: '#',
            key: 'index',
            render: (text, record,index) => index + 1,
            width: 30,
            align: 'left',
        },
        {
            title: t('Nomi'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: t('Modeli'),
            dataIndex: 'model',
            key: 'model',
        },
        {
            title: t('Soni'),
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'right',
        },
    ]

    return (
        <Container>
            <Table
                size={'small'}
                columns={columns}
                dataSource={get(data,'data.content',[])}
                pagination={false}
                loading={isLoading}
            />
            <Row justify={"space-between"} style={{marginTop: 10}}>
                <Typography.Title level={5}>
                    {t("Miqdori")}: {get(data,'data.totalElements')} {t("ta")}
                </Typography.Title>
                <Pagination
                    current={page+1}
                    size={'small'}
                    onChange={(page) => setPage(page - 1)}
                    total={get(data,'data.totalPages') * 10 }
                    showSizeChanger={false}
                />
            </Row>
        </Container>
    );
};

export default ViewStocksPage;

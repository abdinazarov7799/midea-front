import React from 'react';
import Container from "../../components/Container.jsx";
import {useTelegram} from "../../hooks/telegram/useTelegram.js";
import {Button, Checkbox, Form, Input, InputNumber, Select} from "antd";
import {useTranslation} from "react-i18next";
import useGetAllQuery from "../../hooks/api/useGetAllQuery.js";
import {get} from "lodash";
import usePostQuery from "../../hooks/api/usePostQuery.js";

const CreateClientPage = () => {
    const [form] = Form.useForm();
    const {t} = useTranslation();
    const telegram = useTelegram();
    const [isLegal, setIsLegal] = React.useState(false);

    const {data, isLoading} = useGetAllQuery({
        key: 'web-dealers-list',
        url: '/api/web/dealers/get-all',
        params: {
            params: {
                size: 1000
            }
        }
    })
    const {mutate, isLoading: isLoadingCreate} = usePostQuery({})

    const createClient = (values) => {
        mutate({
            url: "/api/web/clients/create",
            attributes: {...values,legal: isLegal}
        }, {
            onSuccess: () => {
                telegram.onClose();
            },
        })
    };

    return (
        <Container>
            <Form form={form} onFinish={createClient} layout="vertical">
                <Form.Item
                    label={t("Dealer")}
                    name="dealerId"
                    rules={[{required: true,}]}>
                    <Select
                        showSearch
                        placeholder={t("Dealer")}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        loading={isLoading}
                        options={get(data, 'data.content')?.map((item) => {
                            return {
                                value: get(item, 'id'),
                                label: get(item, 'fullName')
                            }
                        })}
                    />
                </Form.Item>
                <Form.Item name={'name'} rules={[{required: true}]} label={'Name'}>
                    <Input/>
                </Form.Item>
                <Form.Item name={'phone'} rules={[{required: true}]} label={'Phone'}>
                    <Input/>
                </Form.Item>
                <Form.Item name={'type'} rules={[{required: true}]} label={'Type'}>
                    <Select options={[{label: t("ACCOUNTED"), value: 'ACCOUNTED'}, {
                        label: t("NON_ACCOUNTED"),
                        value: 'NON_ACCOUNTED'
                    }]}/>
                </Form.Item>
                <Form.Item name={'balance'} rules={[{required: true}]} label={'Balance'}>
                    <InputNumber style={{width: '100%'}}/>
                </Form.Item>
                <Form.Item name={'legal'} label={'Legal'}>
                    <Checkbox checked={isLegal} onChange={() => setIsLegal(prevState => !prevState)}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={isLoading || isLoadingCreate}>
                        {t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </Container>
    );
};

export default CreateClientPage;
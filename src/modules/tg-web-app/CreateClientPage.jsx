import React from 'react';
import Container from "../../components/Container.jsx";
import {useTelegram} from "../../hooks/telegram/useTelegram.js";
import {Button, Checkbox, Form, Input, Select} from "antd";
import {useTranslation} from "react-i18next";
import useGetAllQuery from "../../hooks/api/useGetAllQuery.js";
import {get} from "lodash";
import usePostQuery from "../../hooks/api/usePostQuery.js";
import {useParams} from "react-router-dom";
import InputMask from 'react-input-mask';
import {ArrowLeftOutlined} from "@ant-design/icons";

const CreateClientPage = () => {
    const {roleId,userId} = useParams()
    const [form] = Form.useForm();
    const {t} = useTranslation();
    const params = window.location.search

    // const {data, isLoading} = useGetAllQuery({
    //     key: ['web-dealers-list',userId],
    //     url: '/api/web/dealers/get-all',
    //     params: {
    //         params: {
    //             size: 1000,
    //             userId
    //         }
    //     }
    // })
    const {mutate, isLoading: isLoadingCreate} = usePostQuery({})

    const createClient = (values) => {
        mutate({
            url: "/api/web/clients/create",
            attributes: {...values,legal: values?.legal || false,creatorId: userId, phone: `+998${values.phone?.trim()}`},
        }, {
            onSuccess: () => {

            },
        })
    };

    return (
        <Container>
            {!!params && <Button icon={<ArrowLeftOutlined/>} style={{marginBottom: 10}} onClick={() => history.back()}>{t("Orqaga")}</Button>}
            <Form form={form} onFinish={createClient} layout="vertical">
                {/*<Form.Item*/}
                {/*    label={t("Dealer")}*/}
                {/*    name="dealerId"*/}
                {/*    rules={[{required: true,}]}>*/}
                {/*    <Select*/}
                {/*        showSearch*/}
                {/*        placeholder={t("Dealer")}*/}
                {/*        optionFilterProp="children"*/}
                {/*        filterOption={(input, option) =>*/}
                {/*            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}*/}
                {/*        loading={isLoading}*/}
                {/*        options={get(data, 'data.content')?.map((item) => {*/}
                {/*            return {*/}
                {/*                value: get(item, 'id'),*/}
                {/*                label: get(item, 'fullName')*/}
                {/*            }*/}
                {/*        })}*/}
                {/*    />*/}
                {/*</Form.Item>*/}
                <Form.Item name={'name'} rules={[{required: true}]} label={'Name'}>
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="phone"
                    label={t('Phone')}
                    rules={[
                        { required: true, message: t("Phone is required") },
                        {
                            pattern: /^\d{9}$/,
                            message: t("Invalid phone number"),
                        }
                    ]}
                >
                    <InputMask
                        mask="99 999 99 99"
                        maskChar={null}
                        onChange={(e) => {
                            const onlyDigits = e.target.value.replace(/\D/g, '');
                            form.setFieldsValue({ phone: onlyDigits });
                        }}
                    >
                        {(inputProps) => (
                            <Input
                                {...inputProps}
                                addonBefore="+998"
                                maxLength={12}
                            />
                        )}
                    </InputMask>
                </Form.Item>
                <Form.Item name={'type'} rules={[{required: true}]} label={'Type'}>
                    <Select options={[{label: t("ACCOUNTED"), value: 'ACCOUNTED'}, {
                        label: t("NON_ACCOUNTED"),
                        value: 'NON_ACCOUNTED'
                    }]}/>
                </Form.Item>
                <Form.Item name={'legal'} label={'Legal'} valuePropName={'checked'}>
                    <Checkbox defaultChecked={false} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={isLoadingCreate}>
                        {t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </Container>
    );
};

export default CreateClientPage;

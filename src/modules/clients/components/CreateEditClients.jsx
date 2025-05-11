import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Checkbox, Form, Input, InputNumber, Select} from "antd";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePatchQuery.js";

const CreateEditClients = ({selected,setIsModalOpen}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [legal, setLegal] = useState(get(selected,'legal',false));

    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.clients_list,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.clients_list,
    });

    const { data:dealers,isLoading:isLoadingDealers } = useGetAllQuery({
        key: KEYS.dealers_list,
        url: URLS.dealers_list,
        params: {
            params: {
                size: 1000
            }
        }
    })

    const { data:clientTypes,isLoading:isLoadingClientTypes } = useGetAllQuery({
        key: KEYS.client_types_list,
        url: URLS.client_types_list,
        params: {
            params: {
                size: 1000
            }
        }
    })

    useEffect(() => {
        form.setFieldsValue({
            name: get(selected,'name'),
            balance: get(selected,'balance'),
            phone: get(selected,'phone'),
            type: get(selected,'type'),
            dealerId: get(selected,'dealer.id'),
        });
        setLegal(get(selected,'legal',false));
    }, [selected]);

    const onFinish = (values) => {
        const formData = {
            ...values,
            legal,
        }
        if (selected){
            mutateEdit(
                { url: `${URLS.clients_edit}/${get(selected,'id')}`, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.clients_add, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }
    };

    return (
        <>
            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={"vertical"}
                form={form}
            >
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
                        loading={isLoadingDealers}
                        options={get(dealers,'data.content')?.map((item) => {
                            return {
                                value: get(item,'id'),
                                label: get(item,'fullName')
                            }
                        })}
                    />
                </Form.Item>

                <Form.Item
                    label={t("Type")}
                    name="type"
                    rules={[{required: true,}]}>
                    <Select
                        showSearch
                        placeholder={t("Type")}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        loading={isLoadingClientTypes}
                        options={get(clientTypes,'data')?.map((item) => {
                            return {
                                value: item,
                                label: t(item)
                            }
                        })}
                    />
                </Form.Item>

                <Form.Item
                    label={t("Name")}
                    name="name"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Phone")}
                    name="phone"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Balance")}
                    name="balance"
                    rules={[{required: true,}]}
                >
                    <InputNumber style={{width:'100%'}} />
                </Form.Item>

                <Form.Item
                    name="legal"
                    valuePropName="legal"
                >
                    <Checkbox checked={legal} onChange={(e) => setLegal(e.target.checked)}>{t("is Legal")} ?</Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading || isLoadingEdit}>
                        {selected ? t("Edit") : t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateEditClients;

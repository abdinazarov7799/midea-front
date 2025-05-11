import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Checkbox, Form, Input, InputNumber, Select} from "antd";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePatchQuery.js";

const CreateEditProducts = ({selected,setIsModalOpen}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [isActive, setIsActive] = useState(get(selected,'active',true));

    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.products_list,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.products_list,
    });

    const { data:categories,isLoading:isLoadingCategory } = useGetAllQuery({
        key: KEYS.categories_list,
        url: URLS.categories_list,
        params: {
            params: {
                size: 1000
            }
        }
    })

    useEffect(() => {
        form.setFieldsValue({
            model: get(selected,'model'),
            price: get(selected,'price'),
            managerInterest: get(selected,'managerInterest'),
            teamLeadInterest: get(selected,'teamLeadInterest'),
            dealerInterest: get(selected,'dealerInterest'),
            categoryId: get(selected,'category.id'),
        });
        setIsActive(get(selected,'active',true));
    }, [selected]);

    const onFinish = (values) => {
        const formData = {
            ...values,
            active: isActive,
        }
        if (selected){
            mutateEdit(
                { url: `${URLS.products_edit}/${get(selected,'id')}`, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.products_add, attributes: formData },
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
                    label={t("Category")}
                    name="categoryId"
                    rules={[{required: true,}]}>
                    <Select
                        showSearch
                        placeholder={t("Category")}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        loading={isLoadingCategory}
                        options={get(categories,'data.content')?.map((item) => {
                            return {
                                value: get(item,'id'),
                                label: get(item,'name')
                            }
                        })}
                    />
                </Form.Item>

                <Form.Item
                    label={t("Model")}
                    name="model"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Price")}
                    name="price"
                    rules={[{required: true,}]}
                >
                    <InputNumber style={{width: "100%"}} />
                </Form.Item>

                <Form.Item
                    label={t("Manager interest")}
                    name="managerInterest"
                    rules={[{required: true,}]}
                >
                    <InputNumber style={{width: "100%"}} />
                </Form.Item>

                <Form.Item
                    label={t("Team lead interest")}
                    name="teamLeadInterest"
                    rules={[{required: true,}]}
                >
                    <InputNumber style={{width: "100%"}} />
                </Form.Item>

                <Form.Item
                    label={t("Dealer interest")}
                    name="dealerInterest"
                    rules={[{required: true,}]}
                >
                    <InputNumber style={{width: "100%"}} />
                </Form.Item>

                <Form.Item
                    name="active"
                    valuePropName="active"
                >
                    <Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)}>{t("is active")} ?</Checkbox>
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

export default CreateEditProducts;

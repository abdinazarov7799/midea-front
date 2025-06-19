import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Checkbox, Form, Input, Select} from "antd";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePatchQuery.js";

const CreateEditCashiers = ({selected,setIsModalOpen}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [isActive, setIsActive] = useState(get(selected,'active',true));

    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.cashiers_list,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.cashiers_list,
    });

    useEffect(() => {
        form.setFieldsValue({
            username: get(selected,'username'),
            password: get(selected,'password'),
            phone: get(selected,'phone'),
            fullName: get(selected,'full_name'),
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
                { url: `${URLS.cashiers_edit}/${get(selected,'id')}`, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.cashiers_add, attributes: formData },
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
                    label={t("Username")}
                    name="username"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={t("Password")}
                    name="password"
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
                    label={t("Full name")}
                    name="fullName"
                    rules={[{required: true,}]}
                >
                    <Input />
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

export default CreateEditCashiers;

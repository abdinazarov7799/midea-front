import React, {useEffect} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Form, Input, Select} from "antd";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePatchQuery.js";

const CreateEditAdmin = ({itemData,setIsModalOpen,refetch}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.admins_list,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.admins_list,
        hideSuccessToast: false
    });


    const {data:roles,isLoading:isLoadingRoles} = useGetAllQuery({
        key: 'roles_list',
        url: '/api/common/roles/get',
    })

    useEffect(() => {
        form.setFieldsValue({
            ...itemData
        });
    }, [itemData]);

    const onFinish = (values) => {
        if (itemData){
            mutateEdit(
                { url: `${URLS.admin_edit}/${get(itemData,'id')}`, attributes: values },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.admin_add, attributes: values },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
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
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label={t("Role")}
                    name="roleId"
                    rules={[{required: true,}]}>
                    <Select
                        loading={isLoadingRoles}
                        placeholder={t("Role")}
                        options={get(roles,'data',[])?.map((item) => {
                            return {
                                value: get(item,'id'),
                                label: get(item,'name'),
                            }
                        })}
                    />
                </Form.Item>

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading || isLoadingEdit}>
                        {itemData ? t("Edit") : t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateEditAdmin;

import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Checkbox, Form, Input, Select} from "antd";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import {get} from "lodash";
import usePutQuery from "../../../hooks/api/usePatchQuery.js";

const CreateEditTeamLeads = ({selected,setIsModalOpen}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [active, setActive] = useState(get(selected,'active',true));
    const [canActAsManager, setCanActAsManager] = useState(get(selected,'canActAsManager',true));

    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.team_leads_list,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.team_leads_list,
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

    useEffect(() => {
        form.setFieldsValue({
            username: get(selected,'username'),
            password: get(selected,'password'),
            phone: get(selected,'phone'),
            fullName: get(selected,'fullName'),
            dealerId: get(selected,'dealer.id'),
        });
        setActive(get(selected,'active',true));
        setCanActAsManager(get(selected,'canActAsManager',true));
    }, [selected]);

    const onFinish = (values) => {
        const formData = {
            ...values,
            active,
            canActAsManager,
        }
        if (selected){
            mutateEdit(
                { url: `${URLS.team_leads_edit}/${get(selected,'id')}`, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.team_leads_add, attributes: formData },
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
                    <Checkbox checked={active} onChange={(e) => setActive(e.target.checked)}>{t("is active")} ?</Checkbox>
                </Form.Item>

                <Form.Item
                    name="canActAsManager"
                    valuePropName="canActAsManager"
                >
                    <Checkbox checked={canActAsManager} onChange={(e) => setCanActAsManager(e.target.checked)}>{t("Can act as manager")} ?</Checkbox>
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

export default CreateEditTeamLeads;

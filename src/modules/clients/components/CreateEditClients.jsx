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
    const [selectedDealerId, setSelectedDealerId] = useState(null);
    const [selectedTeamLeadId, setSelectedTeamLeadId] = useState(null);

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

    const { data:teamLeads,isLoading:isLoadingTeamLeads } = useGetAllQuery({
        key: [KEYS.team_leads_list, selectedDealerId],
        url: `${URLS.team_leads_by_dealer}/${selectedDealerId}`,
        enabled: !!selectedDealerId,
        params: {
            params: {
                size: 1000
            }
        }
    })

    const { data:managers,isLoading:isLoadingManagers } = useGetAllQuery({
        key: [KEYS.managers_list, selectedTeamLeadId],
        url: `${URLS.managers_by_team_lead}/${selectedTeamLeadId}`,
        enabled: !!selectedTeamLeadId,
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
            dealerId: get(selected,'dealer.id'),
            teamLeadId: get(selected,'teamLead.id'),
            managerId: get(selected,'manager.id'),
        });
        setLegal(get(selected,'legal',false));
        setSelectedDealerId(get(selected,'dealer.id'));
        setSelectedTeamLeadId(get(selected,'teamLead.id'));
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
                        onChange={(value) => {
                            setSelectedDealerId(value);
                            setSelectedTeamLeadId(null);
                            form.setFieldsValue({teamLeadId: null, managerId: null});
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label={t("Team Lead")}
                    name="teamLeadId"
                    rules={[{required: true,}]}>
                    <Select
                        showSearch
                        placeholder={t("Team Lead")}
                        disabled={!selectedDealerId}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        loading={isLoadingTeamLeads}
                        options={get(teamLeads,'data.content')?.map((item) => {
                            return {
                                value: get(item,'id'),
                                label: get(item,'fullName')
                            }
                        })}
                        onChange={(value) => {
                            setSelectedTeamLeadId(value);
                            form.setFieldsValue({managerId: null});
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label={t("Manager")}
                    name="managerId"
                    rules={[{required: true,}]}>
                    <Select
                        showSearch
                        placeholder={t("Manager")}
                        disabled={!selectedTeamLeadId}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                        loading={isLoadingManagers}
                        options={get(managers,'data.content')?.map((item) => {
                            return {
                                value: get(item,'id'),
                                label: get(item,'fullName')
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

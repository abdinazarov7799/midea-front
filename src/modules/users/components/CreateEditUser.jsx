import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Form, Input, Select, Switch} from "antd";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import {get, head, isArray, isEmpty} from "lodash";
import usePatchQuery from "../../../hooks/api/usePatchQuery.js";

const CreateEditUser = ({itemData,setIsModalOpen,refetch}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [selectedRegionId, setSelectedRegionId] = useState(null);
    const [districts, setDistricts] = useState([]);

    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.users_list,
    });

    const { mutate:mutateDisticts, isLoading:isLoadingDistricts } = usePostQuery({
        listKeyId: KEYS.users_list,
        hideSuccessToast: true
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePatchQuery({
        listKeyId: KEYS.users_list,
        hideSuccessToast: false
    });

    useEffect(() => {
        if (!isEmpty(selectedRegionId) && isArray(selectedRegionId)) {
            mutateDisticts(
                {
                    url: URLS.district_list, attributes: selectedRegionId
                },
                {
                    onSuccess: ({data}) => {
                        setDistricts(data)
                    }
                }
            )
        }
    },[selectedRegionId])

    // const {data:districts,isLoading:isLoadingDistricts} = useGetAllQuery({
    //     key: `${KEYS.district_list}_${selectedRegionId}`,
    //     url: URLS.district_list,
    //     params: {
    //         params: {
    //             size: 1000,
    //             regionId: selectedRegionId
    //         }
    //     },
    //     enabled: !!selectedRegionId || !!get(itemData,'region')
    // });
    const { data:regions,isLoading:isLoadingRegions } = useGetAllQuery({
        key: KEYS.region_list,
        url: URLS.region_list,
        params: {
            params: {
                size: 1000
            }
        }
    })

    useEffect(() => {
        const regionIds = get(itemData,'region')?.map(item => get(item,'id'));
        setSelectedRegionId(regionIds);
        form.setFieldsValue({
            firstName: get(itemData,'firstname'),
            lastName: get(itemData,'lastName'),
            phoneNumber: get(itemData,'phoneNumber'),
            region: regionIds,
            districtIds: get(itemData,'district')?.map(item => get(item,'id')),
            blocked: get(itemData,'blocked'),
        });
    }, [itemData]);

    const onFinish = (values) => {
        const {region,blocked,...formData} = values;

        if (itemData){
            mutateEdit(
                { url: `${URLS.user_edit}/${get(itemData,'id')}`, attributes: {...formData, blocked: !!blocked} },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.user_add, attributes: {...formData, blocked: !!blocked} },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }
    };

    const phoneNumberRegex = /^(\+998[0-9]{9})$/;

    return (
        <>
            <Form
                onFinish={onFinish}
                autoComplete="off"
                layout={"vertical"}
                form={form}
            >
                <Form.Item
                    label={t("First name")}
                    name="firstName"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t("Last name")}
                    name="lastName"
                    rules={[{required: true,}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label={t("Phone number")}
                    name="phoneNumber"
                    rules={[
                        { required: true, message: t("Please enter your phone number") },
                        { pattern: phoneNumberRegex, message: t("Invalid phone number format") },
                    ]}
                >
                    <Input placeholder="+998xxxxxxxxx" />
                </Form.Item>
                <Form.Item
                    label={t("Region")}
                    name="region"
                    rules={[{required: true,}]}>
                    <Select
                        placeholder={t("Region")}
                        loading={isLoadingRegions}
                        mode={"multiple"}
                        options={get(regions,'data.content',[])?.map((item) => {
                            return {
                                value: get(item,'id'),
                                label: `${get(item,'nameUz')} / ${get(item,'nameRu')}`,
                            }
                        })}
                        onChange={(value) => setSelectedRegionId(value)}
                    />
                </Form.Item>
                <Form.Item
                    label={t("Districts")}
                    name="districtIds"
                    rules={[{required: true,}]}>
                    <Select
                        placeholder={t("District")}
                        loading={isLoadingDistricts}
                        mode={"multiple"}
                        options={districts?.map((item) => {
                            return {
                                value: get(item,'id'),
                                label: `${get(item,'nameUz')} / ${get(item,'nameRu')}`,
                            }
                        })}
                    />
                </Form.Item>
                <Form.Item
                    label={t("Blocked")}
                    name="blocked"
                >
                    <Switch defaultValue={false}/>
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

export default CreateEditUser;

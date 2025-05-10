import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import usePostQuery from "../../../hooks/api/usePostQuery.js";
import {KEYS} from "../../../constants/key.js";
import {URLS} from "../../../constants/url.js";
import {Button, Form, Input, Select} from "antd";
import useGetAllQuery from "../../../hooks/api/useGetAllQuery.js";
import {get, isArray, isEmpty, isEqual} from "lodash";
import usePutQuery from "../../../hooks/api/usePatchQuery.js";
import config from "../../../config.js";

const CreateEditProduct = ({itemData,setIsModalOpen,refetch}) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedRegionId, setSelectedRegionId] = useState(null);
    const [districts, setDistricts] = useState([]);

    const { mutate, isLoading } = usePostQuery({
        listKeyId: KEYS.admins_list,
    });
    const { mutate:mutateEdit, isLoading:isLoadingEdit } = usePutQuery({
        listKeyId: KEYS.admins_list,
        hideSuccessToast: false
    });

    useEffect(() => {
        const regionIds = get(itemData,'region')?.map(item => get(item,'id'));
        setSelectedRegionId(regionIds);
        form.setFieldsValue({
            role: get(itemData,'role'),
            username: get(itemData,'username'),
            password: get(itemData,'password'),
            region: regionIds,
            districtIds: get(itemData,'districtIds'),
        });
    }, [itemData]);

    const { mutate:mutateDisticts, isLoading:isLoadingDistricts } = usePostQuery({
        listKeyId: KEYS.users_list,
        hideSuccessToast: true
    });

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

    const onFinish = (values) => {
        const {region,...formData} = values;
        if (itemData){
            mutateEdit(
                { url: `${URLS.admin_edit}/${get(itemData,'id')}`, attributes: formData },
                {
                    onSuccess: () => {
                        setIsModalOpen(false);
                        refetch()
                    },
                }
            );
        }else {
            mutate(
                { url: URLS.admin_add, attributes: formData },
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
                    name="role"
                    rules={[{required: true,}]}>
                    <Select
                        placeholder={t("Role")}
                        options={Object.values(config.ROLES)?.map((item) => {
                            return {
                                value: item,
                                label: item
                            }
                        })}
                        onChange={(values) => {
                            setSelectedRole(values);
                        }}
                    />
                </Form.Item>

                {
                    isEqual(selectedRole,config.ROLES.ROLE_AREA_ADMIN) && (
                        <>
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
                        </>
                    )
                }

                <Form.Item>
                    <Button block type="primary" htmlType="submit" loading={isLoading || isLoadingEdit}>
                        {itemData ? t("Edit") : t("Create")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CreateEditProduct;
